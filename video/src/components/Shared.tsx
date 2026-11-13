import React from "react";
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, springConfigs } from "../theme";

/** Scene-level enter/exit progress (0→1 enter, 1→0 at the tail). */
export const useSceneProgress = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16 });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  return enter * exit;
};

/** Global backdrop: grid + brand glows + vignette. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = interpolate(
    Math.sin((frame / 120) * Math.PI * 2),
    [-1, 1],
    [0.07, 0.12]
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(57,198,244,0.05) 1px, transparent 1px),
             linear-gradient(90deg, rgba(57,198,244,0.05) 1px, transparent 1px)`,
          backgroundSize: "96px 96px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -360,
          left: -280,
          width: 1200,
          height: 1200,
          background: `radial-gradient(circle, rgba(16,208,93,${breathe}) 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -420,
          right: -320,
          width: 1400,
          height: 1400,
          background: `radial-gradient(circle, rgba(124,140,255,0.07) 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 52%, rgba(5,8,12,0.55) 100%)",
        }}
      />
    </div>
  );
};

/** Top-left watermark (logo lockup + version), shown between intro and outro. */
export const Watermark: React.FC<{ version: string; compact?: boolean }> = ({ version, compact = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const p = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18 });
  const out = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const o = p * out * 0.72;
  return (
    <div
      style={{
        position: "absolute",
        top: compact ? 44 : 62,
        left: compact ? 48 : 110,
        display: "flex",
        alignItems: "center",
        gap: compact ? 12 : 16,
        opacity: o,
        transform: `translateY(${(1 - p) * -12}px)`,
      }}
    >
      <Img
        src={staticFile("img/hami-horizontal-color-white.svg")}
        style={{ height: compact ? 30 : 40 }}
      />
      <span style={{ fontFamily: fonts.mono, fontSize: compact ? 18 : 22, color: colors.faint }}>
        {version}
      </span>
    </div>
  );
};

/** Bottom progress bar for the whole video. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = (frame / (durationInFrames - 1)) * 100;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "100%",
          width: `${w}%`,
          background: `linear-gradient(90deg, ${colors.primaryDark}, ${colors.primary} 60%, ${colors.secondary})`,
        }}
      />
    </div>
  );
};

/** Standard feature-scene header: kicker rule + big title + subtitle. */
export const SceneHeader: React.FC<{
  kicker: string;
  title: string;
  subtitle?: string;
  delay?: number;
  width?: number;
  compact?: boolean;
}> = ({ kicker, title, subtitle, delay = 6, width = 1400, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 14, delay });
  const t = spring({
    frame,
    fps,
    config: springConfigs.smooth,
    durationInFrames: 16,
    delay: delay + 5,
  });
  const s = spring({
    frame,
    fps,
    config: springConfigs.smooth,
    durationInFrames: 16,
    delay: delay + 11,
  });
  const s2 = compact
    ? { ruleW: 32, kickerSize: 21, letterSpacing: 4, titleSize: 54, titleGap: 16, subSize: 26, margin: 64 }
    : { ruleW: 44, kickerSize: 26, letterSpacing: 5, titleSize: 72, titleGap: 22, subSize: 32, margin: 110 };
  return (
    <div style={{ width, marginLeft: s2.margin }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: k,
          transform: `translateX(${(1 - k) * -28}px)`,
        }}
      >
        <div style={{ width: s2.ruleW, height: 4, background: colors.primary, borderRadius: 2 }} />
        <span
          style={{
            fontFamily: fonts.mono,
            fontWeight: 600,
            fontSize: s2.kickerSize,
            letterSpacing: s2.letterSpacing,
            color: colors.secondary,
          }}
        >
          {kicker}
        </span>
      </div>
      <div
        style={{
          marginTop: s2.titleGap,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: s2.titleSize,
          lineHeight: 1.18,
          color: colors.text,
          opacity: t,
          transform: `translateY(${(1 - t) * 26}px)`,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: compact ? 12 : 14,
            fontFamily: fonts.body,
            fontSize: s2.subSize,
            color: colors.muted,
            opacity: s,
            transform: `translateY(${(1 - s) * 20}px)`,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};

/** Staggered bullet list with green check markers. */
export const Bullets: React.FC<{
  items: string[];
  delay?: number;
  gap?: number;
  width?: number;
  compact?: boolean;
}> = ({ items, delay = 40, gap = 9, width = 1500, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const size = compact ? { text: 26, row: 20, icon: 32 } : { text: 31, row: 24, icon: 38 };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size.row, width }}>
      {items.map((text, i) => {
        const p = spring({
          frame,
          fps,
          config: springConfigs.smooth,
          durationInFrames: 15,
          delay: delay + i * gap,
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: compact ? 16 : 20,
              opacity: p,
              transform: `translateX(${(1 - p) * -26}px)`,
            }}
          >
            <svg width={size.icon} height={size.icon} viewBox="0 0 38 38" style={{ flexShrink: 0 }}>
              <circle cx="19" cy="19" r="18" fill="rgba(16,208,93,0.14)" stroke={colors.primaryDark} />
              <path
                d="M11 19.5l5.2 5.2L27 13.6"
                fill="none"
                stroke={colors.primaryLight}
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontFamily: fonts.body, fontSize: size.text, color: colors.text, lineHeight: 1.45 }}>
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** Small pill chip. */
export const Chip: React.FC<{
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "info";
  size?: number;
}> = ({ children, tone = "neutral", size = 24 }) => {
  const styles =
    tone === "accent"
      ? { border: `1px solid ${colors.primaryDark}`, background: "rgba(16,208,93,0.12)", color: colors.primaryLight }
      : tone === "info"
        ? { border: `1px solid rgba(57,198,244,0.5)`, background: "rgba(57,198,244,0.10)", color: colors.secondary }
        : { border: `1px solid ${colors.border}`, background: colors.surface, color: colors.muted };
  return (
    <span
      style={{
        ...styles,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 999,
        padding: `${size * 0.42}px ${size * 0.95}px`,
        fontFamily: fonts.mono,
        fontSize: size,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

/** Card container used by node/device visuals. */
export const Card: React.FC<{
  children: React.ReactNode;
  width: number;
  height: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, width, height, accent, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 22,
      border: `1px solid ${colors.border}`,
      background: `linear-gradient(180deg, rgba(23,30,39,0.92), rgba(15,20,27,0.94))`,
      boxShadow: "0 18px 48px rgba(0,0,0,0.42)",
      padding: 30,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    {accent ? (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
    ) : null}
    {children}
  </div>
);
