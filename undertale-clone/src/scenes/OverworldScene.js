// Placeholder — fully implemented in Phase 3
export class OverworldScene {
  constructor(scenes, input, audio, playerName, saveData = null) {
    this.scenes     = scenes;
    this.input      = input;
    this.audio      = audio;
    this.playerName = playerName;
    this.saveData   = saveData;
  }

  onEnter() {}
  onExit()  {}

  update(_dt) {}

  render(ctx) {
    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`안녕하세요, ${this.playerName}!`, 320, 220);
    ctx.fillStyle = '#666';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('(Phase 3에서 오버월드 구현 예정)', 320, 260);
    ctx.textAlign = 'left';
  }
}
