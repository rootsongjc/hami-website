import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";
import { SceneHeader, useSceneProgress } from "../../components/Shared";

const ACCENTS = [colors.primary, colors.secondary, colors.tertiary];

const GridCardV: React.FC<{ title: string; desc: string; index: number; delay: number }> = ({
  title,
  desc,
  index,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 17, delay });
  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <div
      style={{
        width: 412,
        height: 264,
        borderRadius: 18,
        border: `1px solid ${colors.border}`,
        background: `linear-gradient(180deg, rgba(23,30,39,0.92), rgba(15,20,27,0.94))`,
        boxShadow: "0 14px 36px rgba(0,0,0,0.36)",
        padding: "26px 28px",
        position: "relative",
        overflow: "hidden",
        opacity: s,
        transform: `scale(${0.9 + s * 0.1}) translateY(${(1 - s) * 22}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 24, bottom: 24, width: 4, borderRadius: 2, background: accent }} />
      <div style={{ fontFamily: fonts.mono, fontSize: 19, color: accent }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ marginTop: 10, fontFamily: fonts.body, fontWeight: 700, fontSize: 29, color: colors.text, lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{ marginTop: 10, fontFamily: fonts.body, fontSize: 21, color: colors.muted, lineHeight: 1.5 }}>
        {desc}
      </div>
    </div>
  );
};

// Vertical (1080x1920) more: 2-column × 3-row grid.
export const MoreSceneV: React.FC<{ c: VideoContent["more"] }> = ({ c }) => {
  const p = useSceneProgress();
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 190 }}>
        <SceneHeader kicker={c.kicker} title={c.title} delay={6} width={856} compact />
      </div>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 560,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: "flex", gap: 22 }}>
            {c.cards.slice(row * 2, row * 2 + 2).map((card, i) => (
              <GridCardV key={row * 2 + i} title={card.title} desc={card.desc} index={row * 2 + i} delay={34 + (row * 2 + i) * 10} />
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
