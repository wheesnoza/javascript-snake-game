import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const collided = () => {
  return x <= -1 || y <= -1 || x >= canvas.width || y >= canvas.width;
};

const foodCollided = () => {
  return x === foodX && y === foodY;
};

const random = () => {
  const numbers = [];
  for (let i = 10; i <= 500; i += 10) {
    numbers.push(i);
  }

  return numbers[Math.floor(Math.random() * numbers.length)];
};

let x = 0;
let y = 0;
let speed = 10;
let direction = "ArrowRight";
let foodX = random();
let foodY = random();

const reinit = () => {
  x = 0;
  y = 0;
  direction = "ArrowRight";
  update();
};

addEventListener("keydown", (event) => {
  direction = event.code;
});

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#7FFF00";
  context.fillRect(x, y, 10, 10);

  if (foodCollided()) {
    foodX = random();
    foodY = random();
  }

  context.fillStyle = "snow";
  context.fillRect(foodX, foodY, 10, 10);
};

let counter = 0;
let lastTime = 0;

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  counter += deltaTime;

  if (counter > 100) {
    counter = 0;
    if (direction === "ArrowLeft") {
      x -= speed;
    } else if (direction === "ArrowRight") {
      x += speed;
    } else if (direction === "ArrowUp") {
      y -= speed;
    } else if (direction === "ArrowDown") {
      y += speed;
    }
  }

  draw();

  if (collided()) {
    window.alert("Game Over.");
    reinit();
    return;
  }

  requestAnimationFrame(update);
};

update();
