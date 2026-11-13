import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoContent } from "../../content";
import { colors, fonts, springConfigs } from "../../theme";
import { SceneHeader, useSceneProgress } from "../../components/Shared";

// Vertical (1080x1920) upgrade: terminal on top, notes and links below.
export const UpgradeSceneV: React.FC<{ c: VideoContent["upgrade"] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSceneProgress();
  const notesIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 110 });
  const linksIn = spring({ frame, fps, config: springConfigs.smooth, durationInFrames: 16, delay: 150 });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ marginTop: 190 }}>
        <SceneHeader kicker={c.kicker} title={c.title} delay={6} width={856} compact />
      </div>

      <TerminalV title={c.terminalTitle} command={c.command} />

      <div style={{ position: "absolute", left: 64, top: 980, display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 20, opacity: notesIn, transform: `translateY(${(1 - notesIn) * 18}px)` }}
        >
          {c.notes.map((note, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <svg width={28} height={28} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="11" fill="rgba(245,185,66,0.12)" />
                <path d="M12 6.5v7" stroke={colors.warning} strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="12" cy="17" r="1.6" fill={colors.warning} />
              </svg>
              <span style={{ fontFamily: fonts.body, fontSize: 24, color: colors.muted }}>{note}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "flex-start",
            opacity: linksIn,
            transform: `translateY(${(1 - linksIn) * 18}px)`,
          }}
        >
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 26, color: colors.text }}>
            {c.linkLabel}
          </span>
          {c.links.map((link, i) => (
            <div
              key={i}
              style={{
                fontFamily: fonts.mono,
                fontSize: 21,
                lineHeight: 1.5,
                color: colors.secondary,
                border: `1px solid rgba(57,198,244,0.45)`,
                borderRadius: 12,
                background: "rgba(57,198,244,0.08)",
                padding: "12px 18px",
                width: 700,
                boxSizing: "border-box",
                wordBreak: "break-all",
              }}
            >
              {link.replace(/\//g, "/\u200B")}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TerminalV: React.FC<{ title: string; command: string }> = ({ title, command }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({ frame, fps, config: springConfigs.snappy, durationInFrames: 20, delay: 22 });
  const chars = interpolate(frame, [38, 185], [0, command.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const n = Math.floor(chars);
  const cursorOn = frame % 28 < 14;
  const lines = command.slice(0, n).split("\n");
  return (
    <div style={{ position: "absolute", left: 64, top: 540 }}>
      <div
        style={{
          width: 856,
          borderRadius: 16,
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
            gap: 9,
            padding: "15px 20px",
            borderBottom: `1px solid ${colors.border}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ width: 13, height: 13, borderRadius: "50%", background: colors.danger, opacity: 0.85 }} />
          <span style={{ width: 13, height: 13, borderRadius: "50%", background: colors.warning, opacity: 0.85 }} />
          <span style={{ width: 13, height: 13, borderRadius: "50%", background: colors.primary, opacity: 0.85 }} />
          <span style={{ marginLeft: 14, fontFamily: fonts.mono, fontSize: 18, color: colors.faint }}>{title}</span>
        </div>
        <div style={{ padding: "26px 28px", fontFamily: fonts.mono, fontSize: 19.5, lineHeight: 1.9 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <span style={{ color: colors.primaryLight }}>$</span>
              <span style={{ color: colors.text, whiteSpace: "pre" }}>
                {line}
                {i === lines.length - 1 && cursorOn ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 11,
                      height: 24,
                      marginLeft: 3,
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
    </div>
  );
};
