"use client";
import { CanvasIcon } from "./canvas-icon";
import { useState } from "react";
export function CanvasArt({ compact = false }: { compact?: boolean }) {
  const [run, setRun] = useState(0);
  return (
    <figure
      className={`canvas-art ${compact ? "canvas-art-compact" : ""}`}
      aria-label="Context woven into a useful workflow"
    >
      <svg
        key={run}
        viewBox="0 0 620 230"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <g className="weave-horizontal">
          {Array.from({ length: 34 }, (_, j) => {
            const y = 28 + j * 5;
            return (
              <path
                key={j}
                d={`M30 ${y}C180 ${y} 270 ${245 - y} 590 ${245 - y}`}
                stroke={j % 4 === 0 ? "#4F7061" : "#A5B6AC"}
                strokeWidth=".9"
              />
            );
          })}
        </g>
        <g className="weave-cross">
          {Array.from({ length: 34 }, (_, j) => (
            <path
              key={j}
              d={`M${95 + j * 12} 10 Q${220 + j * 4} 115 ${490 - j * 9} 225`}
              stroke="#9BA7A0"
              strokeWidth=".6"
            />
          ))}
        </g>
        <path d="M20 20h16m-8-8v16M590 210h16m-8-8v16" stroke="#294438" />
      </svg>
      {!compact && (
        <figcaption>
          <span>Context</span>
          <span>→ Skill →</span>
          <span>Useful output</span>
          <button
            type="button"
            onClick={() => setRun((v) => v + 1)}
            aria-label="Replay artwork motion"
            className="art-replay"
          >
            <CanvasIcon name="replay" />
          </button>
        </figcaption>
      )}
    </figure>
  );
}
