import { Component, HostListener, OnInit } from '@angular/core';

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}
interface Point {
  x: number;
  y: number;
}

interface SnakePoint extends Point {
  direction?: Direction;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gridSize = 20;
  gridSizePixels = 20;
  canvasSize = 400;
  snake: SnakePoint[] = [];
  direction!: Direction | string;
  food!: Point;
  interval: any;
  score: number = 0;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.snake = [
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) },
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) },
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) + 1 }
    ];
    this.direction = Direction.Right;
    this.food = this.generateFood();
    this.score = 0;

    this.interval = setInterval(() => {
      this.move();
    }, 200);
  }

  move() {
    const head = { ...this.snake[0] };
    switch (this.direction) {
      case Direction.Up:
        head.y -= 1;
        break;
      case Direction.Down:
        head.y += 1;
        break;
      case Direction.Left:
        head.x -= 1;
        break;
      case Direction.Right:
        head.x += 1;
        break;
    }

    this.snake.unshift(head);

    if (this.isCollisionWithFood()) {
      this.score++;
      this.food = this.generateFood();
    } else {
      this.snake.pop();
    }

    if (this.isCollisionWithWalls() || this.isCollisionWithSelf()) {
      clearInterval(this.interval);
      alert('Game Over!');
    }
  }


  isCollisionWithFood() {
    const head = this.snake[0];
    return head.x === this.food.x && head.y === this.food.y;
  }

  isCollisionWithWalls() {
    const head = this.snake[0];
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= this.gridSize ||
      head.y >= this.gridSize
    );
  }

  isCollisionWithSelf() {
    const head = this.snake[0];
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true;
      }
    }
    return false;
  }

  generateFood(): Point {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (this.isFoodOnSnake(newFood));
    return newFood;
  }

  isFoodOnSnake(food: Point) {
    for (let i = 0; i < this.snake.length; i++) {
      if (this.snake[i].x === food.x && this.snake[i].y === food.y) {
        return true;
      }
    }
    return false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (validKeys.includes(key)) {
      event.preventDefault();
      this.changeDirection(key.toLowerCase());
    }
  }

  changeDirection(newDirection: string) {
    const direction = newDirection.toLowerCase() as Direction;
    if (
      (this.direction === Direction.Up && direction === Direction.Down) ||
      (this.direction === Direction.Down && direction === Direction.Up) ||
      (this.direction === Direction.Left && direction === Direction.Right) ||
      (this.direction === Direction.Right && direction === Direction.Left)
    ) {
      // Add this check to ensure the new direction is not the opposite
      if (this.direction === newDirection) {
        return;
      }
    }

    this.direction = direction;
    this.snake = this.snake.map((segment, index) => {
      const newSegment = { ...segment, direction: direction };
      if (index === 0 && this.direction === newDirection) {
        return newSegment;
      } else {
        return newSegment;
      }
    });
  }

}
