import { Piece, Color, PieceType } from "../ChessPiece";

export class Bishop extends Piece {
  constructor(color: Color, initialCol: number, initialRow: number) {
    super(color, PieceType.BISHOP, initialCol, initialRow);
  }

  canMove(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): boolean {
    return Math.abs(startCol - endCol) === Math.abs(startRow - endRow);
  }

  calculateNextValidMoves(
    startCol: number,
    startRow: number,
    board: (Piece | null)[][]
  ): void {
    this.nextValidMoves = [];
    const directions = [
      { dx: 1, dy: -1 },
      { dx: 1, dy: 1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ];

    for (const { dx, dy } of directions) {
      let col = startCol + dx;
      let row = startRow + dy;

      while (
        this.isValidCoordinate(col, row) &&
        (board[col][row] === null || board[col][row]?.color !== this.color)
      ) {
        this.nextValidMoves.push({
          col,
          row,
          isThereEnemy:
            board[col][row]?.color !== this.color && board[col][row] !== null
              ? true
              : false,
        });
        if (board[col][row] !== null && board[col][row]?.color !== this.color)
          break;
        col += dx;
        row += dy;
      }
    }
  }

  private isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }
}
