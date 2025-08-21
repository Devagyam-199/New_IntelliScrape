import { useEffect, React } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const LoadingScreen = ({ loading }) => {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 flex justify-center items-center">
      <ScaleLoader
        color="#26C6DA"
        loading={loading}
        height={32}
        width={3}
        margin={6}
        aria-label="navigation loading screen"
      />
    </div>
  );
};

export default LoadingScreen;
