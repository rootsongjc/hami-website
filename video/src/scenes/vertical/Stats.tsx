import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { type VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";
import { SceneHeader, useSceneProgress } from "../../components/Shared";

// Vertical (1080x1920) stats: stacked counter rows.
export const StatsSceneV: React.FC<{ c: VideoContent["stats"] }> = ({ c }) => {
  const p = useSceneProgress();
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 190 }}>
        <SceneHeader kicker={c.kicker} title={c.title} delay={6} width={856} compact />
      </div>
      <div
        style={{
          marginTop: 70,
          marginLeft: 64,
          width: 856,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {c.items.map((item, i) => (
          <StatRow key={i} item={item} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const StatRow: React.FC<{ item: VideoContent["stats"]["items"][number]; index: number }> = ({
  item,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = 34 + index * 16;
  const inS = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: d });
  const count = Math.round(
    interpolate(frame, [d, d + 55], [0, item.value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        width: 856,
        padding: "34px 0",
        borderBottom: index < 2 ? `1px solid ${colors.border}` : "none",
        opacity: inS,
        transform: `translateY(${(1 - inS) * 36}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", width: 360, justifyContent: "flex-end" }}>
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 118,
            lineHeight: 1,
            color: colors.text,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count}
        </span>
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 60,
            color: colors.primaryLight,
          }}
        >
          {item.suffix}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 34, color: colors.text }}>
          {item.label}
        </span>
        <span style={{ fontFamily: fonts.body, fontSize: 24, color: colors.faint }}>{item.sub}</span>
      </div>
    </div>
  );
};
