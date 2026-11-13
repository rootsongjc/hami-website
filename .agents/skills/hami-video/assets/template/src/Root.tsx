import React from "react";
import { Composition } from "remotion";
import { totalFrames } from "./content";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { HAMiVideo, type VideoProps } from "./Video";
import { HAMiVideoVertical } from "./VideoVertical";

const V_WIDTH = 1080;
const V_HEIGHT = 1920;

// zh ships with burned-in captions by default (B站/视频号 audiences expect them);
// en renders clean by default, with an explicit -captioned variant available.
const zhProps: VideoProps = { locale: "zh", captions: true };
const enProps: VideoProps = { locale: "en", captions: false };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HAMI211ZH"
      component={HAMiVideo}
      durationInFrames={totalFrames("zh")}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={zhProps}
    />
    <Composition
      id="HAMI211ZHV"
      component={HAMiVideoVertical}
      durationInFrames={totalFrames("zh")}
      fps={FPS}
      width={V_WIDTH}
      height={V_HEIGHT}
      defaultProps={zhProps}
    />
    <Composition
      id="HAMI211EN"
      component={HAMiVideo}
      durationInFrames={totalFrames("en")}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={enProps}
    />
    <Composition
      id="HAMI211ENV"
      component={HAMiVideoVertical}
      durationInFrames={totalFrames("en")}
      fps={FPS}
      width={V_WIDTH}
      height={V_HEIGHT}
      defaultProps={enProps}
    />
  </>
);
