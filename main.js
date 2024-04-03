import "./style.css";
const pointsH1 = document.getElementById("points");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
addEventListener("keydown", (e) => direction.update(e));
let counter = 0;
let lastTime = 0;
let points = 0;

const random = () => {
  const numbers = [];
  for (let i = 10; i <= 400; i += 10) {
    numbers.push(i);
  }

  return numbers[Math.floor(Math.random() * numbers.length)];
};

const food = {
  x: random(),
  y: random(),
};

const snake = {
  body: [{ x: 0, y: 0 }],

  tail() {
    return this.body[this.body.length - 1];
  },

  head() {
    return this.body[0];
  },

  push() {
    if (direction.current === direction.right) {
      return this.body.push({ x: this.tail().x - 10, y: this.tail().y });
    }
    if (direction.current === direction.left) {
      return this.body.push({ x: this.tail().x + 10, y: this.tail().y });
    }
    if (direction.current === direction.up) {
      return this.body.push({ x: this.tail().x, y: this.tail().y + 10 });
    }
    if (direction.current === direction.down) {
      return this.body.push({ x: this.tail().x, y: this.tail().y - 10 });
    }
  },

  reset() {
    this.body = [{ x: 0, y: 0 }];
    console.log(this.body);
  },
};

const drawSnake = () => {
  [...snake.body].reverse().forEach((body, index, arr) => {
    const next = arr[index + 1];
    if (next === undefined) return;
    body.x = next.x;
    body.y = next.y;
  });
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.body.forEach((body, index) => {
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

const selfCollied = () => {
  return snake.body.slice(1).some((b) => {
    return b.x === snake.head().x && b.y === snake.head().y;
  });
};

let direction = {
  current: "ArrowRight",
  previous: "",
  right: "ArrowRight",
  left: "ArrowLeft",
  up: "ArrowUp",
  down: "ArrowDown",
  update(e) {
    if (direction.current === e.code) return;
    if (e.code === this.left && this.current === this.right) return;
    if (e.code === this.right && this.current === this.left) return;
    if (e.code === this.down && this.current === this.up) return;
    if (e.code === this.up && this.current === this.down) return;
    this.previous = this.current;
    this.current = e.code;
  },
  reset() {
    this.current = this.right;
    this.previous = "";
  },
};

const move = {
  speed: 10,
  left() {
    snake.head().x -= this.speed;
  },
  right() {
    snake.head().x += this.speed;
  },
  up() {
    snake.head().y -= this.speed;
  },
  down() {
    snake.head().y += this.speed;
  },
};

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  counter += deltaTime;

  if (counter > 90) {
    if (boundaryCollided() || selfCollied()) {
      window.alert("Game Over.");
      snake.reset();
      direction.reset();
      points = 0;
      pointsH1.textContent = points;
    }
    if (foodCollided()) {
      snake.push();
      food.x = random();
      food.y = random();
      points++;
      pointsH1.textContent = points;
    }
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

  requestAnimationFrame(update);
};

update();
