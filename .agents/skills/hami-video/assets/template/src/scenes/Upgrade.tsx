import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../content";
import { colors, fonts, springConfigs } from "../theme";
import { SceneHeader, useSceneProgress } from "../components/Shared";

type Upgrade = VideoContent["upgrade"];

const Terminal: React.FC<{ title: string; command: string }> = ({ title, command }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 18 });
  const chars = interpolate(frame, [34, 168], [0, command.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const n = Math.floor(chars);
  const cursorOn = frame % 28 < 14;
  const typed = command.slice(0, n);
  const lines = typed.split("\n");
  return (
    <div
      style={{
        width: 1080,
        borderRadius: 18,
        border: `1px solid ${colors.border}`,
        background: "#0d1420",
        boxShadow: "0 20px 54px rgba(0,0,0,0.5)",
        overflow: "hidden",
        opacity: inS,
        transform: `translateY(${(1 - inS) * 40}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "18px 24px",
          borderBottom: `1px solid ${colors.border}`,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: colors.danger, opacity: 0.85 }} />
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: colors.warning, opacity: 0.85 }} />
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: colors.primary, opacity: 0.85 }} />
        <span style={{ marginLeft: 16, fontFamily: fonts.mono, fontSize: 21, color: colors.faint }}>{title}</span>
      </div>
      <div style={{ padding: "34px 38px", fontFamily: fonts.mono, fontSize: 25, lineHeight: 1.9 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <span style={{ color: colors.primaryLight }}>$</span>
            <span style={{ color: colors.text, whiteSpace: "pre" }}>
              {line}
              {i === lines.length - 1 && cursorOn ? (
                <span
                  style={{
                    display: "inline-block",
                    width: 15,
                    height: 30,
                    marginLeft: 4,
                    background: colors.primaryLight,
                    verticalAlign: "text-bottom",
                  }}
                />
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UpgradeScene: React.FC<{ c: Upgrade }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSceneProgress();
  const notesIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 96 });
  const linksIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 130 });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 120 }}>
        <SceneHeader kicker={c.kicker} title={c.title} delay={6} />
      </div>

      <div style={{ position: "absolute", left: 110, top: 350 }}>
        <Terminal title={c.terminalTitle} command={c.command} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 120,
          top: 370,
          width: 560,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22, opacity: notesIn, transform: `translateY(${(1 - notesIn) * 18}px)` }}>
          {c.notes.map((note, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <svg width={30} height={30} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="11" fill="rgba(245,185,66,0.12)" />
                <path d="M12 6.5v7" stroke={colors.warning} strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="12" cy="17" r="1.6" fill={colors.warning} />
              </svg>
              <span style={{ fontFamily: fonts.body, fontSize: 27, color: colors.muted }}>{note}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-start",
            opacity: linksIn,
            transform: `translateY(${(1 - linksIn) * 18}px)`,
          }}
        >
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 28, color: colors.text }}>
            {c.linkLabel}
          </span>
          {c.links.map((link, i) => (
            <div
              key={i}
              style={{
                fontFamily: fonts.mono,
                fontSize: 22,
                lineHeight: 1.5,
                color: colors.secondary,
                border: `1px solid rgba(57,198,244,0.45)`,
                borderRadius: 12,
                background: "rgba(57,198,244,0.08)",
                padding: "13px 20px",
                width: 560,
                boxSizing: "border-box",
                wordBreak: "break-all",
              }}
            >
              {/* zero-width space after each "/" so URLs wrap at path separators */}
              {link.replace(/\//g, "/\u200B")}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
