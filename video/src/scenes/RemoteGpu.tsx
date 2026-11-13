import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../content";
import { colors, fonts, springConfigs } from "../theme";
import { Bullets, Card, Chip, SceneHeader, useSceneProgress } from "../components/Shared";

type RemoteGpu = VideoContent["remoteGpu"];

const WIRE_X0 = 640;
const WIRE_X1 = 1280;
const WIRE_Y = 560;

const ClientNode: React.FC<{ c: RemoteGpu }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 18 });
  return (
    <div style={{ position: "absolute", left: 150, top: 380, opacity: s, transform: `translateX(${(1 - s) * -90}px)` }}>
      <Card width={460} height={360}>
        <div style={{ fontFamily: fonts.mono, fontSize: 20, color: colors.faint }}>node / client</div>
        <div style={{ marginTop: 10, fontFamily: fonts.body, fontWeight: 700, fontSize: 36, color: colors.text }}>
          {c.clientNode.title}
        </div>
        <div style={{ marginTop: 6, fontFamily: fonts.mono, fontSize: 23, color: colors.secondary }}>
          {c.clientNode.sub}
        </div>
        <div
          style={{
            marginTop: 26,
            border: `1px solid ${colors.primaryDark}`,
            background: "rgba(16,208,93,0.10)",
            borderRadius: 14,
            padding: "18px 22px",
            fontFamily: fonts.mono,
            fontSize: 26,
            color: colors.primaryLight,
            textAlign: "center",
          }}
        >
          {c.clientNode.pod}
        </div>
        <div style={{ marginTop: 18, fontFamily: fonts.body, fontSize: 22, color: colors.faint, lineHeight: 1.5 }}>
          {c.clientNode.inject}
        </div>
      </Card>
    </div>
  );
};

const ServerNode: React.FC<{ c: RemoteGpu }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 26 });
  const gpu = (delay: number) =>
    spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 14, delay });
  return (
    <div style={{ position: "absolute", left: 1310, top: 380, opacity: s, transform: `translateX(${(1 - s) * 90}px)` }}>
      <Card width={460} height={360} accent={colors.primary}>
        <div style={{ fontFamily: fonts.mono, fontSize: 20, color: colors.faint }}>node / server</div>
        <div style={{ marginTop: 10, fontFamily: fonts.body, fontWeight: 700, fontSize: 36, color: colors.text }}>
          {c.serverNode.title}
        </div>
        <div style={{ marginTop: 6, fontFamily: fonts.mono, fontSize: 23, color: colors.muted }}>
          {c.serverNode.sub}
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 18 }}>
          {[54, 66].map((d, i) => {
            const g = gpu(d);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 74,
                  borderRadius: 12,
                  border: `1px solid rgba(16,208,93,0.55)`,
                  background: "rgba(16,208,93,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  opacity: g,
                  transform: `scale(${0.85 + g * 0.15})`,
                  boxShadow: "0 0 26px rgba(16,208,93,0.18) inset",
                }}
              >
                <svg width={30} height={30} viewBox="0 0 24 24">
                  <path
                    d="M2 7h20v10H2zM6 3h12v4H6zM6 17h12v4H6z"
                    fill="none"
                    stroke={colors.primaryLight}
                    strokeWidth="1.7"
                  />
                </svg>
                <span style={{ fontFamily: fonts.mono, fontSize: 24, color: colors.primaryLight }}>
                  {c.serverNode.gpuLabel}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20 }}>
          <Chip tone="info" size={19}>
            {c.serverNode.label}
          </Chip>
        </div>
      </Card>
    </div>
  );
};

const Wire: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 24, delay: 30 });
  const labelIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 14, delay: 44 });
  const dash = (frame * 1.6) % 36;
  return (
    <>
      <svg width={1920} height={400} style={{ position: "absolute", left: 0, top: WIRE_Y - 200 }}>
        <line
          x1={WIRE_X0}
          y1={200}
          x2={WIRE_X0 + (WIRE_X1 - WIRE_X0) * draw}
          y2={200}
          stroke={colors.primaryDark}
          strokeWidth={3}
          strokeDasharray="14 22"
          strokeDashoffset={-dash}
        />
        {[0, 1, 2].map((i) => {
          const period = 78;
          const t = (((frame - 56 - i * 26) % period) + period) % period / period;
          const x = interpolate(t, [0, 1], [WIRE_X0 + 14, WIRE_X1 - 14]);
          const o = interpolate(t, [0, 0.12, 0.88, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <circle key={i} cx={x} cy={200} r={7} fill={colors.primaryLight} opacity={frame > 56 ? o : 0} />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: (WIRE_X0 + WIRE_X1) / 2 - 190,
          top: WIRE_Y + 34,
          width: 380,
          textAlign: "center",
          opacity: labelIn,
        }}
      >
        <Chip tone="accent" size={22}>
          {label}
        </Chip>
      </div>
    </>
  );
};

export const RemoteGpuScene: React.FC<{ c: RemoteGpu }> = ({ c }) => {
  const p = useSceneProgress();
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 120 }}>
        <SceneHeader kicker={c.kicker} title={c.title} subtitle={c.subtitle} delay={6} width={1240} />
      </div>
      <ClientNode c={c} />
      <Wire label={c.wireLabel} />
      <ServerNode c={c} />
      <div style={{ position: "absolute", left: 110, bottom: 163 }}>
        <Bullets items={c.bullets} delay={58} />
      </div>
    </AbsoluteFill>
  );
};
