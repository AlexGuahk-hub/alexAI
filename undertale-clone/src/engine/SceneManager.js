export class SceneManager {
  constructor() {
    this.stack = [];
  }

  get current() {
    return this.stack[this.stack.length - 1] ?? null;
  }

  push(scene) {
    this.current?.onPause?.();
    this.stack.push(scene);
    scene.onEnter?.();
  }

  pop() {
    const scene = this.stack.pop();
    scene?.onExit?.();
    this.current?.onResume?.();
    return scene;
  }

  replace(scene) {
    const old = this.stack.pop();
    old?.onExit?.();
    this.stack.push(scene);
    scene.onEnter?.();
  }

  clear() {
    while (this.stack.length > 0) {
      this.stack.pop()?.onExit?.();
    }
  }

  update(dt) {
    this.current?.update?.(dt);
  }

  render(ctx) {
    // Render all scenes (bottom to top) for layering support
    for (const scene of this.stack) {
      scene.render?.(ctx);
    }
  }
}
