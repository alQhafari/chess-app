import { Particle } from "../components/Particle";

import { ChessBoardComponent } from "../components/ChessBoardComponent";

export const Game = () => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden w-dvw h-dvh">
      <ChessBoardComponent />
      <Particle />
    </div>
  );
};
