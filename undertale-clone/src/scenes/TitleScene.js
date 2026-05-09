import { OverworldScene } from './OverworldScene.js';

const MENU_ITEMS = ['CONTINUE', 'NEW GAME'];

export class TitleScene {
  constructor(scenes, input, audio) {
    this.scenes = scenes;
    this.input  = input;
    this.audio  = audio;

    this._cursor       = 0;
    this._blinkTimer   = 0;
    this._blinkOn      = true;
    this._phase        = 'title'; // 'title' | 'name_input'
    this._nameChars    = [];
    this._nameInput    = '';
    this._flashAlpha   = 0;

    // Keyboard listener for name input
    this._onKeyDown = this._handleNameKey.bind(this);
  }

  onEnter() {
    // Check for save data
    const save = localStorage.getItem('undertale_save');
    if (!save) this._cursor = 1; // default to NEW GAME if no save
  }

  onExit() {
    window.removeEventListener('keydown', this._onKeyDown);
  }

  _handleNameKey(e) {
    if (this._phase !== 'name_input') return;
    if (e.key === 'Backspace') {
      this._nameInput = this._nameInput.slice(0, -1);
    } else if (e.key === 'Enter') {
      this._confirmName();
    } else if (e.key.length === 1 && this._nameInput.length < 8) {
      this._nameInput += e.key.toUpperCase();
    }
  }

  _confirmName() {
    const name = this._nameInput.trim() || 'FRISK';
    window.removeEventListener('keydown', this._onKeyDown);
    this.scenes.replace(new OverworldScene(this.scenes, this.input, this.audio, name));
  }

  update(dt) {
    this._blinkTimer += dt;
    if (this._blinkTimer >= 0.5) {
      this._blinkTimer = 0;
      this._blinkOn = !this._blinkOn;
    }

    if (this._phase === 'title') {
      this._updateTitle();
    }
    // Name input is handled by raw keydown listener
  }

  _updateTitle() {
    if (this.input.isPressed('up')) {
      this._cursor = (this._cursor - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
      this.audio.playSfxSelect();
    }
    if (this.input.isPressed('down')) {
      this._cursor = (this._cursor + 1) % MENU_ITEMS.length;
      this.audio.playSfxSelect();
    }
    if (this.input.isPressed('confirm')) {
      this.audio.playSfxConfirm();
      if (this._cursor === 0) {
        // CONTINUE — load save
        const save = localStorage.getItem('undertale_save');
        if (save) {
          const data = JSON.parse(save);
          this.scenes.replace(new OverworldScene(this.scenes, this.input, this.audio, data.name, data));
        }
      } else {
        // NEW GAME — show name input
        this._phase = 'name_input';
        this._nameInput = '';
        window.addEventListener('keydown', this._onKeyDown);
      }
    }
  }

  render(ctx) {
    const W = 640, H = 480;

    // Subtle background flower decorations
    ctx.fillStyle = '#111';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(30 + i * 120, H - 60, 8, 8);
    }

    // Title text
    ctx.fillStyle = '#fff';
    ctx.font = '28px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('UNDERTALE', W / 2, 160);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('- Fan Recreation -', W / 2, 190);

    if (this._phase === 'title') {
      this._renderMenu(ctx, W, H);
    } else {
      this._renderNameInput(ctx, W, H);
    }

    ctx.textAlign = 'left';
  }

  _renderMenu(ctx, W, H) {
    ctx.textAlign = 'center';
    MENU_ITEMS.forEach((item, i) => {
      const y = 280 + i * 40;
      const active = i === this._cursor;
      ctx.fillStyle = active ? '#fff' : '#666';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(item, W / 2, y);

      if (active && this._blinkOn) {
        ctx.fillStyle = '#fff';
        ctx.fillText('*', W / 2 - 100, y);
      }
    });

    ctx.fillStyle = '#444';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('Z / ENTER to select', W / 2, H - 40);
  }

  _renderNameInput(ctx, W, H) {
    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('이름을 입력하세요', W / 2, 260);

    // Name box
    const boxW = 200, boxH = 40;
    const boxX = W / 2 - boxW / 2;
    const boxY = 290;
    ctx.fillStyle = '#000';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P", monospace';
    const displayName = this._nameInput + (this._blinkOn ? '_' : ' ');
    ctx.fillText(displayName, W / 2, boxY + 26);

    ctx.fillStyle = '#666';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('ENTER로 확인', W / 2, boxY + 70);
    ctx.fillText('(최대 8자)', W / 2, boxY + 86);
  }
}
