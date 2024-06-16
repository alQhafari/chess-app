import { Piece, Color, PieceType } from "../ChessPiece";

export class King extends Piece {
  constructor(color: Color, initialCol: number, initialRow: number) {
    super(color, PieceType.KING, initialCol, initialRow);
  }

  canMove(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): boolean {
    return Math.abs(startCol - endCol) <= 1 && Math.abs(startRow - endRow) <= 1;
  }

  calculateNextValidMoves(
    startCol: number,
    startRow: number,
    board: (Piece | null)[][]
  ): void {
    this.nextValidMoves = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const newCol = startCol + dx;
        const newRow = startRow + dy;
        if (
          this.isValidCoordinate(newCol, newRow) &&
          (board[newCol][newRow] === null ||
            board[newCol][newRow]?.color !== this.color)
        ) {
          this.nextValidMoves.push({
            col: newCol,
            row: newRow,
            isThereEnemy:
              board[newCol][newRow]?.color !== this.color &&
              board[newCol][newRow] !== null
                ? true
                : false,
          });
        }
      }
    }
  }

  private isValidCoordinate(col: number, row: number): boolean {
    return col >= 0 && col < 8 && row >= 0 && row < 8;
  }
}
