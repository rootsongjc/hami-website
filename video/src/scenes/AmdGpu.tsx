import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../content";
import { colors, fonts, springConfigs } from "../theme";
import { Bullets, Card, Chip, SceneHeader, useSceneProgress } from "../components/Shared";

type Amd = VideoContent["amd"];

const GpuCard: React.FC<{ c: Amd }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 18 });
  return (
    <div style={{ opacity: inS, transform: `translateX(${(1 - inS) * 80}px) scale(${0.96 + inS * 0.04})` }}>
      <Card width={640} height={560} accent={colors.secondary}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 40, color: colors.text, letterSpacing: 2 }}>
            {c.cardTitle}
          </span>
          <svg width={44} height={44} viewBox="0 0 24 24">
            <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke={colors.secondary} strokeWidth="1.6" />
            <path d="M7 10v4M10 9v6M13 10v4M16 9v6" stroke={colors.secondary} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="5" cy="4" r="1.4" fill={colors.secondary} />
          </svg>
        </div>
        <div style={{ marginTop: 6, fontFamily: fonts.mono, fontSize: 23, color: colors.muted }}>{c.cardSub}</div>

        {c.bars.map((bar, i) => {
          const d = 40 + i * 16;
          const fill = interpolate(spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 40, delay: d }), [0, 1], [0, bar.fill]);
          const labelIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 12, delay: d - 4 });
          return (
            <div key={i} style={{ marginTop: 42, opacity: labelIn }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 30, color: colors.text }}>
                  {bar.label}
                </span>
                <span style={{ fontFamily: fonts.mono, fontSize: 22, color: colors.secondary }}>{bar.value}</span>
              </div>
              <div
                style={{
                  marginTop: 14,
                  height: 18,
                  borderRadius: 9,
                  background: colors.surface3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${fill * 100}%`,
                    height: "100%",
                    borderRadius: 9,
                    background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 44, display: "flex", flexWrap: "wrap", gap: 14 }}>
          {c.chips.map((chip, i) => {
            const s = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 12, delay: 92 + i * 8 });
            return (
              <span key={i} style={{ opacity: s, transform: `scale(${0.8 + s * 0.2})` }}>
                <Chip size={22}>{chip}</Chip>
              </span>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export const AmdScene: React.FC<{ c: Amd }> = ({ c }) => {
  const p = useSceneProgress();
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 120 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} width={1060} />
      </div>
      {/* bottom:185 keeps bullets above the caption band (text starts y≈949) */}
      <div style={{ position: "absolute", left: 110, bottom: 185 }}>
        <Bullets items={c.bullets} delay={54} width={880} />
      </div>
      <div style={{ position: "absolute", right: 130, top: 300 }}>
        <GpuCard c={c} />
      </div>
    </AbsoluteFill>
  );
};
