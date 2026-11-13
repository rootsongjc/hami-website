import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../content";
import { colors, fonts, springConfigs } from "../theme";
import { Bullets, SceneHeader, useSceneProgress } from "../components/Shared";

type Numa = VideoContent["numa"];

const CY = 560; // diagram center Y

const SourceChip: React.FC<{
  text: string;
  side: "left" | "right";
  accent: string;
  delay: number;
}> = ({ text, side, accent, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay });
  const dir = side === "left" ? -1 : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: CY - 56,
        left: side === "left" ? 190 : 1290,
        width: 440,
        height: 112,
        borderRadius: 16,
        border: `1.5px solid ${accent}`,
        background: colors.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        opacity: s,
        transform: `translateX(${(1 - s) * 110 * dir}px)`,
        boxShadow: `0 12px 34px rgba(0,0,0,0.4)`,
      }}
    >
      <svg width={34} height={34} viewBox="0 0 24 24">
        {side === "left" ? (
          <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke={accent} strokeWidth="1.7" />
        ) : (
          <path d="M3 6h18v12H3zM6 3h12" fill="none" stroke={accent} strokeWidth="1.7" />
        )}
      </svg>
      <span style={{ fontFamily: fonts.mono, fontSize: 26, color: colors.text }}>{text}</span>
    </div>
  );
};

export const NumaScene: React.FC<{ c: Numa }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSceneProgress();

  const centerIn = spring({ frame, fps, config: springConfigs.bouncy, durationInFrames: 22, delay: 42 });
  const lineDraw = interpolate(frame, [30, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eventIn = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 14, delay: 66 });
  const pulse = interpolate(Math.sin(((frame - 60) / 50) * Math.PI), [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 120 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} />
      </div>

      {/* connector lines */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path
          d={`M 630 ${CY} C 700 ${CY}, 730 ${CY}, 795 ${CY}`}
          stroke={colors.secondary}
          strokeWidth={3}
          strokeDasharray="10 8"
          opacity={0.75 * lineDraw}
          pathLength={1}
          strokeDashoffset={0}
        />
        <path
          d={`M 1290 ${CY} C 1220 ${CY}, 1190 ${CY}, 1125 ${CY}`}
          stroke={colors.tertiary}
          strokeWidth={3}
          strokeDasharray="10 8"
          opacity={0.75 * lineDraw}
        />
      </svg>

      <SourceChip text={c.cpuChip} side="left" accent={colors.secondary} delay={20} />
      <SourceChip text={c.gpuChip} side="right" accent={colors.tertiary} delay={28} />

      {/* center NUMA box */}
      <div
        style={{
          position: "absolute",
          top: CY - 90,
          left: 795,
          width: 330,
          height: 180,
          opacity: centerIn,
          transform: `scale(${0.6 + centerIn * 0.4})`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            border: `2px solid ${colors.primary}`,
            background: `rgba(16,208,93,${0.07 + pulse * 0.10})`,
            boxShadow: `0 0 ${30 + pulse * 40}px rgba(16,208,93,${0.15 + pulse * 0.2})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke={colors.primaryLight} strokeWidth="1.8" />
            <rect x="9.5" y="9.5" width="5" height="5" fill={colors.primaryLight} opacity={0.8} />
          </svg>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 28, color: colors.text, textAlign: "center", lineHeight: 1.3 }}>
            {c.center}
          </span>
        </div>
      </div>

      {/* event chip */}
      <div
        style={{
          position: "absolute",
          top: CY + 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: eventIn,
          transform: `translateY(${(1 - eventIn) * 14}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderRadius: 999,
            border: `1px solid ${colors.primaryDark}`,
            background: "rgba(16,208,93,0.10)",
            padding: "12px 26px",
            fontFamily: fonts.mono,
            fontSize: 24,
            color: colors.primaryLight,
          }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={colors.primaryLight} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.event}
        </div>
      </div>

      <div style={{ position: "absolute", left: 110, bottom: 155 }}>
        <Bullets items={c.bullets} delay={80} />
      </div>
    </AbsoluteFill>
  );
};
