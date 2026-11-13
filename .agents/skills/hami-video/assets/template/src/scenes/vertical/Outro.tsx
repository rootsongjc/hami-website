import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";

// Vertical (1080x1920) outro with CTA: zh = Star + WeChat QR, en = Star + website.
const StarIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 2.5l2.95 6.03 6.63.94-4.8 4.66 1.14 6.6L12 17.6l-5.92 3.13 1.14-6.6-4.8-4.66 6.63-.94z"
      fill="#e3b341"
      stroke="#f5d271"
      strokeWidth="0.6"
    />
  </svg>
);

const GlobeIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" stroke={colors.secondary} strokeWidth="1.6" />
    <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke={colors.secondary} strokeWidth="1.2" />
    <path d="M3 12h18M4.6 6.5h14.8M4.6 17.5h14.8" fill="none" stroke={colors.secondary} strokeWidth="1.2" />
  </svg>
);

export const OutroSceneV: React.FC<{ c: VideoContent["outro"] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const logo = spring({ frame, fps, config: springConfigs.bouncy, durationInFrames: 24 });
  const tag = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: 14 });
  const line2 = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: 22 });
  const cta = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 18, delay: 34 });
  const links = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 50 });
  const footer = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 64 });
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const starCard = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(16,208,93,0.10)",
        border: `1.5px solid rgba(16,208,93,0.55)`,
        borderRadius: 18,
        padding: "24px 38px",
      }}
    >
      <StarIcon size={36} />
      <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 36, color: colors.text }}>
        {c.starButton}
      </span>
    </div>
  );

  const qrCard = c.qrImage ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        background: "rgba(23,30,39,0.9)",
        border: `1.5px solid ${colors.border}`,
        borderRadius: 18,
        padding: "26px 40px",
      }}
    >
      <div style={{ background: "#fff", padding: 10, borderRadius: 14 }}>
        <Img src={staticFile(c.qrImage)} style={{ height: 250, width: 250, borderRadius: 4 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 34, color: colors.text }}>
          {c.qrTitle}
        </span>
        <span style={{ fontFamily: fonts.body, fontSize: 28, color: colors.primary }}>{c.qrSub}</span>
      </div>
    </div>
  ) : null;

  const webCard = c.webButton ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(57,198,244,0.10)",
        border: `1.5px solid rgba(57,198,244,0.55)`,
        borderRadius: 18,
        padding: "24px 44px",
      }}
    >
      <GlobeIcon size={34} />
      <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: colors.secondary }}>
        {c.webButton}
      </span>
    </div>
  ) : null;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", opacity: exit }}>
      <div style={{ paddingTop: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${logo})`, filter: "drop-shadow(0 0 60px rgba(16,208,93,0.30))" }}>
          <Img src={staticFile("img/hami-horizontal-color-white.svg")} style={{ height: 100 }} />
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 36,
            color: colors.text,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 24}px)`,
          }}
        >
          {c.tagline}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: fonts.body,
            fontSize: 25,
            color: colors.muted,
            opacity: line2,
            transform: `translateY(${(1 - line2) * 20}px)`,
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 820,
          }}
        >
          {c.line2}
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            opacity: cta,
            transform: `translateY(${(1 - cta) * 26}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: 34,
              color: colors.primary,
              textAlign: "center",
            }}
          >
            {c.ctaHeadline}
          </div>
          {starCard}
          {qrCard ?? webCard}
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 20,
            opacity: links,
          }}
        >
          {c.links.map((link, i) => (
            <span
              key={i}
              style={{
                fontFamily: fonts.mono,
                fontSize: 22,
                color: colors.secondary,
                border: `1px solid rgba(57,198,244,0.45)`,
                borderRadius: 999,
                padding: "10px 24px",
                background: "rgba(57,198,244,0.08)",
              }}
            >
              {link}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 46,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            opacity: footer * 0.95,
          }}
        >
          <span style={{ fontFamily: fonts.body, fontSize: 24, color: colors.faint }}>{c.thanks}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Img src={staticFile("img/cncf-white.svg")} style={{ height: 38 }} />
            <span style={{ fontFamily: fonts.body, fontSize: 20, color: colors.faint }}>{c.cncf}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
