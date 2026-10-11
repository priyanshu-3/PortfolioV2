import { Component, type ReactNode } from "react";

/** If WebGL is unavailable or the scene crashes, the story cards still work on their own. */
export class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Story 3D scene failed to render:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
