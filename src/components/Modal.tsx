import { FC, useEffect, useState } from "react";

interface ModalProps {
  gameStatus: string | null;
  openModals: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const Modal: FC<ModalProps> = ({
  gameStatus,
  openModals,
  onClose,
  onRestart,
}) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId: number;
    if (gameStatus?.includes("check!")) {
      setIsRunning(false);
      return; // Early return if gameStatus includes "Check"
    }

    if (isRunning) {
      // Setting time from 0 to 1 every 10 milliseconds using javascript setInterval method
      intervalId = setInterval(() => setTimer((prev) => prev + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timer, gameStatus]);

  useEffect(() => {
    let timeoutId: number;
    if (openModals && gameStatus?.includes("check!")) {
      // Close modal after 3 seconds (3000 milliseconds)
      timeoutId = setTimeout(() => {
        onClose();
        setIsRunning(false); // Stop the timer
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [openModals, onClose]);

  if (!openModals) {
    return null;
  }

  return (
    <div
      className={`${
        openModals ? "block" : "hidden"
      } w-dvw h-dvh absolute bg-black/50 flex justify-center items-center`}
    >
      <div className="flex flex-col items-center justify-between w-1/3 gap-8 py-16 bg-white h-fit rounded-3xl">
        <h2 className="text-3xl duration-300 animate-ping-slow">
          {gameStatus}
        </h2>
        {gameStatus?.includes("checkmate!") ? (
          <button
            onClick={onRestart}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Play Again
          </button>
        ) : null}
      </div>
    </div>
  );
};
