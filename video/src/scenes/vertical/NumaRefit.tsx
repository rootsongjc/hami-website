import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";
import { Bullets, SceneHeader, useSceneProgress } from "../../components/Shared";

// Vertical (1080x1920) NUMA refit: chips flow top-down into the NUMA box.
export const NumaSceneV: React.FC<{ c: VideoContent["numa"] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSceneProgress();

  const cpuIn = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 22 });
  const gpuIn = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 30 });
  const centerIn = spring({ frame, fps, config: springConfigs.bouncy, durationInFrames: 22, delay: 44 });
  const lineDraw = interpolate(frame, [34, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eventIn = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 14, delay: 68 });
  const pulse = interpolate(Math.sin(((frame - 62) / 50) * Math.PI), [0, 1], [0, 1]);

  const chip = (text: string, accent: string, s: number) => ({
    width: 640,
    height: 96,
    borderRadius: 16,
    border: `1.5px solid ${accent}`,
    background: colors.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    fontFamily: fonts.mono,
    fontSize: 25,
    color: colors.text,
    opacity: s,
    transform: `translateY(${(1 - s) * -36}px)`,
    boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
  });

  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 190 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} width={856} compact />
      </div>

      {/* connector line */}
      <svg width={1080} height={560} style={{ position: "absolute", left: 0, top: 640, pointerEvents: "none" }}>
        <line
          x1={540}
          y1={20}
          x2={540}
          y2={20 + 180 * lineDraw}
          stroke={colors.secondary}
          strokeWidth={3}
          strokeDasharray="10 8"
          opacity={0.75}
        />
        <line
          x1={540}
          y1={200}
          x2={540}
          y2={200 + 100 * lineDraw}
          stroke={colors.tertiary}
          strokeWidth={3}
          strokeDasharray="10 8"
          opacity={0.75}
        />
      </svg>

      <div style={{ position: "absolute", left: 220, top: 640, ...{ display: "flex" } }}>
        <div style={chip(c.cpuChip, colors.secondary, cpuIn)}>{c.cpuChip}</div>
      </div>
      <div style={{ position: "absolute", left: 220, top: 820 }}>
        <div style={chip(c.gpuChip, colors.tertiary, gpuIn)}>{c.gpuChip}</div>
      </div>

      {/* center NUMA box */}
      <div
        style={{
          position: "absolute",
          left: 314,
          top: 940,
          width: 452,
          height: 170,
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
          <svg width={36} height={36} viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke={colors.primaryLight} strokeWidth="1.8" />
            <rect x="9.5" y="9.5" width="5" height="5" fill={colors.primaryLight} opacity={0.8} />
          </svg>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 28, color: colors.text }}>
            {c.center}
          </span>
        </div>
      </div>

      {/* event chip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1155,
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
            fontSize: 22,
            color: colors.primaryLight,
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke={colors.primaryLight}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {c.event}
        </div>
      </div>

      <div style={{ position: "absolute", left: 64, bottom: 510 }}>
        <Bullets items={c.bullets} delay={84} width={856} compact />
      </div>
    </AbsoluteFill>
  );
};
