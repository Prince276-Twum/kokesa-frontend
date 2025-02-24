import React from "react";
import { TiVideo } from "react-icons/ti";
import Button from "../UI/Button";

function Hero() {
  return (
    <div className="px-6 lg:px-8 py-12 lg:py-20 min-h-[500px] lg:min-h-[650px] flex items-center">
      <div className="w-full content-max-width">
        <div className="flex flex-col items-center lg:items-start gap-8 lg:gap-10 max-w-3xl">
          <h1 className="text-white font-semibold text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.2] text-center lg:text-left">
            Get clients and manage bookings easily with Kokesa
          </h1>
          <p className="text-white/90 text-lg sm:text-xl lg:text-2xl max-w-2xl text-center lg:text-left">
            Supercharge your business by listing on the best booking platform
            for beauty and household services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            <Button
              el="anchor"
              href="auth/registration"
              primary
              rounded
              className="w-full sm:w-auto px-8 py-4 text-lg font-medium"
              style={{
                backgroundColor: "#EB5017",
                borderColor: "#EB5017",
              }}
            >
              Get Started
            </Button>
            <Button
              el="button"
              secondary
              rounded
              className="w-full sm:w-auto px-8 py-4 text-lg font-medium flex items-center justify-center gap-3"
            >
              <TiVideo className="text-2xl" />
              <span>See Demo</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
