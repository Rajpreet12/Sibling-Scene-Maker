import episodeJson from "../../episode-data.json";
import durationsJson from "../../public/audio/durations.json";

export const FPS = 30;

export type Speaker = "sarvgun" | "elahi" | "teacher" | "narrator";
export type Focus = "sarvgun" | "elahi" | "both" | "school" | "idea" | "trophy";
export type Location = "living-room" | "hallway" | "stage";
export type Mood = "angry" | "warm";
export type Business = "rehearsal" | "sabotage";

export type LineBlock = {
  speaker: Speaker;
  text: string;
  audio: string;
  startFrame: number; // relative to scene start
  durationInFrames: number;
};

export type SceneBlock = {
  kind: "scene";
  actIndex: number;
  sceneIndex: number;
  sceneNumber: number;
  title: string;
  focus: Focus;
  location: Location;
  mood?: Mood;
  business?: Business;
  night?: boolean;
  action: {
    text: string;
    audio: string;
    startFrame: number;
    durationInFrames: number;
  };
  lines: LineBlock[];
  startFrame: number;
  durationInFrames: number;
};

export type ActTitleBlock = {
  kind: "act-title";
  actIndex: number;
  actNumber: number;
  title: string;
  subtitle: string;
  startFrame: number;
  durationInFrames: number;
};

export type CardBlock = {
  kind: "title-card" | "end-card";
  startFrame: number;
  durationInFrames: number;
};

export type MoralBlock = {
  kind: "moral-card";
  text: string;
  audio: string;
  startFrame: number;
  durationInFrames: number;
};

export type Block = SceneBlock | ActTitleBlock | CardBlock | MoralBlock;

const secondsToFrames = (s: number) => Math.round(s * FPS);

const durations = durationsJson as Record<string, number>;

const GAP_AFTER_ACTION = secondsToFrames(0.35);
const GAP_BETWEEN_LINES = secondsToFrames(0.3);
const END_HOLD = secondsToFrames(1.0);
const ACT_TITLE_SECONDS = secondsToFrames(2.6);
const OPEN_TITLE_SECONDS = secondsToFrames(3.4);
const END_CARD_SECONDS = secondsToFrames(3.6);
const MORAL_HOLD = secondsToFrames(1.2);

function buildTimeline() {
  const blocks: Block[] = [];
  let cursor = 0;

  blocks.push({ kind: "title-card", startFrame: cursor, durationInFrames: OPEN_TITLE_SECONDS });
  cursor += OPEN_TITLE_SECONDS;

  episodeJson.acts.forEach((act, actIndex) => {
    blocks.push({
      kind: "act-title",
      actIndex,
      actNumber: actIndex + 1,
      title: act.title,
      subtitle: act.subtitle,
      startFrame: cursor,
      durationInFrames: ACT_TITLE_SECONDS,
    });
    cursor += ACT_TITLE_SECONDS;

    act.scenes.forEach((scene, sceneIndex) => {
      const actionId = `a${actIndex}-s${sceneIndex}-action`;
      const actionDuration = secondsToFrames(durations[actionId] ?? 2);

      let localCursor = 0;
      const action = {
        text: scene.action,
        audio: `audio/${actionId}.wav`,
        startFrame: localCursor,
        durationInFrames: actionDuration,
      };
      localCursor += actionDuration;
      if (scene.lines.length > 0) localCursor += GAP_AFTER_ACTION;

      const lines: LineBlock[] = scene.lines.map((line, lineIndex) => {
        const lineId = `a${actIndex}-s${sceneIndex}-l${lineIndex}`;
        const lineDuration = secondsToFrames(durations[lineId] ?? 1.5);
        const lineBlock: LineBlock = {
          speaker: line.speaker as Speaker,
          text: line.text,
          audio: `audio/${lineId}.wav`,
          startFrame: localCursor,
          durationInFrames: lineDuration,
        };
        localCursor += lineDuration + GAP_BETWEEN_LINES;
        return lineBlock;
      });

      const sceneDuration = localCursor + END_HOLD;

      blocks.push({
        kind: "scene",
        actIndex,
        sceneIndex,
        sceneNumber: blocks.filter((b) => b.kind === "scene").length + 1,
        title: scene.title,
        focus: scene.focus as Focus,
        location: scene.location as Location,
        mood: (scene as any).mood as Mood | undefined,
        business: (scene as any).business as Business | undefined,
        night: (scene as any).night as boolean | undefined,
        action,
        lines,
        startFrame: cursor,
        durationInFrames: sceneDuration,
      });
      cursor += sceneDuration;
    });
  });

  const moralDuration = secondsToFrames(durations["moral"] ?? 5) + MORAL_HOLD;
  blocks.push({
    kind: "moral-card",
    text: episodeJson.moral,
    audio: "audio/moral.wav",
    startFrame: cursor,
    durationInFrames: moralDuration,
  });
  cursor += moralDuration;

  blocks.push({ kind: "end-card", startFrame: cursor, durationInFrames: END_CARD_SECONDS });
  cursor += END_CARD_SECONDS;

  return { blocks, totalDurationInFrames: cursor };
}

export const episodeMeta = {
  title: episodeJson.title,
  subtitle: episodeJson.subtitle,
};

export const { blocks, totalDurationInFrames } = buildTimeline();
