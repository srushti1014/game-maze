export interface Cell {
  row: number;
  col: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export class MazeBoard {
  private grid: Cell[][];
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      }))
    );
  }

  private getNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];

    const { row, col } = cell;
    // top
    if (row > 0) neighbors.push(this.grid[row - 1][col]);
    // right
    if (col < this.cols - 1) neighbors.push(this.grid[row][col + 1]);
    // bottom
    if (row < this.rows - 1) neighbors.push(this.grid[row + 1][col]);
    // left
    if (col > 0) neighbors.push(this.grid[row][col - 1]);

    // Return only unvisited neighbors
    return neighbors.filter((n) => !n.visited);
  }

  private removeWalls(current: Cell, next: Cell) {
    const x = current.col - next.col;
    const y = current.row - next.row;

    if (x === 1) {
      // next is left of current
      current.walls.left = false;
      next.walls.right = false;
    } else if (x === -1) {
      // next is right of current
      current.walls.right = false;
      next.walls.left = false;
    }

    if (y === 1) {
      // next is above current
      current.walls.top = false;
      next.walls.bottom = false;
    } else if (y === -1) {
      // next is below current
      current.walls.bottom = false;
      next.walls.top = false;
    }
  }

  public generateMaze() {
    const stack: Cell[] = [];

    const start = this.grid[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this.getNeighbors(current);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];

        this.removeWalls(current, next);

        next.visited = true;
        stack.push(next);
      } else {
        // Backtrack
        stack.pop();
      }
    }

    this.grid[0][0].walls.top = false;

    this.grid[this.rows - 1][this.cols - 1].walls.bottom = false;
  }

  public getGrid() {
    return this.grid;
  }
}
