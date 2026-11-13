import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { type VideoContent } from "../content";
import { colors, fonts, springConfigs } from "../theme";
import { SceneHeader, useSceneProgress } from "../components/Shared";

type Stats = VideoContent["stats"];

const StatColumn: React.FC<{
  item: VideoContent["stats"]["items"][number];
  index: number;
}> = ({ item, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = 30 + index * 14;
  const inS = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: d });
  const count = Math.round(
    interpolate(frame, [d, d + 55], [0, item.value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  const lineW = interpolate(frame, [d + 8, d + 45], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        width: 420,
        opacity: inS,
        transform: `translateY(${(1 - inS) * 36}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 150,
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
            fontSize: 76,
            color: colors.primaryLight,
          }}
        >
          {item.suffix}
        </span>
      </div>
      <div style={{ width: lineW, height: 3, background: colors.primaryDark, borderRadius: 2 }} />
      <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 36, color: colors.text }}>
        {item.label}
      </div>
      <div style={{ fontFamily: fonts.body, fontSize: 26, color: colors.faint }}>{item.sub}</div>
    </div>
  );
};

export const StatsScene: React.FC<{ c: Stats }> = ({ c }) => {
  const p = useSceneProgress();
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 130 }}>
        <SceneHeader kicker={c.kicker} title={c.title} delay={6} />
      </div>
      <div
        style={{
          marginTop: 110,
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 0,
        }}
      >
        {c.items.map((it, i) => (
          <React.Fragment key={i}>
            {i > 0 ? (
              <div style={{ width: 1, background: colors.border, margin: "30px 50px" }} />
            ) : null}
            <StatColumn item={it} index={i} />
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
