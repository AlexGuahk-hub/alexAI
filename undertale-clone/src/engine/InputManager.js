const KEY_MAP = {
  ArrowUp:    'up',
  ArrowDown:  'down',
  ArrowLeft:  'left',
  ArrowRight: 'right',
  KeyZ:       'confirm',
  KeyX:       'cancel',
  Enter:      'confirm',
  Escape:     'cancel',
  ShiftLeft:  'shift',
  ShiftRight: 'shift',
};

export class InputManager {
  constructor() {
    this._held = new Set();
    this._pressed = new Set();  // true for one frame only
    this._released = new Set();

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp   = this._onKeyUp.bind(this);
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup',   this._onKeyUp);
  }

  _onKeyDown(e) {
    const action = KEY_MAP[e.code];
    if (!action) return;
    e.preventDefault();
    if (!this._held.has(action)) {
      this._pressed.add(action);
    }
    this._held.add(action);
  }

  _onKeyUp(e) {
    const action = KEY_MAP[e.code];
    if (!action) return;
    this._held.delete(action);
    this._released.add(action);
  }

  isHeld(action)     { return this._held.has(action); }
  isPressed(action)  { return this._pressed.has(action); }
  isReleased(action) { return this._released.has(action); }

  // Call once per frame at the END of update
  flush() {
    this._pressed.clear();
    this._released.clear();
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup',   this._onKeyUp);
  }
}
