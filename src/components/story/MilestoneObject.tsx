import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { MilestoneKind } from "@/data/story";
import { BONE, INK, MARK, useSceneColors } from "./palette";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motion = reducedMotion ? 0 : 1;

/** Glowing material: lets the poppy-red details read as lit from within. */
function Glow({
  color,
  intensity = 0.6,
  transparent = false,
  toneMapped = true,
}: {
  color: string;
  intensity?: number;
  transparent?: boolean;
  toneMapped?: boolean;
}) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      roughness={0.35}
      metalness={0.2}
      transparent={transparent}
      toneMapped={toneMapped}
    />
  );
}

/** The heart shape for the infant-care app's screen. */
function useHeartGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.9);
    shape.bezierCurveTo(-1.2, -0.1, -1.0, 0.9, 0, 0.45);
    shape.bezierCurveTo(1.0, 0.9, 1.2, -0.1, 0, -0.9);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3 });
    geo.center();
    return geo;
  }, []);
}

/** School: a stack of books with a pencil resting on top. */
function Books() {
  const c = useSceneColors();
  const books: [number, number, string, number][] = [
    [-0.42, 0.06, c.ink, 1.6],
    [-0.12, -0.1, c.stone, 1.5],
    [0.17, 0.12, c.poppy, 1.4],
  ];
  return (
    <group>
      {books.map(([y, rot, c, w], i) => (
        <group key={i} position={[0, y, 0]} rotation={[0, rot, 0]}>
          <mesh>
            <boxGeometry args={[w, 0.28, 1.05]} />
            <meshStandardMaterial color={c} roughness={0.6} />
          </mesh>
          {/* Page edges */}
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[w - 0.04, 0.22, 1.08]} />
            <meshStandardMaterial color={MARK} />
          </mesh>
        </group>
      ))}
      <group position={[0.05, 0.4, 0.12]} rotation={[0, 0.5, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 1.1, 6]} />
          <meshStandardMaterial color="#d9a441" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <coneGeometry args={[0.07, 0.22, 6]} />
          <meshStandardMaterial color="#e9d3b0" />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <coneGeometry args={[0.025, 0.06, 6]} />
          <meshStandardMaterial color={c.ink} />
        </mesh>
        <mesh position={[0, -0.59, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.08, 12]} />
          <meshStandardMaterial color={c.stone} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
          <meshStandardMaterial color={c.poppy} />
        </mesh>
      </group>
    </group>
  );
}

/** Computer Science at VTU: an open laptop with code on its screen. */
function Laptop() {
  const c = useSceneColors();
  const code: [number, number, string][] = [
    [0, 0.7, c.poppy],
    [0.15, 1.0, c.ink],
    [0.3, 0.6, c.ink],
    [0.3, 0.85, c.stone],
    [0.15, 0.5, c.poppy],
    [0, 1.2, c.ink],
    [0.15, 0.75, c.stone],
  ];
  return (
    <group position={[0, -0.45, 0]} rotation={[0.2, 0, 0]}>
      <RoundedBox args={[2.2, 0.08, 1.45]} radius={0.035} smoothness={3}>
        <meshStandardMaterial color={c.ink} metalness={0.4} roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0.045, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.75]} />
        <meshStandardMaterial color={c.stone} />
      </mesh>
      {/* The lid, hinged at the back and tilted open */}
      <group position={[0, 0.04, -0.72]} rotation={[-0.22, 0, 0]}>
        <RoundedBox args={[2.2, 1.45, 0.06]} radius={0.03} smoothness={3} position={[0, 0.72, 0]}>
          <meshStandardMaterial color={c.ink} metalness={0.4} roughness={0.45} />
        </RoundedBox>
        <mesh position={[0, 0.74, 0.035]}>
          <planeGeometry args={[2.0, 1.25]} />
          <meshBasicMaterial color={c.surface} />
        </mesh>
        {code.map(([indent, w, c], i) => (
          <mesh key={i} position={[-0.82 + indent + w / 2, 1.22 - i * 0.15, 0.04]}>
            <planeGeometry args={[w, 0.06]} />
            <meshBasicMaterial color={c} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** First wins: a trophy with handles on a plinth. */
function Trophy() {
  const c = useSceneColors();
  const cup = useMemo(() => {
    const profile = [
      [0, -0.75], [0.45, -0.75], [0.45, -0.66], [0.13, -0.56], [0.1, -0.15],
      [0.18, -0.05], [0.62, 0.35], [0.7, 0.9], [0.63, 0.9], [0.55, 0.4], [0, 0.15],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(profile, 40);
  }, []);
  return (
    <group position={[0, 0.1, 0]}>
      <mesh geometry={cup}>
        <meshStandardMaterial color="#b8893b" metalness={0.75} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.66, 0.5, 0]} rotation={[0, 0, (-side * Math.PI) / 2]}>
          <torusGeometry args={[0.24, 0.045, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#b8893b" metalness={0.75} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, -0.9, 0]}>
        <boxGeometry args={[0.9, 0.3, 0.9]} />
        <meshStandardMaterial color={c.ink} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.9, 0.455]}>
        <planeGeometry args={[0.5, 0.14]} />
        <Glow color={c.poppy} intensity={0.3} />
      </mesh>
      <Sparkles count={14} scale={2.4} size={4} speed={0.4 * motion} color={c.poppy} />
    </group>
  );
}

/** Skin cancer detection: a magnifying glass sweeping a skin sample, the lesion boxed in red. */
function Scan() {
  const c = useSceneColors();
  const lens = useRef<THREE.Group>(null);
  const box = useRef<THREE.Group>(null);
  const moles = useMemo(
    () => [
      [-0.55, 0.3, 0.05],
      [0.5, 0.45, 0.04],
      [-0.2, -0.55, 0.05],
      [0.65, -0.3, 0.035],
      [-0.7, -0.2, 0.03],
    ],
    []
  );
  const square = useMemo(
    () => [[-0.22, 0, -0.22], [0.22, 0, -0.22], [0.22, 0, 0.22], [-0.22, 0, 0.22], [-0.22, 0, -0.22]] as [number, number, number][],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * motion;
    lens.current?.position.set(0.25 + Math.sin(t * 0.7) * 0.35, 0.55 + Math.sin(t * 1.4) * 0.04, -0.1 + Math.cos(t * 0.7) * 0.25);
    box.current?.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
  });

  return (
    <group rotation={[0.95, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[1.1, 1.1, 0.12, 48]} />
        <meshStandardMaterial color="#e6c6ae" roughness={0.8} />
      </mesh>
      {moles.map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.065, z]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[r, 12, 12]} />
          <meshStandardMaterial color="#7a5440" />
        </mesh>
      ))}
      {/* The lesion the model flags */}
      <mesh position={[0.25, 0.07, -0.1]} scale={[1.2, 0.35, 1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3a2018" />
      </mesh>
      <group ref={box} position={[0.25, 0.08, -0.1]}>
        <Line points={square} color={c.poppy} lineWidth={2.5} />
      </group>

      <group ref={lens}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.05, 12, 48]} />
          <meshStandardMaterial color={c.ink} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 40]} />
          <meshStandardMaterial color="#d8e6e4" transparent opacity={0.35} roughness={0.1} />
        </mesh>
        <mesh position={[0.72, 0.12, 0.32]} rotation={[0.35, 0.42, Math.PI / 2 - 0.2]}>
          <cylinderGeometry args={[0.06, 0.07, 0.7, 12]} />
          <meshStandardMaterial color={c.ink} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/** Internship at MindMatrix: a briefcase. */
function Briefcase() {
  const c = useSceneColors();
  return (
    <group>
      <RoundedBox args={[1.9, 1.3, 0.55]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={c.ink} roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0.25, 0.28]}>
        <boxGeometry args={[1.84, 0.025, 0.02]} />
        <meshStandardMaterial color={c.stone} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0, 0.28]}>
          <boxGeometry args={[0.12, 1.28, 0.02]} />
          <meshStandardMaterial color={c.stone} />
        </mesh>
      ))}
      <RoundedBox args={[0.32, 0.2, 0.06]} radius={0.03} smoothness={2} position={[0, 0.25, 0.3]}>
        <Glow color={c.poppy} intensity={0.25} />
      </RoundedBox>
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.3, 0.06, 12, 32, Math.PI]} />
        <meshStandardMaterial color={c.ink} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Shishu-Sneh: a phone with a beating heart and a heartbeat line on its screen. */
function HealthApp() {
  const c = useSceneColors();
  const heart = useHeartGeometry();
  const beat = useRef<THREE.Mesh>(null);
  const pulse = useMemo(
    () => [[-0.4, -0.42, 0], [-0.16, -0.42, 0], [-0.1, -0.3, 0], [-0.02, -0.6, 0], [0.06, -0.24, 0], [0.12, -0.42, 0], [0.4, -0.42, 0]] as [number, number, number][],
    []
  );

  useFrame((state) => {
    // Heartbeat: two quick pulses, then rest
    const t = (state.clock.elapsedTime * 1.1) % 1;
    const b = Math.max(Math.sin(t * Math.PI * 4) * (t < 0.5 ? 1 : 0), 0);
    beat.current?.scale.setScalar(0.24 * (1 + b * 0.12 * motion));
  });

  return (
    <group>
      <RoundedBox args={[1.1, 2, 0.12]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color={c.ink} metalness={0.3} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[0.95, 1.75]} />
        <meshBasicMaterial color={c.surface} />
      </mesh>
      <mesh ref={beat} geometry={heart} position={[0, 0.25, 0.1]} scale={0.24}>
        <Glow color={c.poppy} intensity={0.35} />
      </mesh>
      <group position={[0, 0, 0.08]}>
        <Line points={pulse} color={c.poppy} lineWidth={2} />
      </group>
      {[-0.65, 0.68].map((y) => (
        <mesh key={y} position={[0, y, 0.07]}>
          <planeGeometry args={[0.75, y > 0 ? 0.08 : 0.22]} />
          <meshBasicMaterial color={c.card} />
        </mesh>
      ))}
    </group>
  );
}

/** Graduated: the cap, and a rolled diploma tied with red ribbon. */
function Graduation() {
  const c = useSceneColors();
  return (
    <group>
      <group rotation={[0.25, 0, 0]} position={[0, 0.25, 0]}>
        <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1.8, 0.08, 1.8]} />
          <meshStandardMaterial color={c.ink} metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.6, 0.65, 0.55, 32]} />
          <meshStandardMaterial color={c.ink} metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Tassel */}
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <Glow color={c.poppy} intensity={0.6} />
        </mesh>
        <Line points={[[0, 0.32, 0], [0.9, 0.3, 0.2], [0.95, -0.35, 0.2]]} color={c.poppy} lineWidth={3} />
        <mesh position={[0.95, -0.42, 0.2]}>
          <coneGeometry args={[0.1, 0.25, 12]} />
          <Glow color={c.poppy} intensity={0.6} />
        </mesh>
      </group>
      <group position={[-0.1, -0.75, 0.55]} rotation={[0, -0.35, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 1.4, 24]} />
          <meshStandardMaterial color={MARK} roughness={0.7} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
          <meshStandardMaterial color={c.poppy} />
        </mesh>
      </group>
    </group>
  );
}

/** One small robot head for the agent pipeline. */
function RobotHead() {
  const c = useSceneColors();
  return (
    <group>
      <RoundedBox args={[0.62, 0.5, 0.5]} radius={0.1} smoothness={3}>
        <meshStandardMaterial color={c.ink} roughness={0.45} />
      </RoundedBox>
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.03, 0.26]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={c.poppy} />
        </mesh>
      ))}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color={c.stone} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={c.poppy} />
      </mesh>
    </group>
  );
}

/** Multi-agent pipeline: planner, builder and reviewer passing work around a loop. */
function Agents() {
  const c = useSceneColors();
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const nodes = useMemo(
    () => [0, 1, 2].map((i) => new THREE.Vector3(Math.cos((i / 3) * Math.PI * 2 + Math.PI / 2) * 1.1, Math.sin((i / 3) * Math.PI * 2 + Math.PI / 2) * 1.1, 0)),
    []
  );

  // Little packets of work travel Planner → Builder → Reviewer → Planner
  useFrame((state) => {
    packets.current.forEach((packet, i) => {
      if (!packet) return;
      const t = (state.clock.elapsedTime * 0.6 * motion + i / 3) % 1;
      packet.position.lerpVectors(nodes[i], nodes[(i + 1) % 3], t);
    });
  });

  return (
    <group>
      <Line points={[...nodes, nodes[0]]} color={c.stone} lineWidth={1.5} />
      {nodes.map((node, i) => (
        <group key={i} position={node}>
          <RobotHead />
        </group>
      ))}
      {nodes.map((_, i) => (
        <mesh key={`p${i}`} ref={(el) => { packets.current[i] = el; }}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={c.poppy} />
        </mesh>
      ))}
    </group>
  );
}

/** Tecnotree, telecom billing: a tower with dishes, signal rippling from the top. */
function Tower() {
  const c = useSceneColors();
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const t = (state.clock.elapsedTime * 0.5 * motion + i / 3) % 1;
      ring.scale.setScalar(0.3 + t * 1.6);
      (ring.material as THREE.MeshBasicMaterial).opacity = 1 - t;
    });
  });

  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.7, 0.12, 0.7]} />
        <meshStandardMaterial color={c.stone} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.22, 1.9, 8]} />
        <meshStandardMaterial color={c.ink} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Two dishes, facing opposite ways */}
      {[0, 1].map((i) => (
        <mesh key={i} position={[i ? -0.17 : 0.2, 0.2 + i * 0.45, 0]} rotation={[0, 0, ((i ? 1 : -1) * Math.PI) / 2]}>
          <cylinderGeometry args={[0.2, 0.03, 0.08, 20]} />
          <meshStandardMaterial color={MARK} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, 1.38, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={c.poppy} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { rings.current[i] = el; }} position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.02, 8, 48]} />
          <meshBasicMaterial color={c.poppy} transparent />
        </mesh>
      ))}
    </group>
  );
}

/** What's next: a sealed envelope, waiting to be sent. */
function Envelope() {
  const c = useSceneColors();
  const flap = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, 0);
    s.lineTo(1, 0);
    s.lineTo(0, -0.72);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);
  const outline: [number, number, number][] = [[-1, 0.65, 0.04], [1, 0.65, 0.04], [1, -0.65, 0.04], [-1, -0.65, 0.04], [-1, 0.65, 0.04]];

  return (
    <group rotation={[-0.08, 0, 0]}>
      <RoundedBox args={[2, 1.3, 0.06]} radius={0.025} smoothness={2}>
        <meshStandardMaterial color={MARK} roughness={0.8} />
      </RoundedBox>
      <Line points={outline} color={INK} lineWidth={1.2} />
      <Line points={[[-1, -0.65, 0.04], [0, 0.02, 0.04], [1, -0.65, 0.04]]} color={c.stone} lineWidth={1} />
      <mesh geometry={flap} position={[0, 0.65, 0.045]}>
        <meshStandardMaterial color={BONE} roughness={0.8} />
      </mesh>
      <Line points={[[-1, 0.65, 0.05], [0, -0.07, 0.05], [1, 0.65, 0.05]]} color={INK} lineWidth={1.2} />
      {/* Wax seal */}
      <mesh position={[0, -0.07, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.21, 0.06, 28]} />
        <Glow color={c.poppy} intensity={0.25} />
      </mesh>
      <mesh position={[0, -0.07, 0.115]}>
        <torusGeometry args={[0.12, 0.015, 8, 28]} />
        <meshStandardMaterial color="#a32214" />
      </mesh>
      <Sparkles count={18} scale={[2.6, 1.8, 0.6]} size={4} speed={0.4 * motion} color={c.poppy} />
    </group>
  );
}

const OBJECTS: Record<MilestoneKind, () => React.JSX.Element> = {
  books: Books,
  laptop: Laptop,
  trophy: Trophy,
  scan: Scan,
  briefcase: Briefcase,
  phone: HealthApp,
  cap: Graduation,
  agents: Agents,
  tower: Tower,
  envelope: Envelope,
};

/** The 3D object that marks one moment of the story; it floats and sways gently to face you. */
export function MilestoneObject({ kind, phase = 0 }: { kind: MilestoneKind; phase?: number }) {
  const sway = useRef<THREE.Group>(null);
  const Shape = OBJECTS[kind];

  useFrame((state) => {
    if (sway.current) sway.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45 + phase) * 0.45 * motion;
  });

  return (
    <Float speed={1.4 * motion} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={sway}>
        <Shape />
      </group>
    </Float>
  );
}
