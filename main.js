import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
addEventListener("keydown", (e) => direction.update(e));
let counter = 0;
let lastTime = 0;

const random = () => {
  const numbers = [];
  for (let i = 10; i <= 500; i += 10) {
    numbers.push(i);
  }

  return numbers[Math.floor(Math.random() * numbers.length)];
};

const food = {
  x: random(),
  y: random(),
};

const snake = {
  body: [
    { x: 20, y: 0 }, // head
    { x: 10, y: 0 }, // middle body
    { x: 0, y: 0 }, // tail
  ],

  tail() {
    return this.body[this.body.length - 1];
  },

  head() {
    return this.body[0];
  },

  push() {
    this.body.shift({ x: this.tail().x - 10, y: this.tail().y });
  },

  reset() {
    this.body = [];
  },
};

const drawSnake = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.body.forEach((body) => {
    context.fillStyle = "#7FFF00";
    context.fillRect(body.x, body.y, 10, 10);
  });
};

const drawFood = () => {
  context.fillStyle = "snow";
  context.fillRect(food.x, food.y, 10, 10);
};

const draw = () => {
  drawSnake();
  drawFood();
  if (foodCollided()) {
    snake.push();
    food.x = random();
    food.y = random();
  }
};

const boundaryCollided = () => {
  return (
    snake.head().x <= -1 ||
    snake.head().y <= -1 ||
    snake.head().x >= canvas.width ||
    snake.head().y >= canvas.width
  );
};

const foodCollided = () => {
  return snake.head().x === food.x && snake.head().y === food.y;
};

let direction = {
  current: "ArrowRight",
  right: "ArrowRight",
  left: "ArrowLeft",
  up: "ArrowUp",
  down: "ArrowDown",
  update(e) {
    if (e.code === this.left && this.current === this.right) return;
    if (e.code === this.right && this.current === this.left) return;
    if (e.code === this.down && this.current === this.up) return;
    if (e.code === this.up && this.current === this.down) return;
    this.current = e.code;
  },
};

const move = {
  speed: 10,
  left() {
    snake.body.forEach((body) => {
      body.x -= this.speed;
    });
  },
  right() {
    snake.body.forEach((b) => {
      if (b.y === snake.head().y) {
        b.x += this.speed;
      } else {
        b.y += 10;
      }
    });
  },
  up() {
    snake.body.forEach((b) => {
      // body.y -= this.speed;
      if (b.x === snake.head().x) {
        b.y -= this.speed;
      } else {
        b.x += 10;
      }
    });
  },
  down() {
    snake.body.forEach((b) => {
      if (b.x === snake.head().x) {
        b.y += this.speed;
      } else {
        b.x += 10;
      }
    });
  },
};

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  counter += deltaTime;

  if (counter > 100) {
    draw();
    if (direction.current === direction.left) {
      move.left();
    } else if (direction.current === direction.right) {
      move.right();
    } else if (direction.current === direction.up) {
      move.up();
    } else if (direction.current === direction.down) {
      move.down();
    }
    counter = 0;
  }

  if (boundaryCollided()) {
    window.alert("Game Over.");
    reinit();
  }

  requestAnimationFrame(update);
};

update();
