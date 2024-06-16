import { Particle } from "../components/Particle";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="w-dvw h-dvh relative flex justify-center items-center">
      <div className="w-1/2 h-1/2 flex flex-col justify-center items-center gap-12">
        <div>
          <h1 className="font-bold text-7xl text-center">Chess Game</h1>
          <p className="text-center font-sans">by: Abi Al Qhafari</p>
        </div>
        <Link to={`/game`} className="w-fit">
          <button className="bg-black hover:bg-black/25 text-white font-bold py-4 px-8 rounded-full tracking-widest">
            Play Now
          </button>
        </Link>
      </div>
      <Particle />
    </div>
  );
};
