import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";

// Vertical (1080x1920) intro.
export const IntroSceneV: React.FC<{ c: VideoContent["intro"]; meta: VideoContent["meta"] }> = ({
  c,
  meta,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logo = spring({ frame, fps, config: springConfigs.bouncy, durationInFrames: 26 });
  const title = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: 14 });
  const released = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 16, delay: 24 });
  const rule = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 14, delay: 34 });
  const metaIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 44 });
  const kicker = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 14, delay: 4 });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit }}>
      <div style={{ position: "absolute", top: 220, opacity: kicker }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 22, letterSpacing: 10, color: colors.faint }}>
          — {c.kicker} —
        </span>
      </div>

      <div style={{ position: "relative", width: 260, height: 260, marginBottom: 40 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${colors.primary}`,
            opacity: interpolate((frame % 96) / 96, [0, 0.15, 1], [0, 0.5, 0]),
            transform: `scale(${interpolate((frame % 96) / 96, [0, 1], [0.55, 1.75])})`,
          }}
        />
        <Img
          src={staticFile("img/hami-graph-color.svg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: `scale(${logo})`,
            filter: "drop-shadow(0 0 44px rgba(16,208,93,0.35))",
          }}
        />
      </div>

      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 74,
          color: colors.text,
          lineHeight: 1,
          opacity: title,
          transform: `translateY(${(1 - title) * 30}px)`,
        }}
      >
        HAMi{" "}
        <span
          style={{
            background: `linear-gradient(90deg, ${colors.primaryLight}, ${colors.primary})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {meta.version}
        </span>
      </div>

      <div
        style={{
          marginTop: 22,
          fontFamily: fonts.body,
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: 18,
          textIndent: 18,
          color: colors.text,
          opacity: released,
          transform: `translateY(${(1 - released) * 24}px) scale(${0.94 + released * 0.06})`,
        }}
      >
        {c.released}
      </div>

      <div
        style={{
          marginTop: 36,
          width: 80,
          height: 4,
          borderRadius: 2,
          background: colors.primary,
          transform: `scaleX(${rule})`,
        }}
      />

      <div
        style={{
          marginTop: 34,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: metaIn,
          transform: `translateY(${(1 - metaIn) * 18}px)`,
        }}
      >
        <span style={{ fontFamily: fonts.body, fontSize: 28, color: colors.muted }}>{c.tagline}</span>
        <span style={{ fontFamily: fonts.mono, fontSize: 21, color: colors.faint }}>
          {c.date} · {meta.cncf}
        </span>
      </div>
    </AbsoluteFill>
  );
};
