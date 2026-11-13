import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../content";
import { colors, fonts, springConfigs } from "../theme";
import { Bullets, SceneHeader, useSceneProgress } from "../components/Shared";

type Ascend = VideoContent["ascend"];

const PolicyCard: React.FC<{
  name: string;
  desc: string;
  index: number;
  active: boolean;
  appear: number;
}> = ({ name, desc, index, active, appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 18, delay: 22 + index * 12 });
  const glow = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 12 });
  const borderColor = active ? colors.primaryLight : colors.border;
  const glowAmt = active ? interpolate(glow, [0, 1], [0.06, 0.22]) : 0.04;
  return (
    <div
      style={{
        width: 400,
        height: 230,
        borderRadius: 20,
        border: `1.5px solid ${borderColor}`,
        background: `linear-gradient(180deg, rgba(23,30,39,0.95), rgba(15,20,27,0.95)), rgba(16,208,93,${glowAmt})`,
        boxShadow: active ? `0 0 44px rgba(16,208,93,0.20)` : "0 14px 36px rgba(0,0,0,0.38)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        opacity: inS * appear,
        transform: `translateY(${(1 - inS) * 40}px) scale(${(active ? 1.045 : 1) * (0.94 + inS * 0.06)})`,
      }}
    >
      <span style={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: 34, color: active ? colors.primaryLight : colors.secondary }}>
        {name}
      </span>
      <span style={{ fontFamily: fonts.body, fontSize: 27, color: active ? colors.text : colors.muted }}>{desc}</span>
    </div>
  );
};

export const AscendScene: React.FC<{ c: Ascend }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSceneProgress();
  const activeIdx = Math.max(0, Math.floor((frame - 46) / 58)) % c.policies.length;
  const noteIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 70 });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 120 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} />
      </div>

      <div
        style={{
          marginTop: 84,
          display: "flex",
          justifyContent: "center",
          gap: 44,
        }}
      >
        {c.policies.map((pol, i) => (
          <PolicyCard key={i} name={pol.name} desc={pol.desc} index={i} active={frame > 46 && i === activeIdx} appear={1} />
        ))}
      </div>

      <div
        style={{
          marginTop: 36,
          display: "flex",
          justifyContent: "center",
          opacity: noteIn,
          transform: `translateY(${(1 - noteIn) * 16}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            border: `1px solid ${colors.border}`,
            borderRadius: 999,
            padding: "14px 30px",
            background: colors.surface,
          }}
        >
          <svg width={26} height={26} viewBox="0 0 24 24">
            <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke={colors.warning} strokeWidth="1.8" />
            <path d="M8 10V7a4 4 0 018 0v3" fill="none" stroke={colors.warning} strokeWidth="1.8" />
          </svg>
          <span style={{ fontFamily: fonts.body, fontSize: 27, color: colors.muted }}>{c.dieNote}</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 110, bottom: 155 }}>
        <Bullets items={c.bullets} delay={84} />
      </div>
    </AbsoluteFill>
  );
};
