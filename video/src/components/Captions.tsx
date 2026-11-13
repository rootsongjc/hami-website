import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { SceneKey } from "../content";
import { colors, fonts } from "../theme";
import CAPTIONS from "../captions.generated.json";

type CaptionEntry = { t: string; f0: number; f1: number };

/** Estimated rendered width in em units (CJK≈1.0, upper/digit≈0.62, lower≈0.52, space≈0.30). */
const estimateWidth = (text: string): number => {
  let w = 0;
  for (const ch of text) {
    if (ch === " ") w += 0.3;
    else if (/[\u3000-\u9fff\uff00-\uffef\u2014\u2026]/.test(ch)) w += 1.0;
    else if (/[A-Z0-9]/.test(ch)) w += 0.62;
    else w += 0.52;
  }
  return w;
};

/** Highlight latin/number tokens in zh captions with the brand green. */
const CaptionText: React.FC<{ text: string; locale: "zh" | "en" }> = ({ text, locale }) => {
  if (locale === "en") return <>{text}</>;
  const parts = text.split(/([A-Za-z0-9][A-Za-z0-9+.#-]*)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^[A-Za-z0-9]/.test(p) ? (
          <span key={i} style={{ color: colors.primary, fontFamily: fonts.body, fontWeight: 600 }}>
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
};

/**
 * Burned-in caption track for one scene. Must be rendered INSIDE the scene's
 * <Sequence> so useCurrentFrame() is scene-relative. `compact` = vertical form.
 *
 * Dedicated caption zones (keep scene content out of these bands):
 * - Landscape (B站): full-width bottom gradient band (height 150px, text at
 *   bottom:85 → text spans y≈949-995). Stays clear of the B站 web control bar
 *   (y≈1010+) and lets scene chrome sit above y≈940.
 * - Vertical (视频号): frosted-glass pill pinned at bottom:400 (pill occupies
 *   y≈1403-1520), inside the 视频号 safe area — above the bottom title/desc
 *   block (y≈1540+) and left of the right icon column (content ≤ x920).
 */
export const CaptionTrack: React.FC<{
  locale: "zh" | "en";
  scene: SceneKey;
  compact?: boolean;
}> = ({ locale, scene, compact = false }) => {
  const frame = useCurrentFrame();
  const entries = (CAPTIONS[locale as "zh" | "en"] as Record<string, CaptionEntry[]>)[scene] ?? [];
  const active = entries.find((e) => frame >= e.f0 && frame <= e.f1);
  if (!active) return null;

  const dur = active.f1 - active.f0;
  const opacity =
    dur < 8
      ? 1
      : interpolate(
          frame,
          [active.f0, active.f0 + 3, active.f1 - 3, active.f1],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
  if (opacity <= 0) return null;

  if (compact) {
    // Vertical (视频号): frosted pill in the reserved band above the bottom
    // title/description block. Content ≤ x920; pill maxWidth 856 keeps it
    // clear of the right icon column. Centered via left/right+margin (NOT
    // left:50% — that halves the available wrap width), and NEVER wraps:
    // over-wide entries are split into two captions at build time; the
    // font-scale is a defensive net.
    const fs = locale === "en" ? 29 : 33;
    const est = estimateWidth(active.t);
    const scale = Math.min(1, 780 / (est * fs));
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          margin: "0 auto",
          bottom: 400,
          opacity,
          width: "fit-content",
          maxWidth: 856,
          background: "rgba(11,15,20,0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 18,
          padding: "18px 30px",
          fontFamily: fonts.body,
          fontSize: Math.max(22, Math.floor(fs * scale)),
          fontWeight: 500,
          lineHeight: 1.4,
          color: "#f5f7fa",
          textAlign: "center",
          whiteSpace: "nowrap",
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
          pointerEvents: "none",
        }}
      >
        <CaptionText text={active.t} locale={locale} />
      </div>
    );
  }

  // Landscape (B站): dedicated bottom subtitle band with gradient scrim.
  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 150,
          background:
            "linear-gradient(to top, rgba(11,15,20,0.92) 0%, rgba(11,15,20,0.78) 55%, rgba(11,15,20,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 85,
          transform: `translateX(-50%) translateY(${(1 - opacity) * 8}px)`,
          maxWidth: 1660,
          fontFamily: fonts.body,
          fontSize: 34,
          fontWeight: 500,
          lineHeight: 1.35,
          color: "#f5f7fa",
          textAlign: "center",
          whiteSpace: "nowrap",
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        <CaptionText text={active.t} locale={locale} />
      </div>
    </div>
  );
};
