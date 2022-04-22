const canvas = document.getElementById("canvas");
const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
function rColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

class Block {
  constructor(
    canvas,
    col = 0,
    row = 0,
    blockSize = 10,
    color = rColor(colors)
  ) {
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.blockSize = blockSize;
    this.col = col;
    this.row = row;
    this.widthInBlocks = this.canvas.width / this.blockSize;
    this.heightInBlocks = this.canvas.height / this.blockSize;
  }
  drawSquare(color) {
    let x = this.col * this.blockSize;
    let y = this.row * this.blockSize;
    this.context.fillStyle = color;
    this.context.fillRect(x, y, blockSize, blockSize);
  }
  drawCircle(color) {
    let centerX = this.col * this.blockSize + this.blockSize / 2;
    let centerY = this.row * this.blockSize + this.blockSize / 2;
    this.context.fillStyle = color;
    this.circle(centerX, centerY, this.blockSize / 2, true);
  }
  circle(x, y, radius, fillCircle = true) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.let * 2, false);
    if (fillCircle) {
      this.context.fill();
    } else {
      this.context.stroke();
    }
  }
  equal(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
}
class Apple {
  constructor(canvas) {
    this.block = new Block(canvas, 10, 10);
    this.canvas = canvas;
    this.color = rColor(colors);
    //console.log(this.color);
  }
  draw() {
    this.block.drawCircle(this.color);
  }
  move() {
    let randomCol = Math.floor(Math.random() * (this.widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (this.heightInBlocks - 2)) + 1;
    this.block = new Block(canvas, randomCol, randomRow);
    this.color = rColor(colors);
  }
}
class Snake {
  constructor(canvas) {
    this.segments = [
      new Block(canvas, 7, 5),
      new Block(canvas, 6, 5),
      new Block(canvas, 5, 5),
    ];
    this.canvas = canvas;
    this.direction = "right";
    this.nextDirection = "right";
    this.color = rColor(colors);
    //console.log(this.color);
  }
  draw() {
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].drawSquare(this.color);
    }
  }
  move(apple, game) {
    let head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;
    if (this.direction === "right") {
      newHead = new Block(canvas, head.col + 1, head.row);
    } else if (this.direction === "down") {
      newHead = new Block(canvas, head.col, head.row + 1);
    } else if (this.direction === "left") {
      newHead = new Block(canvas, head.col - 1, head.row);
    } else if (this.direction === "up") {
      newHead = new Block(canvas, head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
      game.gameOver();
      return;
    }
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
      score++;
      this.color = apple.color;
      apple.move();
    } else {
      this.segments.pop();
    }
  }
  checkCollision(head) {
    let leftCollision = head.col === 0;
    let topCollision = head.row === 0;
    let rightCollision = head.col === widthInBlocks - 1;
    let bottomCollision = head.row === heightInBlocks - 1;
    let wallCollision =
      leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }
    return wallCollision || selfCollision;
  }
  setDirection(newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    } else if (this.direction === "left" && newDirection === "right") {
      return;
    }
    this.nextDirection = newDirection;
  }
}
class Game {
  constructor(canvas) {
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    this.score = 0;
    this.intervalId;
    this.directions = {
      37: "left",
      38: "up",
      39: "right",
      40: "down",
    };
    this.apple = new Apple(canvas);
    this.snake = new Snake(canvas);
  }
  drawBorder(blockSize = 10) {
    this.canvas.fillStyle = "Gray";
    this.canvas.fillRect(0, 0, width, 10);
    this.canvas.fillRect(0, height - blockSize, this.canvas.width, blockSize);
    this.canvas.fillRect(0, 0, blockSize, this.canvas.height);
    this.canvas.fillRect(
      this.canvas.width - blockSize,
      0,
      blockSize,
      this.canvas.height
    );
  }
  drawScore() {
    this.canvas.font = "20px Courier";
    this.canvas.fillStyle = "Black";
    this.canvas.textAlign = "left";
    this.canvas.textBaseline = "top";
    this.canvas.fillText("Счет: " + this.score, 15, 15);
  }
  gameOver(canvas) {
    clearInterval(intervalId);
    this.canvas.font = "60px Courier";
    this.canvas.fillStyle = "Black";
    this.canvas.textAlign = "center";
    this.canvas.textBaseline = "middle";
    this.canvas.fillText("Конец игры", canvas.width / 2, canvas.height / 2);
  }
  go() {
    this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScore();
    this.snake.move();
    this.snake.draw();
    this.apple.draw();
    this.drawBorder();
  }
  start() {
    this.intervalId = setInterval(this.go.bind(this), 100);
    addEventListener("keydown", (event) => {
      let newDirection = this.directions[event.keyCode];
      if (newDirection !== undefined) {
        this.snake.setDirection(newDirection);
      }
    });
  }
}
let game = new Game(canvas);
game.start();
