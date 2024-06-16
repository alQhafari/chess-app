import { Piece, Color, PieceType } from "../ChessPiece";

export class Knight extends Piece {
  constructor(color: Color, initialCol: number, initialRow: number) {
    super(color, PieceType.KNIGHT, initialCol, initialRow);
  }

  canMove(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): boolean {
    const deltaX = Math.abs(startCol - endCol);
    const deltaY = Math.abs(startRow - endRow);
    return (deltaX === 2 && deltaY === 1) || (deltaX === 1 && deltaY === 2);
  }

  calculateNextValidMoves(
    startCol: number,
    startRow: number,
    board: (Piece | null)[][]
  ): void {
    this.nextValidMoves = [];

    const directions = [
      { dx: 1, dy: -2 },
      { dx: 2, dy: -1 },
      { dx: 1, dy: 2 },
      { dx: 2, dy: 1 },
      { dx: -1, dy: -2 },
      { dx: -2, dy: -1 },
      { dx: -1, dy: 2 },
      { dx: -2, dy: 1 },
    ];

    for (const { dx, dy } of directions) {
      let col = startCol + dx;
      let row = startRow + dy;

      if (
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
      }
    }
  }

  private isValidCoordinate(col: number, row: number): boolean {
    return col >= 0 && col < 8 && row >= 0 && row < 8;
  }
}
