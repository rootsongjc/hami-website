import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";
import { Bullets, Card, Chip, SceneHeader, useSceneProgress } from "../../components/Shared";

// Vertical (1080x1920) AMD scene: GPU card then bullets, stacked.
export const AmdSceneV: React.FC<{ c: VideoContent["amd"] }> = ({ c }) => {
  const p = useSceneProgress();
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 190 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} width={856} compact />
      </div>
      <GpuCardV c={c} />
      <div style={{ position: "absolute", left: 64, bottom: 510 }}>
        <Bullets items={c.bullets} delay={80} width={856} compact />
      </div>
    </AbsoluteFill>
  );
};

const GpuCardV: React.FC<{ c: VideoContent["amd"] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 22 });
  return (
    <div style={{ position: "absolute", left: 64, top: 590, opacity: inS, transform: `translateY(${(1 - inS) * 40}px)` }}>
      <Card width={856} height={620} accent={colors.secondary}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 36, color: colors.text, letterSpacing: 2 }}>
            {c.cardTitle}
          </span>
          <svg width={38} height={38} viewBox="0 0 24 24">
            <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke={colors.secondary} strokeWidth="1.6" />
            <path d="M7 10v4M10 9v6M13 10v4M16 9v6" stroke={colors.secondary} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="5" cy="4" r="1.4" fill={colors.secondary} />
          </svg>
        </div>
        <div style={{ marginTop: 4, fontFamily: fonts.mono, fontSize: 21, color: colors.muted }}>{c.cardSub}</div>

        {c.bars.map((bar, i) => {
          const d = 44 + i * 16;
          const fill = interpolate(
            spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 40, delay: d }),
            [0, 1],
            [0, bar.fill]
          );
          const labelIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 12, delay: d - 4 });
          return (
            <div key={i} style={{ marginTop: 36, opacity: labelIn }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 28, color: colors.text }}>
                  {bar.label}
                </span>
                <span style={{ fontFamily: fonts.mono, fontSize: 19, color: colors.secondary }}>{bar.value}</span>
              </div>
              <div style={{ marginTop: 12, height: 16, borderRadius: 8, background: colors.surface3, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${fill * 100}%`,
                    height: "100%",
                    borderRadius: 8,
                    background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 38, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {c.chips.map((chip, i) => {
            const s = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 12, delay: 100 + i * 8 });
            return (
              <span key={i} style={{ opacity: s, transform: `scale(${0.8 + s * 0.2})` }}>
                <Chip size={19}>{chip}</Chip>
              </span>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
