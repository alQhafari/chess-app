import { Piece, Color, PieceType } from "../ChessPiece";

export class Pawn extends Piece {
  constructor(color: Color, initialCol: number, initialRow: number) {
    super(color, PieceType.PAWN, initialCol, initialRow);
  }

  canMove(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): boolean {
    const direction = this.color === Color.WHITE ? -1 : 1;
    if (startCol === endCol) {
      if (endRow - startRow === direction) return true;
      if (
        (startRow === 1 && this.color === Color.BLACK) ||
        (startRow === 6 && this.color === Color.WHITE)
      ) {
        return endRow - startRow === 2 * direction;
      }
    }
    return false;
  }

  calculateNextValidMoves(
    startCol: number,
    startRow: number,
    board: Piece[][]
  ): void {
    this.nextValidMoves = [];

    const directionY = this.color === Color.WHITE ? -1 : 1;
    if (
      ((startCol === 6 && this.color === Color.WHITE) ||
        (startCol === 1 && this.color === Color.BLACK)) &&
      board[startCol + directionY * 2][startRow] === null
    ) {
      this.nextValidMoves.push({
        col: startCol + directionY * 2,
        row: startRow,
      });
    }

    if (board[startCol + directionY][startRow] === null) {
      this.nextValidMoves.push({
        col: startCol + directionY,
        row: startRow,
      });
    }

    //   Attack move
    const validCapture = [
      { col: startCol + directionY, row: startRow + 1 },
      { col: startCol + directionY, row: startRow - 1 },
      { col: startCol - directionY, row: startRow + 1 },
      { col: startCol - directionY, row: startRow - 1 },
    ];

    validCapture.forEach(({ col, row }) => {
      if (board[col][row] !== null && board[col][row]?.color !== this.color) {
        this.nextValidMoves.push({
          col,
          row,
          isThereEnemy: true,
        });
      }
    });
  }
}
