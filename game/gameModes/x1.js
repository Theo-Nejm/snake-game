import Apple from "../domain/Apple.js";
import { Player } from "../domain/Player.js";
import { createRect } from "../shared/canvasActions.js";
import { checkSelfHit, checkWallHit, eatApple, show } from "../shared/gameActions.js";

let player1Lost = false;
let player2Lost = false;

const canvas = document.getElementById('game');
const canvasContext = canvas.getContext('2d');
let gameInterval;

const player1 = new Player({ x: 60, y: 80, size: 20, name: 'Player 1' });
const player2 = new Player({ x: 320, y: 80, size: 20, name: 'Player 2' });

let apple = new Apple(canvas, player1, player2);

export function x1Loop() {
  gameInterval = setInterval(() => show(update, draw), 1000 / 10);
}

function update() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  player1.move();
  player2.move();
  player1Lost = !!checkSelfHit(player1, gameInterval);
  player2Lost = !!checkSelfHit(player2, gameInterval);
  apple = eatApple(player1, apple, canvas);
  apple = eatApple(player2, apple, canvas);
  checkWallHit(player1, canvas);
  checkWallHit(player2, canvas);
}

function draw() {
  if(player1Lost || player2Lost) {
    createRect(0, 0, canvas.width, canvas.height, "#FFCCCC", canvasContext)
  } else {
    createRect(0, 0, canvas.width, canvas.height, "#FAFAFA", canvasContext);
  }

  for(let i = 0; i < player1.tail.length; i++) {
    createRect(player1.tail[i].x, player1.tail[i].y, 20 - 1, 20 - 1, "lightgreen", canvasContext);
  }

  for(let i = 0; i < player2.tail.length; i++) {
    createRect(player2.tail[i].x, player2.tail[i].y, 20 - 1, 20 - 1, "lightblue", canvasContext);
  }
  
  canvasContext.font = "20px Arial";

  if(!(player1Lost || player2Lost)) {
    canvasContext.fillStyle = "rgba(70, 255, 70, .75)";
  }

  if(player1Lost) {
    canvasContext.fillStyle = "rgba(255, 25, 25)"
  } else if (player2Lost) {
    canvasContext.fillStyle = "rgba(25, 255, 25)"
  }

  canvasContext.fillText(`${player1.name} score: ` +  (player1.tail.length - 1), (18), 24);

  if(player1Lost) {
    canvasContext.fillStyle = "rgba(25, 255, 25)"
  } else if (player2Lost) {
    canvasContext.fillStyle = "rgba(255, 25, 25)"
  }

  canvasContext.fillText(`${player2.name} score: ` +  (player2.tail.length - 1), (canvas.width - 172), 24);

  createRect(apple.x, apple.y, apple.size, apple.size, 'red', canvasContext);
}

window.addEventListener('keydown', (ev) => {
  ev.preventDefault();

  setTimeout(() => {
    if(ev.key == 'ArrowLeft' && player1.rotateX !== 1) {
      player1.rotateX = -1;
      player1.rotateY = 0;
    } else if(ev.key == 'ArrowUp' && player1.rotateY !== 1) {
      player1.rotateX = 0;
      player1.rotateY = -1;
    } else if(ev.key == 'ArrowRight' && player1.rotateX !== -1) {
      player1.rotateX = 1;
      player1.rotateY = 0;
    } else if(ev.key == 'ArrowDown' && player1.rotateY !== -1) {
      player1.rotateX = 0;
      player1.rotateY = 1;
    }

    if(ev.key == 'a' && player2.rotateX !== 1) {
      player2.rotateX = -1;
      player2.rotateY = 0;
    } else if(ev.key == 'w' && player2.rotateY !== 1) {
      player2.rotateX = 0;
      player2.rotateY = -1;
    } else if(ev.key == 'd' && player2.rotateX !== -1) {
      player2.rotateX = 1;
      player2.rotateY = 0;
    } else if(ev.key == 's' && player2.rotateY !== -1) {
      player2.rotateX = 0;
      player2.rotateY = 1;
    }
  }, 1)
});
