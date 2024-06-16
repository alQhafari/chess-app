import { useEffect, useState } from "react";

export const Timer = () => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTimer(timer + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timer]);

  // Hours calculation
  const hours = Math.floor(timer / 360000);

  // Minutes calculation
  const minutes = Math.floor((timer % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((timer % 6000) / 100);

  // Method to start and stop timer
  const startAndStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="mb-10  stopwatch-container">
      <p className="text-4xl stopwatch-time">
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
};
