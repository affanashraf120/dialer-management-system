// Spinner.tsx
import React from "react";

interface SpinnerProps {
  width?: number;
  height?: number;
  secondary?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  width = 34,
  height = 34,
  secondary = false,
}) => {
  return (
    <div
      className="spinner"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {[...Array(12)].map((_, idx) => (
        <div key={idx} className={`bar${idx + 1}`} />
      ))}
      <style jsx>{`
        .spinner {
          position: relative;
          display: inline-block;
        }

        .spinner div {
          width: 6%;
          height: 16%;
          background: ${secondary ? "#fff" : "#000"};
          position: absolute;
          left: 49%;
          top: 43%;
          opacity: 0;
          border-radius: 50px;
          animation: fade 1s linear infinite;
        }

        @keyframes fade {
          from {
            opacity: 1;
          }
          to {
            opacity: 0.25;
          }
        }

        .spinner .bar1 {
          transform: rotate(0deg) translate(0, -130%);
          animation-delay: 0s;
        }

        .spinner .bar2 {
          transform: rotate(30deg) translate(0, -130%);
          animation-delay: -0.9167s;
        }

        .spinner .bar3 {
          transform: rotate(60deg) translate(0, -130%);
          animation-delay: -0.833s;
        }

        .spinner .bar4 {
          transform: rotate(90deg) translate(0, -130%);
          animation-delay: -0.7497s;
        }

        .spinner .bar5 {
          transform: rotate(120deg) translate(0, -130%);
          animation-delay: -0.667s;
        }

        .spinner .bar6 {
          transform: rotate(150deg) translate(0, -130%);
          animation-delay: -0.5837s;
        }

        .spinner .bar7 {
          transform: rotate(180deg) translate(0, -130%);
          animation-delay: -0.5s;
        }

        .spinner .bar8 {
          transform: rotate(210deg) translate(0, -130%);
          animation-delay: -0.4167s;
        }

        .spinner .bar9 {
          transform: rotate(240deg) translate(0, -130%);
          animation-delay: -0.333s;
        }

        .spinner .bar10 {
          transform: rotate(270deg) translate(0, -130%);
          animation-delay: -0.2497s;
        }

        .spinner .bar11 {
          transform: rotate(300deg) translate(0, -130%);
          animation-delay: -0.167s;
        }

        .spinner .bar12 {
          transform: rotate(330deg) translate(0, -130%);
          animation-delay: -0.0833s;
        }
      `}</style>
    </div>
  );
};

export { Spinner };
