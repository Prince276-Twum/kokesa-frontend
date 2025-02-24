import React from "react";

const KokesaLogo = ({ className = "", width = "w-24", height = "h-24" }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-[#EB5017] to-[#FF6B3D] rounded-lg flex items-center justify-center transform rotate-45 shadow-lg">
        <span className="text-white font-bold text-xl transform -rotate-45">
          K
        </span>
      </div>
      <span className="text-white text-2xl font-semibold tracking-wide">
        kokesa
      </span>
    </div>
  );
};

export default KokesaLogo;
