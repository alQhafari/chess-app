import { Piece, Color, PieceType } from "../ChessPiece";

export class Queen extends Piece {
  constructor(color: Color, initialCol: number, initialRow: number) {
    super(color, PieceType.QUEEN, initialCol, initialRow);
  }

  canMove(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): boolean {
    const deltaX = Math.abs(startCol - endRow);
    const deltaY = Math.abs(startCol - endRow);
    return deltaX === deltaY || startCol === endCol || startRow === endRow;
  }

  calculateNextValidMoves(
    startCol: number,
    startRow: number,
    board: (Piece | null)[][]
  ): void {
    this.nextValidMoves = [];
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 1 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
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

  private isValidCoordinate(col: number, row: number): boolean {
    return col >= 0 && col < 8 && row >= 0 && row < 8;
  }
}
