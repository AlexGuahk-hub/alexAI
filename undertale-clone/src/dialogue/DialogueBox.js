const TYPING_SPEED = 0.04; // seconds per character
const BOX_PADDING  = 16;
const BOX_HEIGHT   = 120;
const BOX_Y_OFFSET = 20; // from bottom

export class DialogueBox {
  constructor(canvas, audio) {
    this.canvas = canvas;
    this.audio  = audio;
    this.visible = false;

    this._lines      = [];
    this._pageIndex  = 0;
    this._charIndex  = 0;
    this._timer      = 0;
    this._onComplete = null;
    this._speaker    = '';
    this._done       = false;  // current page fully typed
    this._blinkTimer = 0;
    this._blinkOn    = true;
  }

  // lines: string[] — each string is one page of dialogue
  show(lines, onComplete, speaker = '') {
    this._lines      = lines;
    this._pageIndex  = 0;
    this._charIndex  = 0;
    this._timer      = 0;
    this._onComplete = onComplete;
    this._speaker    = speaker;
    this._done       = false;
    this.visible     = true;
  }

  hide() {
    this.visible = false;
  }

  advance() {
    if (!this.visible) return;

    if (!this._done) {
      // Skip typing animation
      this._charIndex = this._lines[this._pageIndex].length;
      this._done = true;
      return;
    }

    // Next page or finish
    this._pageIndex++;
    if (this._pageIndex >= this._lines.length) {
      this.visible = false;
      this._onComplete?.();
      return;
    }
    this._charIndex = 0;
    this._timer     = 0;
    this._done      = false;
  }

  update(dt) {
    if (!this.visible || this._done) {
      this._blinkTimer += dt;
      if (this._blinkTimer >= 0.4) {
        this._blinkTimer = 0;
        this._blinkOn = !this._blinkOn;
      }
      return;
    }

    this._timer += dt;
    while (this._timer >= TYPING_SPEED && this._charIndex < this._lines[this._pageIndex].length) {
      this._timer -= TYPING_SPEED;
      this._charIndex++;
      // Play typing sound every other character
      if (this._charIndex % 2 === 0) {
        this.audio.playSfxTyping();
      }
    }

    if (this._charIndex >= this._lines[this._pageIndex].length) {
      this._done = true;
    }
  }

  render(ctx) {
    if (!this.visible) return;

    const W = this.canvas.width;
    const H = this.canvas.height;
    const boxX = BOX_PADDING;
    const boxY = H - BOX_HEIGHT - BOX_Y_OFFSET;
    const boxW = W - BOX_PADDING * 2;

    // Box background
    ctx.fillStyle = '#000';
    ctx.fillRect(boxX, boxY, boxW, BOX_HEIGHT);

    // White border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 3;
    ctx.strokeRect(boxX, boxY, boxW, BOX_HEIGHT);

    // Speaker name
    if (this._speaker) {
      ctx.fillStyle = '#fff';
      ctx.font      = '8px "Press Start 2P", monospace';
      ctx.fillText(this._speaker, boxX + BOX_PADDING, boxY - 10);
    }

    // Dialogue text (word-wrap)
    const text    = this._lines[this._pageIndex].substring(0, this._charIndex);
    const maxW    = boxW - BOX_PADDING * 2;
    const lineH   = 22;
    ctx.font      = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#fff';

    const wrapped = this._wrapText(ctx, text, maxW);
    wrapped.forEach((line, i) => {
      ctx.fillText(line, boxX + BOX_PADDING, boxY + BOX_PADDING + 12 + i * lineH);
    });

    // Blinking ▼ indicator when page is done
    if (this._done && this._blinkOn) {
      ctx.fillStyle = '#fff';
      ctx.font      = '8px "Press Start 2P", monospace';
      ctx.fillText('▼', boxX + boxW - BOX_PADDING - 12, boxY + BOX_HEIGHT - 10);
    }
  }

  _wrapText(ctx, text, maxW) {
    const words  = text.split(' ');
    const lines  = [];
    let current  = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }
}
