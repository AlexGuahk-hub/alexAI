export class GameLoop {
  constructor(updateFn, renderFn) {
    this.update = updateFn;
    this.render = renderFn;
    this.running = false;
    this.rafId = null;

    this.FIXED_TIMESTEP = 1000 / 60; // 16.667ms
    this.MAX_ACCUMULATED = this.FIXED_TIMESTEP * 5;
    this.accumulated = 0;
    this.lastTime = 0;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this._tick.bind(this));
  }

  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  _tick(now) {
    if (!this.running) return;

    const elapsed = now - this.lastTime;
    this.lastTime = now;

    this.accumulated += Math.min(elapsed, this.MAX_ACCUMULATED);

    while (this.accumulated >= this.FIXED_TIMESTEP) {
      this.update(this.FIXED_TIMESTEP / 1000); // seconds
      this.accumulated -= this.FIXED_TIMESTEP;
    }

    this.render();
    this.rafId = requestAnimationFrame(this._tick.bind(this));
  }
}
