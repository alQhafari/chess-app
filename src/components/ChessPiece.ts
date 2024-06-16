export enum Color {
  WHITE = "white",
  BLACK = "black",
}

export enum PieceType {
  KING = "king",
  QUEEN = "queen",
  ROOK = "rook",
  BISHOP = "bishop",
  KNIGHT = "knight",
  PAWN = "pawn",
}

export type Position = { col: number; row: number; isThereEnemy?: boolean };

export abstract class Piece {
  nextValidMoves: Position[] = [];
  validMovesCalculated: boolean = false;
  currentCol: number;
  currentRow: number;

  constructor(
    public color: Color,
    public type: PieceType,
    initialCol: number,
    initialRow: number
  ) {
    this.currentCol = initialCol;
    this.currentRow = initialRow;
  }

  abstract canMove(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): boolean;

  abstract calculateNextValidMoves(
    startCol: number,
    startRow: number,
    board: (Piece | null)[][]
  ): void;

  getCurrentPosition(): { col: number; row: number } {
    return { col: this.currentCol, row: this.currentRow };
  }

  move(newCol: number, newRow: number, board: (Piece | null)[][]): boolean {
    if (!this.validMovesCalculated) {
      this.calculateNextValidMoves(this.currentCol, this.currentRow, board);
    }

    const isValidMove = this.nextValidMoves.some(
      (move) => move.col === newCol && move.row === newRow
    );

    if (isValidMove) {
      const oldCol = this.currentCol;
      const oldRow = this.currentRow;
      this.currentCol = newCol;
      this.currentRow = newRow;

      board[newCol][newRow] = this;
      board[oldCol][oldRow] = null;

      this.nextValidMoves = [];
      this.validMovesCalculated = false;

      return true;
    } else {
      // Invalid move
      return false;
    }
  }
}
