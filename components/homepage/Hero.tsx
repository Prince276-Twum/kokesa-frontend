"use client";
import React from "react";
import { TiVideo } from "react-icons/ti";
import Button from "../UI/Button";

function Hero() {
  return (
    <div className="relative overflow-hidden bg-secondary pt-24 pb-16 lg:pt-32 lg:pb-28">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start gap-8 lg:gap-10 max-w-3xl">
            <h1 className="text-white font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-center lg:text-left">
              Get clients and manage bookings{" "}
              <span className="text-primary">easily</span> with Kokesa
            </h1>

            <p className="text-white/90 text-lg sm:text-xl leading-relaxed max-w-2xl text-center lg:text-left">
              Supercharge your business by listing on the best booking platform
              for beauty and household services. Join thousands of professionals
              already growing their client base.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <Button
                el="anchor"
                href="/auth/registration"
                primary
                rounded
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold transition-all hover:shadow-lg"
              >
                Get Started Free
              </Button>
              <Button
                el="button"
                secondary
                rounded
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 transition-all backdrop-blur-sm text-white border-none"
              >
                <TiVideo className="text-2xl" />
                <span>Watch Demo</span>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-2 lg:mt-6 text-center lg:text-left">
              <p className="text-white/50 text-sm mb-3">
                Trusted by 2,000+ businesses
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 opacity-70">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-24 bg-white/20 rounded-md backdrop-blur-sm"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="w-full lg:w-5/12 mt-8 lg:mt-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light opacity-30 blur-lg rounded-2xl"></div>
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden aspect-[5/4] lg:aspect-[4/5]">
                {/* Placeholder for dashboard preview or app screenshot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/30 text-sm">Dashboard Preview</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
