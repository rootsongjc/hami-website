import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";
import { Bullets, Card, Chip, SceneHeader, useSceneProgress } from "../../components/Shared";

// Vertical (1080x1920) Remote GPU: client card on top, wire flowing down, server card below.
export const RemoteGpuSceneV: React.FC<{ c: VideoContent["remoteGpu"] }> = ({ c }) => {
  const p = useSceneProgress();
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 190 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} width={856} compact />
      </div>

      <ClientCard c={c} />
      <Wire label={c.wireLabel} />
      <ServerCard c={c} />

      <div style={{ position: "absolute", left: 64, bottom: 490 }}>
        <Bullets items={c.bullets} delay={70} width={856} compact />
      </div>
    </AbsoluteFill>
  );
};

const ClientCard: React.FC<{ c: VideoContent["remoteGpu"] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 22 });
  return (
    <div style={{ position: "absolute", left: 64, top: 460, opacity: s, transform: `translateY(${(1 - s) * -50}px)` }}>
      <Card width={856} height={290}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 34, color: colors.text }}>
            {c.clientNode.title}
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 19, color: colors.faint }}>node / client</span>
        </div>
        <div style={{ marginTop: 6, fontFamily: fonts.mono, fontSize: 22, color: colors.secondary }}>
          {c.clientNode.sub}
        </div>
        <div
          style={{
            marginTop: 20,
            border: `1px solid ${colors.primaryDark}`,
            background: "rgba(16,208,93,0.10)",
            borderRadius: 14,
            padding: "16px 20px",
            fontFamily: fonts.mono,
            fontSize: 24,
            color: colors.primaryLight,
            textAlign: "center",
          }}
        >
          {c.clientNode.pod}
        </div>
        <div style={{ marginTop: 14, fontFamily: fonts.body, fontSize: 20, color: colors.faint, lineHeight: 1.5 }}>
          {c.clientNode.inject}
        </div>
      </Card>
    </div>
  );
};

const Wire: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 24, delay: 34 });
  const labelIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 14, delay: 48 });
  const dash = (frame * 1.6) % 36;
  const x = 540;
  const y0 = 750;
  const y1 = 865;
  return (
    <>
      <svg width={1080} height={115} style={{ position: "absolute", left: 0, top: y0 }}>
        <line
          x1={x}
          y1={0}
          x2={x}
          y2={(y1 - y0) * draw}
          stroke={colors.primaryDark}
          strokeWidth={3}
          strokeDasharray="14 22"
          strokeDashoffset={-dash}
        />
        {[0, 1].map((i) => {
          const period = 78;
          const t = (((frame - 60 - i * 39) % period) + period) % period / period;
          const y = interpolate(t, [0, 1], [8, y1 - y0 - 8]);
          const o = interpolate(t, [0, 0.12, 0.88, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <circle key={i} cx={x} cy={y} r={7} fill={colors.primaryLight} opacity={frame > 60 ? o : 0} />;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 570,
          top: y0 + 64,
          opacity: labelIn,
        }}
      >
        <Chip tone="accent" size={19}>
          {label}
        </Chip>
      </div>
    </>
  );
};

const ServerCard: React.FC<{ c: VideoContent["remoteGpu"] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 30 });
  return (
    <div style={{ position: "absolute", left: 64, top: 865, opacity: s, transform: `translateY(${(1 - s) * 50}px)` }}>
      <Card width={856} height={300} accent={colors.primary}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 34, color: colors.text }}>
            {c.serverNode.title}
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 19, color: colors.faint }}>node / server</span>
        </div>
        <div style={{ marginTop: 6, fontFamily: fonts.mono, fontSize: 22, color: colors.muted }}>
          {c.serverNode.sub}
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 18 }}>
          {[64, 76].map((d, i) => {
            const g = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 14, delay: d });
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 68,
                  borderRadius: 12,
                  border: `1px solid rgba(16,208,93,0.55)`,
                  background: "rgba(16,208,93,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  opacity: g,
                  transform: `scale(${0.85 + g * 0.15})`,
                }}
              >
                <svg width={26} height={26} viewBox="0 0 24 24">
                  <path
                    d="M2 7h20v10H2zM6 3h12v4H6zM6 17h12v4H6z"
                    fill="none"
                    stroke={colors.primaryLight}
                    strokeWidth="1.7"
                  />
                </svg>
                <span style={{ fontFamily: fonts.mono, fontSize: 22, color: colors.primaryLight }}>
                  {c.serverNode.gpuLabel}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20 }}>
          <Chip tone="info" size={18}>
            {c.serverNode.label}
          </Chip>
        </div>
      </Card>
    </div>
  );
};
