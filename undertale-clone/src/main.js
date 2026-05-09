import { GameLoop }    from './engine/GameLoop.js';
import { SceneManager } from './engine/SceneManager.js';
import { InputManager } from './engine/InputManager.js';
import { AudioManager } from './engine/AudioManager.js';
import { TitleScene }   from './scenes/TitleScene.js';

const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');

export const input = new InputManager();
export const audio = new AudioManager();
export const scenes = new SceneManager();

// Pixel-font fallback for canvas
ctx.imageSmoothingEnabled = false;

function update(dt) {
  scenes.update(dt);
  input.flush();
}

function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  scenes.render(ctx);
}

// Resume AudioContext on first keypress (browser policy)
window.addEventListener('keydown', () => audio.resume(), { once: true });

// Boot
scenes.push(new TitleScene(scenes, input, audio));

const loop = new GameLoop(update, render);
loop.start();
