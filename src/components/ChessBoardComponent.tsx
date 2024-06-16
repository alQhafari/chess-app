import { useEffect, useState } from "react";
import { Chessboard } from "./ChessBoard";
import { Piece, Color, Position } from "./ChessPiece";
import pieceAsset from "../assets";
import { cn } from "../utils/cs";
import { Timer } from "./Timer";
import { Modal } from "./Modal";
import { flushSync } from "react-dom";

const renderPiece = (piece: Piece) => {
  const pieceSymbol = {
    [Color.WHITE]: {
      king: pieceAsset.whiteKing,
      queen: pieceAsset.whiteQueen,
      rook: pieceAsset.whiteRook,
      bishop: pieceAsset.whiteBishop,
      knight: pieceAsset.whiteKnight,
      pawn: pieceAsset.whitePawn,
    },
    [Color.BLACK]: {
      king: pieceAsset.blackKing,
      queen: pieceAsset.blackQueen,
      rook: pieceAsset.blackRook,
      bishop: pieceAsset.blackBishop,
      knight: pieceAsset.blackKnight,
      pawn: pieceAsset.blackPawn,
    },
  };

  return pieceSymbol[piece.color][piece.type];
};

export const ChessBoardComponent = () => {
  const [board, setBoard] = useState(new Chessboard());
  const [selected, setSelected] = useState<{ col: number; row: number } | null>(
    null
  );
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [player, setPlayer] = useState("w");
  const [gameStatus, setGameStatus] = useState<string | null>(
    "Black is in check!"
  );
  const [openModals, setOpenModals] = useState(false);

  const handleSquareClick = (col: number, row: number) => {
    if (selected) {
      const moved = board.movePiece(selected.col, selected.row, col, row);
      if (moved) {
        setBoard(board);
        setSelected(null);
        setValidMoves([]);

        if (board.isCheck[Color.WHITE]) {
          setGameStatus("White is in check!");
          setOpenModals(true);
        }
        if (board.isCheck[Color.BLACK]) {
          setGameStatus("Black is in check!");
          setOpenModals(true);
        }
        if (board.isCheckmate[Color.WHITE]) {
          setGameStatus("White is in checkmate! Black wins!");
          setOpenModals(true);
        }
        if (board.isCheckmate[Color.BLACK]) {
          setGameStatus("Black is in checkmate! White wins!");
          setOpenModals(true);
        }
        setPlayer(player === "w" ? "b" : "w");
      } else {
        setSelected(null);
        setValidMoves([]);
      }
    } else {
      const piece = board.getBoard()[col][row];
      if (piece && piece.color[0] === player) {
        setSelected({ col, row });
        piece.calculateNextValidMoves(col, row, board.getBoard());

        setValidMoves(piece.nextValidMoves);
      }
    }
  };

  const closeModal = () => {
    setOpenModals(false);
  };

  const restartGame = () => {
    setBoard(new Chessboard());
    setSelected(null);
    setGameStatus(null);
    setOpenModals(false);
    setPlayer("w");
  };

  return (
    <div className="relative flex flex-col items-center w-full h-full">
      <div className="flex justify-between w-[800px] mt-8">
        <div>
          <h2 className="text-3xl">White</h2>
          <p className="text-green-600">{player === "w" ? "Turned" : ""}</p>
        </div>
        <Timer />
        <div>
          <h2 className="text-3xl">Black</h2>
          <p className="text-green-600">{player === "b" ? "Turned" : ""}</p>
        </div>
      </div>
      <div className="grid w-[800px] h-[800px] grid-cols-8 grid-rows-8 p-10 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border-2 border-gray-300">
        {board.getBoard().map((row, colIndex) =>
          row.map((piece, rowIndex) => {
            const isEvenRow = rowIndex % 2 === 0;
            const isEvenCol = colIndex % 2 === 0;
            const isBlack = isEvenRow ? isEvenCol : !isEvenCol;
            const isValidMove = validMoves.some(
              (move) => move.col === colIndex && move.row === rowIndex
            );
            const isThereEnemy = validMoves.some(
              (move) =>
                move.col === colIndex &&
                move.row === rowIndex &&
                move.isThereEnemy === true
            );
            return (
              <div
                onClick={() => handleSquareClick(colIndex, rowIndex)}
                key={`${colIndex}-${rowIndex}`}
                className={cn(
                  "aspect-square",
                  isBlack ? "bg-white" : "bg-gray-500",
                  selected?.col === colIndex && selected?.row === rowIndex
                    ? "border-4 border-yellow-500"
                    : "",
                  isValidMove ? "border-4 border-green-300" : "",
                  isThereEnemy ? "border-4 border-red-400" : ""
                )}
              >
                <>{piece ? <img src={renderPiece(piece)}></img> : null}</>
              </div>
            );
          })
        )}
      </div>

      <Modal
        gameStatus={gameStatus}
        openModals={openModals}
        onClose={closeModal}
        onRestart={restartGame}
      />
    </div>
  );
};
