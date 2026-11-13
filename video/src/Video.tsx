import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CONTENT, TIMING, type SceneKey } from "./content";
import { colors, fonts } from "./theme";
import { Backdrop, ProgressBar, Watermark } from "./components/Shared";
import { CaptionTrack } from "./components/Captions";
import { IntroScene } from "./scenes/Intro";
import { StatsScene } from "./scenes/Stats";
import { RemoteGpuScene } from "./scenes/RemoteGpu";
import { AmdScene } from "./scenes/AmdGpu";
import { AscendScene } from "./scenes/AscendEnpu";
import { NumaScene } from "./scenes/NumaRefit";
import { MoreScene } from "./scenes/More";
import { UpgradeScene } from "./scenes/Upgrade";
import { OutroScene } from "./scenes/Outro";

export type VideoProps = {
  locale: "zh" | "en";
  /** Burn-in captions switch. Off by default; enable via CLI --props='{"captions":true}'. */
  captions?: boolean;
};

export const SCENE_ORDER: SceneKey[] = [
  "intro",
  "stats",
  "remoteGpu",
  "amd",
  "ascend",
  "numa",
  "more",
  "upgrade",
  "outro",
];

export const offsets = (locale: "zh" | "en") => {
  let acc = 0;
  const o: Record<SceneKey, { from: number; duration: number }> = {} as never;
  for (const key of SCENE_ORDER) {
    o[key] = { from: acc, duration: TIMING[locale][key] };
    acc += TIMING[locale][key];
  }
  return o;
};

export const HAMiVideo: React.FC<VideoProps> = ({ locale, captions = false }) => {
  const c = CONTENT[locale];
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = offsets(locale);
  const musicVol = interpolate(
    frame,
    [0, 40, durationInFrames - 100, durationInFrames - 8],
    [0, 0.13, 0.13, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const narration = (i: number) => (
    <Audio src={staticFile(`audio/narration-${locale}/scene-${i}.wav`)} volume={1} />
  );
  const caption = (i: number) =>
    captions ? <CaptionTrack locale={locale} scene={SCENE_ORDER[i]} /> : null;

  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: fonts.body }}>
      <Backdrop />

      <Sequence from={o.intro.from} durationInFrames={o.intro.duration}>
        <IntroScene c={c.intro} meta={c.meta} />
        {narration(0)}
        {caption(0)}
      </Sequence>

      <Sequence from={o.stats.from} durationInFrames={o.stats.duration}>
        <StatsScene c={c.stats} />
        {narration(1)}
        {caption(1)}
      </Sequence>

      <Sequence from={o.remoteGpu.from} durationInFrames={o.remoteGpu.duration}>
        <RemoteGpuScene c={c.remoteGpu} />
        {narration(2)}
        {caption(2)}
      </Sequence>

      <Sequence from={o.amd.from} durationInFrames={o.amd.duration}>
        <AmdScene c={c.amd} />
        {narration(3)}
        {caption(3)}
      </Sequence>

      <Sequence from={o.ascend.from} durationInFrames={o.ascend.duration}>
        <AscendScene c={c.ascend} />
        {narration(4)}
        {caption(4)}
      </Sequence>

      <Sequence from={o.numa.from} durationInFrames={o.numa.duration}>
        <NumaScene c={c.numa} />
        {narration(5)}
        {caption(5)}
      </Sequence>

      <Sequence from={o.more.from} durationInFrames={o.more.duration}>
        <MoreScene c={c.more} />
        {narration(6)}
        {caption(6)}
      </Sequence>

      <Sequence from={o.upgrade.from} durationInFrames={o.upgrade.duration}>
        <UpgradeScene c={c.upgrade} />
        {narration(7)}
        {caption(7)}
      </Sequence>

      <Sequence from={o.outro.from} durationInFrames={o.outro.duration}>
        <OutroScene c={c.outro} />
        {narration(8)}
        {caption(8)}
      </Sequence>

      {/* persistent watermark between intro and outro */}
      <Sequence from={o.stats.from} durationInFrames={o.upgrade.from + o.upgrade.duration - o.stats.from}>
        <Watermark version={c.meta.version} />
      </Sequence>

      <ProgressBar />

      <Audio src={staticFile(`audio/bgm-${locale}.wav`)} volume={musicVol} />
    </AbsoluteFill>
  );
};
