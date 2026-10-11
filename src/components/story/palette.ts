import { createContext, useContext } from "react";

// The hero poster's palette: ink on paper, with poppy red as the one accent.
export const POPPY = "#d9301d";
export const INK = "#3a2b27";
export const STONE = "#9a8f84"; // warm mid-grey, for secondary shapes
export const BONE = "#e2e1dc"; // the figure's robe
export const PAPER = "#eae8e2";
export const MARK = "#f5f2ec"; // the poster's white: paper stock for pages, diplomas and envelopes

/** The story scene's colours for one theme. */
export type ScenePalette = {
  /** Sky and fog */
  bg: string;
  /** Main object colour and the path */
  ink: string;
  /** Secondary shapes and markers ahead */
  stone: string;
  /** Screens */
  surface: string;
  /** App cards on screens */
  card: string;
  poppy: string;
  /** Hemisphere light: sky and ground tints */
  sky: string;
  ground: string;
};

export const LIGHT_SCENE: ScenePalette = {
  bg: PAPER,
  ink: INK,
  stone: STONE,
  surface: MARK,
  card: BONE,
  poppy: POPPY,
  sky: "#fffaf0",
  ground: STONE,
};

// At night the ink objects turn cream, screens go dark, and the paper sky becomes night
export const DARK_SCENE: ScenePalette = {
  bg: "#14110f",
  ink: "#e6dfd3",
  stone: "#857a70",
  surface: "#211c19",
  card: "#3a322d",
  poppy: "#e5503a",
  sky: "#f3e7d6",
  ground: "#2a231f",
};

export const SceneColors = createContext<ScenePalette>(LIGHT_SCENE);
export const useSceneColors = () => useContext(SceneColors);
