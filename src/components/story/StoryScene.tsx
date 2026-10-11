import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PerformanceMonitor, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { milestones } from "@/data/story";
import { MilestoneObject } from "./MilestoneObject";
import { cardSide } from "./layout";
import { DARK_SCENE, LIGHT_SCENE, SceneColors, useSceneColors } from "./palette";
import { useTheme } from "@/hooks/useTheme";

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SPACING = 11;
const COUNT = milestones.length;

// One point before the story starts, then one per milestone, winding through space
const points = [
  new THREE.Vector3(0, -1, SPACING),
  ...milestones.map((_, i) => new THREE.Vector3(Math.sin(i * 1.1) * 3.2, Math.cos(i * 0.8) * 1.4, -i * SPACING)),
];
const path = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
// getPoint(t) gives every segment an equal share of t, so milestone i sits exactly here
const paramOf = (i: number) => (i + 1) / (points.length - 1);
// Arc length at each step of t, for drawing the line up to the camera
const LENGTH_STEPS = 400;
const lengths = path.getLengths(LENGTH_STEPS);
const lengthAt = (u: number) => lengths[Math.round(THREE.MathUtils.clamp(u, 0, 1) * LENGTH_STEPS)];

// Desktop: objects sit beside the path, opposite their card. Phones: above the marker,
// since the card fills the bottom of the screen.
const objectOffset = (i: number) => (isMobile ? 0 : cardSide(i) === "left" ? 2.4 : -2.4);
const objectLift = isMobile ? 1.7 : 0.4;

// Eases between milestones: mostly smootherstep, so the camera settles at each one,
// blended with a little linear motion so it never quite stops while you scroll
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const ease = (t: number) => t + (smootherstep(t) - t) * 0.7;

/** Where the camera is along the story, shared by everything that follows it. */
type Travel = { x: number; u: number };

function CameraRig({ progress, travel }: { progress: MotionValue<number>; travel: Travel }) {
  const focus = useRef(new THREE.Vector3());
  const mouse = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    const x = progress.get() * (COUNT - 1);
    const i = Math.min(Math.floor(x), COUNT - 2);
    const f = THREE.MathUtils.clamp(x - i, 0, 1);
    const eased = reducedMotion ? Math.round(f) : ease(f);
    const target = paramOf(i) + (paramOf(i + 1) - paramOf(i)) * eased;

    const dt = Math.min(delta, 0.1);
    travel.u = reducedMotion ? target : THREE.MathUtils.damp(travel.u, target, 5, dt);
    travel.x = reducedMotion ? x : THREE.MathUtils.damp(travel.x, x, 5, dt);
    path.getPoint(travel.u, focus.current);

    // Gentle parallax from the mouse on desktop
    mouse.current.lerp(state.pointer, 0.05);
    const sway = isMobile || reducedMotion ? 0 : 1;

    state.camera.position.set(
      focus.current.x + mouse.current.x * 0.6 * sway,
      focus.current.y + 1.4 + mouse.current.y * 0.3 * sway,
      focus.current.z + (isMobile ? 9.5 : 7.5)
    );
    // On phones the card covers the bottom half, so aim low to put the object in the top half
    state.camera.lookAt(focus.current.x, focus.current.y - (isMobile ? 0.9 : 0), focus.current.z);
  });

  return null;
}

/**
 * The route through the story: a faint line for the whole way, an ink line drawn
 * up to where you are, and a red pen tip at its end.
 */
function StoryPath({ travel }: { travel: Travel }) {
  const c = useSceneColors();
  const drawn = useRef<THREE.Object3D & { material: { dashSize: number } }>(null);
  const tip = useRef<THREE.Mesh>(null);
  const linePoints = useMemo(() => path.getPoints(300), []);
  const at = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    // A single dash as long as the distance travelled draws the line up to the camera
    if (drawn.current) drawn.current.material.dashSize = lengthAt(travel.u);
    path.getPoint(travel.u, at);
    tip.current?.position.copy(at);
  });

  return (
    <>
      <Line points={linePoints} color={c.ink} lineWidth={1} transparent opacity={0.18} />
      <Line ref={drawn as never} points={linePoints} color={c.ink} lineWidth={1.8} dashed dashSize={0} gapSize={1e4} />
      <mesh ref={tip}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={c.poppy} />
      </mesh>
    </>
  );
}

const tmpColor = new THREE.Color();

/** Shows a group at scale `s`, and stops drawing it altogether once it has shrunk away. */
const showAt = (group: THREE.Object3D | null, s: number) => {
  if (!group) return;
  group.visible = s > 0.01;
  group.scale.setScalar(Math.max(s, 0.001));
};

/**
 * One marker and one object per milestone. Only the moment you're at shows its
 * object: it grows in as you arrive and shrinks away quickly as you leave, so the
 * camera never flies through it and neighbours never crowd the card. Objects
 * (and markers) that aren't showing aren't drawn at all.
 */
function Milestones({ travel }: { travel: Travel }) {
  const c = useSceneColors();
  const reachedColor = useMemo(() => new THREE.Color(c.poppy), [c]);
  const aheadColor = useMemo(() => new THREE.Color(c.stone), [c]);
  const objects = useRef<(THREE.Group | null)[]>([]);
  const markers = useRef<(THREE.Group | null)[]>([]);
  const dots = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    milestones.forEach((_, i) => {
      const past = travel.x - i; // > 0 once you've moved on from this moment
      showAt(objects.current[i], past > 0 ? 1 - THREE.MathUtils.smoothstep(past, 0.1, 0.4) : 1 - THREE.MathUtils.smoothstep(-past, 0.3, 0.7));
      // The camera passes close to markers behind it, so they fade out too
      showAt(markers.current[i], 1 - THREE.MathUtils.smoothstep(past, 0.2, 0.5));
      const dot = dots.current[i];
      if (dot) {
        const reached = THREE.MathUtils.smoothstep(past, -0.5, -0.2);
        (dot.material as THREE.MeshBasicMaterial).color.copy(tmpColor.copy(aheadColor).lerp(reachedColor, reached));
      }
    });
  });

  return (
    <>
      {milestones.map((milestone, i) => {
        const point = points[i + 1];
        return (
          <group key={milestone.id}>
            {/* The marker on the path: stone until you reach it, then red */}
            <group ref={(el) => { markers.current[i] = el; }} position={point}>
              <mesh ref={(el) => { dots.current[i] = el; }}>
                <sphereGeometry args={[0.16, 20, 20]} />
                <meshBasicMaterial color={c.stone} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.4, 0.02, 8, 40]} />
                <meshBasicMaterial color={c.ink} transparent opacity={0.45} />
              </mesh>
            </group>

            <group
              ref={(el) => { objects.current[i] = el; }}
              position={[point.x + objectOffset(i), point.y + objectLift, point.z]}
              visible={false}
            >
              <MilestoneObject kind={milestone.kind} phase={i * 1.3} />
            </group>
          </group>
        );
      })}
    </>
  );
}

export default function StoryScene({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  // Starts sharp; drops to 1× resolution if the device can't keep up
  const [dpr, setDpr] = useState(isMobile ? 1.5 : Math.min(window.devicePixelRatio, 1.75));
  const travel = useMemo<Travel>(() => ({ x: 0, u: paramOf(0) }), []);
  const c = useTheme() === "dark" ? DARK_SCENE : LIGHT_SCENE;

  return (
    <Canvas
      // Stop rendering entirely while the story is off screen
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ fov: isMobile ? 60 : 50, near: 0.1, far: 120, position: [0, 0.4, SPACING + 7.5] }}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      {/* Provided inside the canvas, so every object can read the theme's colours */}
      <SceneColors.Provider value={c}>
        <color attach="background" args={[c.bg]} />
        {/* Only the next moment shows faintly ahead; the rest of the story fades into the paper */}
        <fog attach="fog" args={[c.bg, 10, 30]} />
        {/* One soft sky-and-ground light and a key light do the work of a light per object */}
        <hemisphereLight args={[c.sky, c.ground, 1.6]} />
        <directionalLight position={[4, 8, 8]} intensity={1.6} />

        <CameraRig progress={progress} travel={travel} />
        <StoryPath travel={travel} />
        <Milestones travel={travel} />
      </SceneColors.Provider>

      {/* Drifting red specks, like petals on the wind */}
      <Sparkles
        count={isMobile ? 40 : 90}
        scale={[14, 6, COUNT * SPACING]}
        position={[0, 0, -(COUNT * SPACING) / 2 + 4]}
        size={3}
        speed={reducedMotion ? 0 : 0.3}
        color={c.poppy}
        opacity={0.6}
        noise={1.5}
      />
    </Canvas>
  );
}
