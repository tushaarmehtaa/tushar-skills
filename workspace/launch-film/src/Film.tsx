import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { S } from "./theme";
import { Browser } from "./scenes/Browser";
import { Line, Turn } from "./scenes/Captions";
import { Beat, Deploy } from "./scenes/Beats";
import { End, Works } from "./scenes/Ending";
import { Wheel } from "./scenes/Wheel";

const BEAT_SLUGS = ["auth-implementation", "payments-with-dodo", "mobile-first"];

export const Film: React.FC = () => {
  const sc = S.scenes as Record<string, { from: number; duration: number }>;
  const at = (name: string, node: React.ReactNode) => (
    <Sequence key={name} from={sc[name].from} durationInFrames={sc[name].duration}>{node}</Sequence>
  );
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <Audio src={staticFile("audio/music.wav")} volume={0.89} />
      <Audio src={staticFile("audio/sfx.wav")} volume={0.89} />
      {at("browser", <Browser />)}
      {at("line", <Line />)}
      {at("turn", <Turn />)}
      {BEAT_SLUGS.map((slug) => at(slug, <Beat slug={slug} dur={sc[slug].duration} />))}
      {at("deploy-check", <Deploy dur={sc["deploy-check"].duration} />)}
      {at("skills", <Wheel dur={sc.skills.duration} />)}
      {at("works", <Works dur={sc.works.duration} />)}
      {at("end", <End />)}
    </AbsoluteFill>
  );
};
