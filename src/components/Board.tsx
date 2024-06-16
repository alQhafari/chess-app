import { useEffect, useState } from "react";
import piece from "../assets";
import { Timer } from "./Timer";
import { cn } from "../utils/cs";

const initialBoard = [
  [
    "blackRook",
    "blackKnight",
    "blackBishop",
    "blackQueen",
    "blackKing",
    "blackBishop",
    "blackKnight",
    "blackRook",
  ],
  [
    "blackPawn",
    "blackPawn",
    "blackPawn",
    "blackPawn",
    "blackPawn",
    "blackPawn",
    "blackPawn",
    "blackPawn",
  ],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "whitePawn",
    "whitePawn",
    "whitePawn",
    "whitePawn",
    "whitePawn",
    "whitePawn",
    "whitePawn",
    "whitePawn",
  ],
  [
    "whiteRook",
    "whiteKnight",
    "whiteBishop",
    "whiteQueen",
    "whiteKing",
    "whiteBishop",
    "whiteKnight",
    "whiteRook",
  ],
];

const pieceImages: { [key: string]: string } = {
  blackRook: piece.blackRook,
  blackKnight: piece.blackKnight,
  blackBishop: piece.blackBishop,
  blackQueen: piece.blackQueen,
  blackKing: piece.blackKing,
  blackPawn: piece.blackPawn,
  whiteRook: piece.whiteRook,
  whiteKnight: piece.whiteKnight,
  whiteBishop: piece.whiteBishop,
  whiteQueen: piece.whiteQueen,
  whiteKing: piece.whiteKing,
  whitePawn: piece.whitePawn,
};

type Position = { row: number; col: number };

const getValidMoves = (
  piece: string,
  position: Position,
  board: string[][]
): Position[] => {
  const moves: Position[] = [];
  const isWhite = piece[0] === "w";
  const directions = isWhite ? -1 : 1;

  const isOpponentPiece = (row: number, col: number) => {
    return board[row][col] && board[row][col][0] !== piece[0];
  };

  const isEmptySquare = (row: number, col: number) => {
    return board[row][col] === "";
  };

  switch (piece.substring(5).toLowerCase()) {
    case "pawn":
      // Pawn starting moves
      if ((isWhite && position.row === 6) || (!isWhite && position.row === 1)) {
        if (
          board[position.row + directions][position.col] === "" &&
          board[position.row + 2 * directions][position.col] === ""
        ) {
          moves.push({ row: position.row + 2 * directions, col: position.col });
        }
      }

      // Pawn simple moves
      if (board[position.row + directions][position.col] === "") {
        moves.push({ row: position.row + directions, col: position.col });
      }

      // Attack
      if (
        position.col > 0 &&
        board[position.row + directions][position.col - 1] !== "" &&
        board[position.row + directions][position.col - 1][0] !== piece[0]
      ) {
        moves.push({ row: position.row + directions, col: position.col - 1 });
      }
      if (
        position.col < 7 &&
        board[position.row + directions][position.col + 1] !== "" &&
        board[position.row + directions][position.col + 1][0] !== piece[0]
      ) {
        moves.push({ row: position.row + directions, col: position.col + 1 });
      }

      break;

    case "rook":
      // Rook moves horizontally and vertically
      for (let i = position.row + 1; i < 8; i++) {
        if (isEmptySquare(i, position.col)) {
          moves.push({ row: i, col: position.col });
        } else if (isOpponentPiece(i, position.col)) {
          moves.push({ row: i, col: position.col });
          break;
        } else break;
      }
      for (let i = position.row - 1; i >= 0; i--) {
        if (isEmptySquare(i, position.col)) {
          moves.push({ row: i, col: position.col });
        } else if (isOpponentPiece(i, position.col)) {
          moves.push({ row: i, col: position.col });
          break;
        } else break;
      }
      for (let i = position.col + 1; i < 8; i++) {
        if (isEmptySquare(position.row, i)) {
          moves.push({ row: position.row, col: i });
        } else if (isOpponentPiece(position.row, i)) {
          moves.push({ row: position.row, col: i });
          break;
        } else break;
      }
      for (let i = position.col - 1; i >= 0; i--) {
        if (isEmptySquare(position.row, i)) {
          moves.push({ row: position.row, col: i });
        } else if (isOpponentPiece(position.row, i)) {
          moves.push({ row: position.row, col: i });
          break;
        } else break;
      }
      break;

    case "knight":
      // Knight moves in L shape
      const knightMoves = [
        { row: position.row + 2, col: position.col + 1 },
        { row: position.row + 2, col: position.col - 1 },
        { row: position.row - 2, col: position.col + 1 },
        { row: position.row - 2, col: position.col - 1 },
        { row: position.row + 1, col: position.col + 2 },
        { row: position.row + 1, col: position.col - 2 },
        { row: position.row - 1, col: position.col + 2 },
        { row: position.row - 1, col: position.col - 2 },
      ];
      knightMoves.forEach((move) => {
        if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
          if (
            isEmptySquare(move.row, move.col) ||
            isOpponentPiece(move.row, move.col)
          ) {
            moves.push(move);
          }
        }
      });
      break;

    case "bishop":
      // Bishop moves diagonally
      for (let i = 1; i < 8; i++) {
        if (position.row + i < 8 && position.col + i < 8) {
          if (isEmptySquare(position.row + i, position.col + i)) {
            moves.push({ row: position.row + i, col: position.col + i });
          } else if (isOpponentPiece(position.row + i, position.col + i)) {
            moves.push({ row: position.row + i, col: position.col + i });
            break;
          } else break;
        }
      }
      for (let i = 1; i < 8; i++) {
        if (position.row + i < 8 && position.col - i >= 0) {
          if (isEmptySquare(position.row + i, position.col - i)) {
            moves.push({ row: position.row + i, col: position.col - i });
          } else if (isOpponentPiece(position.row + i, position.col - i)) {
            moves.push({ row: position.row + i, col: position.col - i });
            break;
          } else break;
        }
      }
      for (let i = 1; i < 8; i++) {
        if (position.row - i >= 0 && position.col + i < 8) {
          if (isEmptySquare(position.row - i, position.col + i)) {
            moves.push({ row: position.row - i, col: position.col + i });
          } else if (isOpponentPiece(position.row - i, position.col + i)) {
            moves.push({ row: position.row - i, col: position.col + i });
            break;
          } else break;
        }
      }
      for (let i = 1; i < 8; i++) {
        if (position.row - i >= 0 && position.col - i >= 0) {
          if (isEmptySquare(position.row - i, position.col - i)) {
            moves.push({ row: position.row - i, col: position.col - i });
          } else if (isOpponentPiece(position.row - i, position.col - i)) {
            moves.push({ row: position.row - i, col: position.col - i });
            break;
          } else break;
        }
      }
      break;

    case "queen":
      // Queen combines rook and bishop moves
      for (let i = position.row + 1; i < 8; i++) {
        if (isEmptySquare(i, position.col)) {
          moves.push({ row: i, col: position.col });
        } else if (isOpponentPiece(i, position.col)) {
          moves.push({ row: i, col: position.col });
          break;
        } else break;
      }
      for (let i = position.row - 1; i >= 0; i--) {
        if (isEmptySquare(i, position.col)) {
          moves.push({ row: i, col: position.col });
        } else if (isOpponentPiece(i, position.col)) {
          moves.push({ row: i, col: position.col });
          break;
        } else break;
      }
      for (let i = position.col + 1; i < 8; i++) {
        if (isEmptySquare(position.row, i)) {
          moves.push({ row: position.row, col: i });
        } else if (isOpponentPiece(position.row, i)) {
          moves.push({ row: position.row, col: i });
          break;
        } else break;
      }
      for (let i = position.col - 1; i >= 0; i--) {
        if (isEmptySquare(position.row, i)) {
          moves.push({ row: position.row, col: i });
        } else if (isOpponentPiece(position.row, i)) {
          moves.push({ row: position.row, col: i });
          break;
        } else break;
      }
      for (let i = 1; i < 8; i++) {
        if (position.row + i < 8 && position.col + i < 8) {
          if (isEmptySquare(position.row + i, position.col + i)) {
            moves.push({ row: position.row + i, col: position.col + i });
          } else if (isOpponentPiece(position.row + i, position.col + i)) {
            moves.push({ row: position.row + i, col: position.col + i });
            break;
          } else break;
        }
      }
      for (let i = 1; i < 8; i++) {
        if (position.row + i < 8 && position.col - i >= 0) {
          if (isEmptySquare(position.row + i, position.col - i)) {
            moves.push({ row: position.row + i, col: position.col - i });
          } else if (isOpponentPiece(position.row + i, position.col - i)) {
            moves.push({ row: position.row + i, col: position.col - i });
            break;
          } else break;
        }
      }
      for (let i = 1; i < 8; i++) {
        if (position.row - i >= 0 && position.col + i < 8) {
          if (isEmptySquare(position.row - i, position.col + i)) {
            moves.push({ row: position.row - i, col: position.col + i });
          } else if (isOpponentPiece(position.row - i, position.col + i)) {
            moves.push({ row: position.row - i, col: position.col + i });
            break;
          } else break;
        }
      }
      for (let i = 1; i < 8; i++) {
        if (position.row - i >= 0 && position.col - i >= 0) {
          if (isEmptySquare(position.row - i, position.col - i)) {
            moves.push({ row: position.row - i, col: position.col - i });
          } else if (isOpponentPiece(position.row - i, position.col - i)) {
            moves.push({ row: position.row - i, col: position.col - i });
            break;
          } else break;
        }
      }
      break;

    case "king":
      // King moves one square in any direction
      const kingMoves = [
        { row: position.row + 1, col: position.col },
        { row: position.row - 1, col: position.col },
        { row: position.row, col: position.col + 1 },
        { row: position.row, col: position.col - 1 },
        { row: position.row + 1, col: position.col + 1 },
        { row: position.row + 1, col: position.col - 1 },
        { row: position.row - 1, col: position.col + 1 },
        { row: position.row - 1, col: position.col - 1 },
      ];
      kingMoves.forEach((move) => {
        if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
          if (
            isEmptySquare(move.row, move.col) ||
            isOpponentPiece(move.row, move.col)
          ) {
            moves.push(move);
          }
        }
      });
      break;
  }

  return moves;
};

const isCheck = (
  position: Position,
  board: string[][],
  opponentColor: string
): boolean => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (
        board[row][col][0] === opponentColor[0] &&
        board[row][col].substring(5) === "King"
      ) {
        const moves = getValidMoves(board[row][col], { row, col }, board);
        console.log(moves);
        if (
          moves.some(
            (move) => move.row === position.row && move.col === position.col
          )
        ) {
          console.log("Check");
          return true;
        }
      }
    }
  }
  console.log("Not Check");
  return false;
};

const findKing = (board: string[][], playerColor: string): Position => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === playerColor + "King") {
        return { row, col };
      }
    }
  }
  return { row: -1, col: -1 };
};

const isCheckmate = (
  kingPosition: Position,
  board: string[][],
  playerColor: string
): boolean => {
  if (!isCheck(kingPosition, board, playerColor)) {
    return false;
  }

  // Check all possible moves to get out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col][0] === playerColor[0]) {
        const moves = getValidMoves(board[row][col], { row, col }, board);
        for (const move of moves) {
          const newBoard = board.map((r, i) =>
            r.map((c, j) =>
              i === row && j === col
                ? ""
                : i === move.row && j === move.col
                ? board[row][col]
                : c
            )
          );
          newBoard[move.row][move.col] = board[row][col];
          newBoard[row][col] = "";
          if (
            !isCheck(findKing(newBoard, playerColor), newBoard, playerColor)
          ) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

export const Board = () => {
  const [player, setPlayer] = useState("w");
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [board, setBoard] = useState(initialBoard);

  const handleClickSquare = (
    piece: string,
    rowIndex: number,
    colIndex: number
  ) => {
    if (Object.keys(pieceImages).includes(piece) && piece[0] === player) {
      console.log(piece);
      setSelectedPiece({ row: rowIndex, col: colIndex });
      console.log(selectedPiece);
      console.log(
        getValidMoves(piece, { row: rowIndex, col: colIndex }, board)
      );

      setValidMoves(
        getValidMoves(piece, { row: rowIndex, col: colIndex }, board)
      );
      console.log(validMoves);
    } else {
      const clicked = { row: rowIndex, col: colIndex };
      const x = validMoves.filter(({ row, col }) => {
        return clicked.row === row && clicked.col === col;
      });

      if (x.length > 0 && selectedPiece) {
        movePiece(selectedPiece, clicked);
      }
    }
  };

  const movePiece = (from: Position, to: Position) => {
    const newBoard = board.map((row) => [...row]); // Create a shallow copy of the board
    const piece = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = "";
    newBoard[to.row][to.col] = piece;
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    setPlayer(player === "w" ? "b" : "w");
  };

  const isMoveValid = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  const isThereEnemy = (board: string[][], row: number, col: number) => {
    return board[row][col] !== "";
  };

  useEffect(() => {
    console.log(player);
    const playerColor = player === "w" ? "white" : "black";
    console.log(playerColor);
    const kingPosition = findKing(board, playerColor);
    console.log(kingPosition);
    if (isCheck(kingPosition, board, playerColor)) {
      if (isCheckmate(kingPosition, board, playerColor)) {
        alert(`${playerColor} is in checkmate!`);
      } else {
        alert(`${playerColor} is in check!`);
      }
    }
  }, [board, player]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Timer />
      <div className="grid grid-cols-8 grid-rows-8 w-[800px] h-[800px] bg-gray-200 p-10">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isEvenRow = rowIndex % 2 === 0;
            const isEvenCol = colIndex % 2 === 0;
            const isBlack = isEvenRow ? isEvenCol : !isEvenCol;
            const isValidMove = isMoveValid(rowIndex, colIndex);
            const isAnyEnemy = isValidMove
              ? isThereEnemy(board, rowIndex, colIndex)
              : false;
            const isSelected =
              rowIndex === selectedPiece?.row && colIndex === selectedPiece.col;
            return (
              <div
                onClick={() => handleClickSquare(piece, rowIndex, colIndex)}
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  isAnyEnemy
                    ? "bg-red-500"
                    : isSelected
                    ? "bg-green-100"
                    : isValidMove
                    ? "bg-green-400"
                    : isBlack
                    ? "bg-white"
                    : "bg-gray-400"
                )}
              >
                {piece && <img src={pieceImages[piece]} alt={piece} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
