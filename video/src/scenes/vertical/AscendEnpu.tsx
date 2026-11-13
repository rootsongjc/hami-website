import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";
import { Bullets, SceneHeader, useSceneProgress } from "../../components/Shared";

// Vertical (1080x1920) Ascend ENPU: three smaller policy cards in a row, then die note, then bullets.
export const AscendSceneV: React.FC<{ c: VideoContent["ascend"] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSceneProgress();
  const activeIdx = Math.max(0, Math.floor((frame - 52) / 58)) % c.policies.length;
  const noteIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 80 });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 190 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} width={856} compact />
      </div>

      <div style={{ position: "absolute", left: 64, top: 640, display: "flex", gap: 16 }}>
        {c.policies.map((pol, i) => (
          <PolicyCardV key={i} name={pol.name} desc={pol.desc} index={i} active={frame > 52 && i === activeIdx} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          top: 920,
          opacity: noteIn,
          transform: `translateY(${(1 - noteIn) * 16}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: `1px solid ${colors.border}`,
            borderRadius: 999,
            padding: "12px 24px",
            background: colors.surface,
            maxWidth: 856,
          }}
        >
          <svg width={24} height={24} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke={colors.warning} strokeWidth="1.8" />
            <path d="M8 10V7a4 4 0 018 0v3" fill="none" stroke={colors.warning} strokeWidth="1.8" />
          </svg>
          <span style={{ fontFamily: fonts.body, fontSize: 23, color: colors.muted }}>{c.dieNote}</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 64, bottom: 510 }}>
        <Bullets items={c.bullets} delay={92} width={856} compact />
      </div>
    </AbsoluteFill>
  );
};

const PolicyCardV: React.FC<{ name: string; desc: string; index: number; active: boolean }> = ({
  name,
  desc,
  index,
  active,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 18, delay: 26 + index * 12 });
  const borderColor = active ? colors.primaryLight : colors.border;
  return (
    <div
      style={{
        width: 272,
        height: 226,
        borderRadius: 18,
        border: `1.5px solid ${borderColor}`,
        background: `linear-gradient(180deg, rgba(23,30,39,0.95), rgba(15,20,27,0.95)), rgba(16,208,93,${active ? 0.14 : 0.04})`,
        boxShadow: active ? `0 0 40px rgba(16,208,93,0.20)` : "0 14px 36px rgba(0,0,0,0.38)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity: inS,
        transform: `translateY(${(1 - inS) * 40}px) scale(${(active ? 1.045 : 1) * (0.94 + inS * 0.06)})`,
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontWeight: 600,
          fontSize: 26,
          color: active ? colors.primaryLight : colors.secondary,
        }}
      >
        {name}
      </span>
      <span style={{ fontFamily: fonts.body, fontSize: 23, color: active ? colors.text : colors.muted }}>
        {desc}
      </span>
    </div>
  );
};
