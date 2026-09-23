import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { LivingRoom } from "./components/backgrounds/LivingRoom";
import { Hallway } from "./components/backgrounds/Hallway";
import { Stage } from "./components/backgrounds/Stage";
import { SarvgunAvatar, ElahiAvatar } from "./components/Avatar";
import { Subtitle } from "./components/Subtitle";
import { AngerIcon, HeartIcon } from "./components/Icons";
import { palette } from "./styles";

export type SceneMakerLine = {
  speaker: "elahi" | "sarvgun";
  text: string;
  audioUrl: string;
  durationInFrames: number;
};

export type Activity = "none" | "dancing" | "walking";
export type MusicTrack = "none" | "pop" | "jazz";

export type SceneMakerProps = {
  lines: SceneMakerLine[];
  mood: "angry" | "warm" | "neutral";
  location: "living-room" | "hallway" | "stage";
  activity: Activity;
  music: MusicTrack;
};

export const FPS = 30;
const GAP = Math.round(0.3 * FPS);
const END_HOLD = Math.round(1.0 * FPS);
const ENTRANCE_FRAMES = 18;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function layout(lines: SceneMakerLine[]) {
  let cursor = 0;
  const laidOut = lines.map((l) => {
    const startFrame = cursor;
    cursor += l.durationInFrames + GAP;
    return { ...l, startFrame };
  });
  return { laidOut, total: cursor + END_HOLD };
}

export const calculateSceneMakerMetadata: CalculateMetadataFunction<SceneMakerProps> = ({ props }) => {
  const { total } = layout(props.lines ?? []);
  return { durationInFrames: Math.max(total, 60), fps: FPS };
};

export const sceneMakerDefaultProps: SceneMakerProps = {
  mood: "neutral",
  location: "living-room",
  activity: "none",
  music: "none",
  lines: [
    { speaker: "elahi", text: "Type your own scene above!", audioUrl: "", durationInFrames: 60 },
    { speaker: "sarvgun", text: "Pick a mood and hit generate.", audioUrl: "", durationInFrames: 60 },
  ],
};

const LOCATION_BG: Record<SceneMakerProps["location"], React.FC<{ night?: boolean }>> = {
  "living-room": LivingRoom,
  hallway: Hallway,
  stage: Stage,
};

const MUSIC_SRC: Record<Exclude<MusicTrack, "none">, string> = {
  pop: staticFile("music/pop.wav"),
  jazz: staticFile("music/jazz.wav"),
};

type BobMode = "idle" | "agitated" | "dancing" | "walking";
const useBob = (frame: number, active: boolean, mode: BobMode) => {
  let idle: number;
  if (mode === "agitated") idle = Math.sin(frame / 6) * 5;
  else if (mode === "dancing") idle = -Math.abs(Math.sin(frame / 6)) * 34;
  else if (mode === "walking") idle = Math.abs(Math.sin(frame / 8)) * 8;
  else idle = Math.sin(frame / 14) * 3;
  const talk = active ? Math.sin(frame / 3.2) * 7 : 0;
  return idle + talk;
};

// dance squash-and-stretch: squashed at the bottom of the jump, stretched at the peak
const danceScale = (frame: number) => {
  const jump = Math.abs(Math.sin(frame / 6));
  return 1 + jump * 0.1 - (1 - jump) * 0.06;
};

// pacing back and forth, like walking around while talking
const walkDrift = (frame: number, phase: number) => Math.sin(frame / 42 + phase) * 70;

const MoodMark: React.FC<{ mood: "angry" | "warm"; frame: number }> = ({ mood, frame }) => {
  if (mood === "angry") {
    const jitter = Math.sin(frame / 2.5) * 4;
    return (
      <div style={{ position: "absolute", top: -46, left: `calc(50% + ${jitter}px)`, transform: "translateX(-50%)" }}>
        <AngerIcon color="#E24C3A" size={40} />
      </div>
    );
  }
  const rise = (frame % 40) / 40;
  return (
    <div
      style={{
        position: "absolute",
        top: -20 - rise * 60,
        left: "50%",
        transform: `translateX(-50%) scale(${0.7 + rise * 0.5})`,
        opacity: 1 - rise,
      }}
    >
      <HeartIcon color={palette.sarvgun} size={30} />
    </div>
  );
};

export const SceneMaker: React.FC<SceneMakerProps> = ({ lines, mood, location, activity, music }) => {
  const frame = useCurrentFrame();
  const { laidOut } = layout(lines ?? []);
  const BackgroundComponent = LOCATION_BG[location] ?? LivingRoom;

  const activeIdx = (() => {
    let idx = -1;
    laidOut.forEach((l, i) => {
      if (frame >= l.startFrame) idx = i;
    });
    return idx;
  })();
  const active = activeIdx >= 0 ? laidOut[activeIdx] : null;

  const elahiTalking = active?.speaker === "elahi";
  const sarvgunTalking = active?.speaker === "sarvgun";
  const agitated = mood === "angry";

  const bobMode: BobMode = activity === "dancing" ? "dancing" : activity === "walking" ? "walking" : agitated ? "agitated" : "idle";
  const elahiBob = useBob(frame, elahiTalking, bobMode);
  const sarvgunBob = useBob(frame, sarvgunTalking, bobMode);

  const entrance = easeOutCubic(Math.min(1, frame / ENTRANCE_FRAMES));
  const slide = (1 - entrance) * 190;

  const elahiX = mood === "warm" ? "42%" : "32%";
  const sarvgunX = mood === "warm" ? "58%" : "68%";

  const elahiWalk = activity === "walking" ? walkDrift(frame, 0) : 0;
  const sarvgunWalk = activity === "walking" ? walkDrift(frame, Math.PI) : 0;
  const elahiDanceScale = activity === "dancing" ? danceScale(frame) : 1;
  const sarvgunDanceScale = activity === "dancing" ? danceScale(frame + 15) : 1;

  const lineEntrance = active ? Math.min(1, Math.max(0, (frame - active.startFrame) / 10)) : 0;

  return (
    <AbsoluteFill>
      <BackgroundComponent />
      {music !== "none" && <Audio src={MUSIC_SRC[music]} loop volume={0.24} />}
      {laidOut.map(
        (l, i) =>
          l.audioUrl && (
            <Sequence key={i} from={l.startFrame} durationInFrames={l.durationInFrames + 20}>
              <Audio src={l.audioUrl} />
            </Sequence>
          ),
      )}

      <div
        style={{
          position: "absolute",
          left: elahiX,
          bottom: 300,
          transform: `translateX(calc(-50% - ${slide - elahiWalk}px)) scale(${elahiDanceScale})`,
          opacity: entrance,
        }}
      >
        <div style={{ position: "relative" }}>
          {mood !== "neutral" && entrance > 0.9 && <MoodMark mood={mood} frame={frame} />}
          <ElahiAvatar
            bounce={elahiBob}
            talking={elahiTalking}
            style={{
              height: 580,
              filter: elahiTalking ? "drop-shadow(0 0 26px rgba(110,95,203,0.55))" : "none",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: sarvgunX,
          bottom: 300,
          transform: `translateX(calc(-50% + ${slide + sarvgunWalk}px)) scale(${sarvgunDanceScale})`,
          opacity: entrance,
        }}
      >
        <div style={{ position: "relative" }}>
          {mood !== "neutral" && entrance > 0.9 && <MoodMark mood={mood} frame={frame + 20} />}
          <SarvgunAvatar
            bounce={sarvgunBob}
            talking={sarvgunTalking}
            style={{
              height: 620,
              filter: sarvgunTalking ? "drop-shadow(0 0 26px rgba(226,98,47,0.55))" : "none",
            }}
          />
        </div>
      </div>

      {active && <Subtitle line={active} entrance={lineEntrance} />}
    </AbsoluteFill>
  );
};
