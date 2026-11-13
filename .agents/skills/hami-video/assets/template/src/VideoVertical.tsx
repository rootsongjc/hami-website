import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CONTENT, TIMING, type SceneKey } from "./content";
import { colors, fonts } from "./theme";
import { Backdrop, ProgressBar, Watermark } from "./components/Shared";
import { CaptionTrack } from "./components/Captions";
import { offsets, SCENE_ORDER, type VideoProps } from "./Video";
import { IntroSceneV } from "./scenes/vertical/Intro";
import { StatsSceneV } from "./scenes/vertical/Stats";
import { RemoteGpuSceneV } from "./scenes/vertical/RemoteGpu";
import { AmdSceneV } from "./scenes/vertical/AmdGpu";
import { AscendSceneV } from "./scenes/vertical/AscendEnpu";
import { NumaSceneV } from "./scenes/vertical/NumaRefit";
import { MoreSceneV } from "./scenes/vertical/More";
import { UpgradeSceneV } from "./scenes/vertical/Upgrade";
import { OutroSceneV } from "./scenes/vertical/Outro";

// Vertical 1080x1920 variant for short-video channels (视频号 / 抖音 / 小红书 / Shorts).
export const HAMiVideoVertical: React.FC<VideoProps> = ({ locale, captions = false }) => {
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
    captions ? <CaptionTrack locale={locale} scene={SCENE_ORDER[i]} compact /> : null;

  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: fonts.body }}>
      <Backdrop />

      <Sequence from={o.intro.from} durationInFrames={o.intro.duration}>
        <IntroSceneV c={c.intro} meta={c.meta} />
        {narration(0)}
        {caption(0)}
      </Sequence>

      <Sequence from={o.stats.from} durationInFrames={o.stats.duration}>
        <StatsSceneV c={c.stats} />
        {narration(1)}
        {caption(1)}
      </Sequence>

      <Sequence from={o.remoteGpu.from} durationInFrames={o.remoteGpu.duration}>
        <RemoteGpuSceneV c={c.remoteGpu} />
        {narration(2)}
        {caption(2)}
      </Sequence>

      <Sequence from={o.amd.from} durationInFrames={o.amd.duration}>
        <AmdSceneV c={c.amd} />
        {narration(3)}
        {caption(3)}
      </Sequence>

      <Sequence from={o.ascend.from} durationInFrames={o.ascend.duration}>
        <AscendSceneV c={c.ascend} />
        {narration(4)}
        {caption(4)}
      </Sequence>

      <Sequence from={o.numa.from} durationInFrames={o.numa.duration}>
        <NumaSceneV c={c.numa} />
        {narration(5)}
        {caption(5)}
      </Sequence>

      <Sequence from={o.more.from} durationInFrames={o.more.duration}>
        <MoreSceneV c={c.more} />
        {narration(6)}
        {caption(6)}
      </Sequence>

      <Sequence from={o.upgrade.from} durationInFrames={o.upgrade.duration}>
        <UpgradeSceneV c={c.upgrade} />
        {narration(7)}
        {caption(7)}
      </Sequence>

      <Sequence from={o.outro.from} durationInFrames={o.outro.duration}>
        <OutroSceneV c={c.outro} />
        {narration(8)}
        {caption(8)}
      </Sequence>

      <Sequence from={o.stats.from} durationInFrames={o.upgrade.from + o.upgrade.duration - o.stats.from}>
        <Watermark version={c.meta.version} compact />
      </Sequence>

      <ProgressBar />

      <Audio src={staticFile(`audio/bgm-${locale}.wav`)} volume={musicVol} />
    </AbsoluteFill>
  );
};
