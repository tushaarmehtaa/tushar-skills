import { Composition } from "remotion";
import { Film } from "./Film";
import { S } from "./theme";

export const RemotionRoot = () => (
  <Composition id="LaunchWeek" component={Film} durationInFrames={S.total} fps={S.fps} width={1920} height={1080} />
);
