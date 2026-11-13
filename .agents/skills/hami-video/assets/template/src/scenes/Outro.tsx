import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../content";
import { colors, fonts, springConfigs } from "../theme";

type Outro = VideoContent["outro"];

const StarIcon: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 2.5l2.95 6.03 6.63.94-4.8 4.66 1.14 6.6L12 17.6l-5.92 3.13 1.14-6.6-4.8-4.66 6.63-.94z"
      fill="#e3b341"
      stroke="#f5d271"
      strokeWidth="0.6"
    />
  </svg>
);

const GlobeIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" stroke={colors.secondary} strokeWidth="1.6" />
    <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke={colors.secondary} strokeWidth="1.2" />
    <path d="M3 12h18M4.6 6.5h14.8M4.6 17.5h14.8" fill="none" stroke={colors.secondary} strokeWidth="1.2" />
  </svg>
);

/** CTA block: Star card (+ WeChat QR card for zh / website card for en). */
const CtaRow: React.FC<{ c: Outro; opacity: number }> = ({ c, opacity }) => {
  const starCard = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: "rgba(16,208,93,0.10)",
        border: `1.5px solid rgba(16,208,93,0.55)`,
        borderRadius: 20,
        padding: "30px 46px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <StarIcon size={38} />
        <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 38, color: colors.text }}>
          {c.starButton}
        </span>
      </div>
      <span style={{ fontFamily: fonts.body, fontSize: 24, color: colors.muted }}>{c.starSub}</span>
    </div>
  );

  const qrCard = c.qrImage ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        background: "rgba(23,30,39,0.9)",
        border: `1.5px solid ${colors.border}`,
        borderRadius: 20,
        padding: "24px 40px",
      }}
    >
      <div style={{ background: "#fff", padding: 10, borderRadius: 14 }}>
        <Img src={staticFile(c.qrImage)} style={{ height: 170, width: 170, borderRadius: 4 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 32, color: colors.text }}>
          {c.qrTitle}
        </span>
        <span style={{ fontFamily: fonts.body, fontSize: 26, color: colors.primary }}>{c.qrSub}</span>
      </div>
    </div>
  ) : null;

  const webCard = c.webButton ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        background: "rgba(57,198,244,0.10)",
        border: `1.5px solid rgba(57,198,244,0.55)`,
        borderRadius: 20,
        padding: "30px 54px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <GlobeIcon size={36} />
        <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 42, color: colors.secondary }}>
          {c.webButton}
        </span>
      </div>
      <span style={{ fontFamily: fonts.body, fontSize: 24, color: colors.muted }}>{c.webSub}</span>
    </div>
  ) : null;

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 36, opacity }}>
      {starCard}
      {qrCard ?? webCard}
    </div>
  );
};

export const OutroScene: React.FC<{ c: Outro }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const logo = spring({ frame, fps, config: springConfigs.bouncy, durationInFrames: 24 });
  const tag = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: 14 });
  const line2 = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: 22 });
  const cta = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: 34 });
  const links = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 48 });
  const thanks = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 60 });
  const cncf = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 70 });
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit }}>
      <div
        style={{
          transform: `scale(${logo})`,
          filter: "drop-shadow(0 0 60px rgba(16,208,93,0.30))",
        }}
      >
        <Img src={staticFile("img/hami-horizontal-color-white.svg")} style={{ height: 104 }} />
      </div>

      <div
        style={{
          marginTop: 36,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 38,
          color: colors.text,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 24}px)`,
        }}
      >
        {c.tagline}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: fonts.body,
          fontSize: 26,
          color: colors.muted,
          opacity: line2,
          transform: `translateY(${(1 - line2) * 20}px)`,
        }}
      >
        {c.line2}
      </div>

      <div style={{ marginTop: 20, opacity: cta, transform: `translateY(${(1 - cta) * 26}px)` }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 30,
            color: colors.primary,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          {c.ctaHeadline}
        </div>
        <CtaRow c={c} opacity={1} />
      </div>

      <div
        style={{
          marginTop: 26,
          display: "flex",
          gap: 22,
          opacity: links,
        }}
      >
        {c.links.map((link, i) => (
          <span
            key={i}
            style={{
              fontFamily: fonts.mono,
              fontSize: 24,
              color: colors.secondary,
              border: `1px solid rgba(57,198,244,0.45)`,
              borderRadius: 999,
              padding: "10px 26px",
              background: "rgba(57,198,244,0.08)",
            }}
          >
            {link}
          </span>
        ))}
      </div>

      {/* Combined footer row (in-flow, not pinned to the bottom edge): stays
          clear of the B站 control bar and the caption band below y≈940. */}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: thanks,
        }}
      >
        <span style={{ fontFamily: fonts.body, fontSize: 25, color: colors.faint }}>{c.thanks}</span>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: colors.faint, opacity: 0.6 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: cncf * 0.9 }}>
          <Img src={staticFile("img/cncf-white.svg")} style={{ height: 40 }} />
          <span style={{ fontFamily: fonts.body, fontSize: 22, color: colors.faint }}>{c.cncf}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
