import { Piece, Color, Position, PieceType } from "./ChessPiece";
import { King } from "./Piece/King";
import { Queen } from "./Piece/Queen";
import { Rook } from "./Piece/Rook";
import { Bishop } from "./Piece/Bishop";
import { Knight } from "./Piece/Knight";
import { Pawn } from "./Piece/Pawn";

export class Chessboard {
  board: (Piece | null)[][];
  isCheck: { [color: string]: boolean };
  isCheckmate: { [color: string]: boolean };

  constructor() {
    this.board = this.initializeBoard();
    this.isCheck = { [Color.WHITE]: false, [Color.BLACK]: false };
    this.isCheckmate = { [Color.WHITE]: false, [Color.BLACK]: false };
  }

  initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array.from({ length: 8 }, () =>
      Array(8).fill(null)
    );

    // Black
    board[0][0] = new Rook(Color.BLACK, 0, 0);
    board[0][1] = new Knight(Color.BLACK, 0, 1);
    board[0][2] = new Bishop(Color.BLACK, 0, 2);
    board[0][3] = new Queen(Color.BLACK, 0, 3);
    board[0][4] = new King(Color.BLACK, 0, 4);
    board[0][5] = new Bishop(Color.BLACK, 0, 5);
    board[0][6] = new Knight(Color.BLACK, 0, 6);
    board[0][7] = new Rook(Color.BLACK, 0, 7);
    for (let i = 0; i < 8; i++) {
      board[1][i] = new Pawn(Color.BLACK, 1, i);
    }

    // White
    board[7][0] = new Rook(Color.WHITE, 7, 0);
    board[7][1] = new Knight(Color.WHITE, 7, 1);
    board[7][2] = new Bishop(Color.WHITE, 7, 2);
    board[7][3] = new Queen(Color.WHITE, 7, 3);
    board[7][4] = new King(Color.WHITE, 7, 4);
    board[7][5] = new Bishop(Color.WHITE, 7, 5);
    board[7][6] = new Knight(Color.WHITE, 7, 6);
    board[7][7] = new Rook(Color.WHITE, 7, 7);
    for (let i = 0; i < 8; i++) {
      board[6][i] = new Pawn(Color.WHITE, 6, i);
    }

    return board;
  }

  movePiece(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): boolean {
    const piece = this.board[startCol][startRow];

    if (piece !== null) {
      const success = piece.move(endCol, endRow, this.board);
      if (success) {
        const opponentColor =
          piece.color === Color.WHITE ? Color.BLACK : Color.WHITE;

        if (this.isInCheck(piece.color)) {
          piece.move(startCol, startRow, this.board);
          return false;
        }

        this.recalculateValidMoves();

        this.isCheck[opponentColor] = this.isInCheck(opponentColor);
        this.isCheckmate[opponentColor] = this.isCheckmateCheck(opponentColor);

        return true;
      }
    }
    return false;
  }

  isInCheck(color: Color): boolean {
    const kingPosition = this.findKingPosition(color);
    return this.isSquareAttacked(kingPosition.col, kingPosition.row, color);
  }

  isCheckmateCheck(color: Color): boolean {
    if (!this.isInCheck(color)) return false;

    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        const piece = this.board[col][row];
        if (piece && piece.color === color) {
          piece.calculateNextValidMoves(col, row, this.board);
          for (const move of piece.nextValidMoves) {
            const originalPiece = this.board[move.col][move.row];
            piece.move(move.col, move.row, this.board);
            if (!this.isInCheck(color)) {
              piece.move(col, row, this.board);
              this.board[move.col][move.row] = originalPiece;
              return false;
            }
            piece.move(col, row, this.board);
            this.board[move.col][move.row] = originalPiece;
          }
        }
      }
    }

    return true;
  }

  findKingPosition(color: Color): Position {
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        const piece = this.board[col][row];
        if (piece && piece.type === PieceType.KING && piece.color === color) {
          return { col, row };
        }
      }
    }
    throw new Error(`King of color ${color} not found`);
  }

  isSquareAttacked(col: number, row: number, color: Color): boolean {
    const opponentColor = color === Color.WHITE ? Color.BLACK : Color.WHITE;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = this.board[x][y];
        if (piece && piece.color === opponentColor) {
          piece.calculateNextValidMoves(x, y, this.board);
          if (
            piece.nextValidMoves.some(
              (move) => move.col === col && move.row === row
            )
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  recalculateValidMoves(): void {
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        const piece = this.board[col][row];
        if (piece) {
          piece.calculateNextValidMoves(col, row, this.board);
        }
      }
    }
  }

  getBoard(): (Piece | null)[][] {
    return this.board;
  }
}
