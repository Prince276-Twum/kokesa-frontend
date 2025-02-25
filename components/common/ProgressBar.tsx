// components/common/ProgressBar.tsx
import React, { useState, useEffect } from "react";

interface ProgressBarProps {
  progress?: number;
  height?: number;
  barColor?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  rounded?: boolean;
  animationDuration?: number;
}

// Create a global variable to store the last progress value
// This persists between renders as long as the browser tab remains open
let lastDisplayedProgress = 0;

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 100,
  height = 8,
  barColor = "#f97316",
  backgroundColor = "#e5e7eb",
  showPercentage = true,
  rounded = true,
  animationDuration = 1000,
}) => {
  // Start from the last known value
  const [displayedProgress, setDisplayedProgress] = useState<number>(
    lastDisplayedProgress
  );

  useEffect(() => {
    // Calculate animation steps
    const startValue: number = displayedProgress;
    const endValue: number = progress;

    // If values are equal, no need to animate
    if (startValue === endValue) {
      return;
    }

    const increment: number =
      (endValue - startValue) / (animationDuration / 16);
    let currentValue: number = startValue;
    let animationFrameId: number;

    function animateProgress() {
      if (
        (increment > 0 && currentValue < endValue) ||
        (increment < 0 && currentValue > endValue)
      ) {
        currentValue += increment;

        // Ensure we don't exceed boundaries
        if (increment > 0) {
          currentValue = Math.min(currentValue, endValue);
        } else {
          currentValue = Math.max(currentValue, endValue);
        }

        const newProgress = Math.floor(currentValue);
        setDisplayedProgress(newProgress);
        lastDisplayedProgress = newProgress; // Update the global variable

        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Ensure we land exactly on target
        setDisplayedProgress(endValue);
        lastDisplayedProgress = endValue; // Update the global variable
      }
    }

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [progress, animationDuration, displayedProgress]);

  return (
    <div className="w-full mb-6">
      <div
        className={`w-full ${rounded ? "rounded-full" : "rounded"}`}
        style={{
          height: `${height}px`,
          backgroundColor: backgroundColor,
        }}
      >
        <div
          className={`h-full ${
            rounded ? "rounded-full" : "rounded"
          } transition-all duration-300 ease-out`}
          style={{
            width: `${displayedProgress}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {showPercentage && (
        <div className="flex justify-end mt-1">
          <span className="text-sm text-gray-600">{displayedProgress}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
