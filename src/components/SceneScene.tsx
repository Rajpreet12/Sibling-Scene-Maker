import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { LivingRoom } from "./backgrounds/LivingRoom";
import { Hallway } from "./backgrounds/Hallway";
import { Stage } from "./backgrounds/Stage";
import { SarvgunAvatar, ElahiAvatar } from "./Avatar";
import { TeacherAvatar } from "./TeacherAvatar";
import { Subtitle } from "./Subtitle";
import { SceneTag } from "./SceneTag";
import { AngerIcon, HeartIcon, StarIcon, NoteIcon, PoofIcon } from "./Icons";
import { palette } from "../styles";
import type { SceneBlock } from "../data/episode";

const LOCATION_BG: Record<SceneBlock["location"], React.FC<{ night?: boolean }>> = {
  "living-room": LivingRoom,
  hallway: Hallway,
  stage: Stage,
};

type BobMode = "idle" | "agitated" | "dance";

const useBob = (frame: number, active: boolean, mode: BobMode) => {
  const idle =
    mode === "agitated" ? Math.sin(frame / 6) * 5 : mode === "dance" ? Math.sin(frame / 5) * 12 : Math.sin(frame / 14) * 3;
  const talk = active ? Math.sin(frame / 3.2) * 7 : 0;
  return idle + talk;
};

const ENTRANCE_FRAMES = 18;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

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

// looping sparkle near Elahi's wand hand while she rehearses her trick
const TrickSpark: React.FC<{ frame: number }> = ({ frame }) => {
  const cycle = (frame % 50) / 50;
  const opacity = cycle < 0.6 ? 1 : Math.max(0, 1 - (cycle - 0.6) / 0.4);
  const scale = 0.5 + cycle * 0.9;
  return (
    <div
      style={{
        position: "absolute",
        top: "38%",
        left: "76%",
        transform: `translate(-50%, ${-cycle * 44}px) scale(${scale})`,
        opacity,
      }}
    >
      <StarIcon color={palette.gold} size={26} />
    </div>
  );
};

// one-shot "poof" burst: fires once starting at `delay` frames into the scene
const computeBurst = (frame: number, delay: number, length: number) => {
  const t = frame - delay;
  if (t < 0 || t > length) return null;
  const p = t / length;
  const opacity = p < 0.65 ? 1 : Math.max(0, 1 - (p - 0.65) / 0.35);
  const scale = 0.5 + p * 1.1;
  return { opacity, scale, rise: p * 50 };
};

export const SceneScene: React.FC<{ scene: SceneBlock }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const BackgroundComponent = LOCATION_BG[scene.location];

  const activeLineIdx = (() => {
    let idx = -1;
    scene.lines.forEach((l, i) => {
      if (frame >= l.startFrame) idx = i;
    });
    return idx;
  })();
  const activeLine = activeLineIdx >= 0 ? scene.lines[activeLineIdx] : null;

  const sarvgunTalking = activeLine?.speaker === "sarvgun";
  const elahiTalking = activeLine?.speaker === "elahi";
  const teacherTalking = activeLine?.speaker === "teacher";
  const agitated = scene.mood === "angry";
  const performing = scene.business === "rehearsal";
  const sabotage = scene.business === "sabotage";

  const bobMode: BobMode = agitated ? "agitated" : performing ? "dance" : "idle";
  const sarvgunBob = useBob(frame, sarvgunTalking, bobMode);
  const elahiBob = useBob(frame, elahiTalking, bobMode);
  const teacherBob = useBob(frame, teacherTalking, "idle");

  const sarvgunSway = performing ? Math.sin(frame / 9) * 36 : 0;
  const elahiSway = performing ? Math.sin(frame / 9 + Math.PI) * 22 : 0;

  const showTeacher = scene.lines.some((l) => l.speaker === "teacher");
  const showSarvgun =
    scene.focus === "sarvgun" || scene.focus === "both" || scene.lines.some((l) => l.speaker === "sarvgun");
  const showElahi =
    scene.focus === "elahi" || scene.focus === "both" || scene.lines.some((l) => l.speaker === "elahi");

  const lineEntrance = activeLine
    ? Math.min(1, Math.max(0, (frame - activeLine.startFrame) / 10))
    : 0;

  const bothSiblings = showSarvgun && showElahi && !showTeacher;
  let elahiX = showTeacher ? "18%" : "32%";
  let sarvgunX = showTeacher ? "82%" : "68%";
  if (bothSiblings && scene.mood === "warm") {
    elahiX = "42%";
    sarvgunX = "58%";
  }

  const entrance = easeOutCubic(Math.min(1, frame / ENTRANCE_FRAMES));
  const slideSarvgun = (1 - entrance) * 190;
  const slideElahi = (1 - entrance) * 190;
  const riseTeacher = (1 - entrance) * 130;

  const sarvgunOffset = slideSarvgun + sarvgunSway;
  const elahiOffset = -slideElahi + elahiSway;

  const noteBurst = sabotage ? computeBurst(frame, 55, 45) : null;
  const poofBurst = sabotage ? computeBurst(frame, 20, 40) : null;

  // a dark room: a startled beat where they're only silhouettes, then the "scare" flash
  // as they realize it's just each other, and the room settles into moonlit calm.
  const silhouetteReveal = scene.night ? Math.min(1, Math.max(0, (frame - 10) / 20)) : 1;
  const nightBrightness = scene.night ? `brightness(${silhouetteReveal})` : "";
  const scareFlash = scene.night ? computeBurst(frame, 6, 14) : null;
  const jolt = scene.night ? Math.max(0, 1 - frame / 10) * Math.sin(frame * 3) * 16 : 0;

  const driftDir = scene.sceneNumber % 2 === 0 ? 1 : -1;
  const camX = driftDir * Math.min(frame * 0.1, 34) + jolt;
  const camScale = 1 + Math.min(frame * 0.00005, 0.045);

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${camScale}) translateX(${camX}px)`,
          transformOrigin: "center center",
        }}
      >
        <BackgroundComponent night={scene.night} />
      </div>
      {scareFlash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#F1E4C4",
            opacity: scareFlash.opacity * 0.8,
          }}
        />
      )}
      <Audio src={staticFile(scene.action.audio)} />
      {scene.lines.map((line, i) => (
        <Sequence key={i} from={line.startFrame} durationInFrames={line.durationInFrames + 20}>
          <Audio src={staticFile(line.audio)} />
        </Sequence>
      ))}

      <SceneTag sceneNumber={scene.sceneNumber} title={scene.title} focus={scene.focus} />

      {showTeacher && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 300 - riseTeacher,
            transform: "translateX(-50%)",
            opacity: entrance,
          }}
        >
          <TeacherAvatar
            bounce={teacherBob}
            talking={teacherTalking}
            style={{
              height: 520,
              filter: teacherTalking ? "drop-shadow(0 0 26px rgba(224,165,60,0.55))" : "none",
            }}
          />
        </div>
      )}

      {showElahi && (
        <div
          style={{
            position: "absolute",
            left: elahiX,
            bottom: 300,
            transform: `translateX(calc(-50% + ${elahiOffset}px))`,
            opacity: entrance,
          }}
        >
          <div style={{ position: "relative" }}>
            {scene.mood && entrance > 0.9 && <MoodMark mood={scene.mood} frame={frame} />}
            {performing && entrance > 0.9 && <TrickSpark frame={frame} />}
            {poofBurst && (
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "25%",
                  transform: `translate(-50%, ${-poofBurst.rise}px) scale(${poofBurst.scale})`,
                  opacity: poofBurst.opacity,
                }}
              >
                <PoofIcon color={palette.elahi} size={34} />
              </div>
            )}
            <ElahiAvatar
              bounce={elahiBob}
              talking={elahiTalking}
              style={{
                height: 580,
                filter: `${elahiTalking ? "drop-shadow(0 0 26px rgba(110,95,203,0.55))" : ""} ${nightBrightness}`.trim() || "none",
              }}
            />
          </div>
        </div>
      )}
      {showSarvgun && (
        <div
          style={{
            position: "absolute",
            left: sarvgunX,
            bottom: 300,
            transform: `translateX(calc(-50% + ${sarvgunOffset}px))`,
            opacity: entrance,
          }}
        >
          <div style={{ position: "relative" }}>
            {scene.mood && entrance > 0.9 && <MoodMark mood={scene.mood} frame={frame + 20} />}
            {noteBurst && (
              <div
                style={{
                  position: "absolute",
                  top: "5%",
                  left: "50%",
                  transform: `translate(-50%, ${-noteBurst.rise}px) scale(${noteBurst.scale})`,
                  opacity: noteBurst.opacity,
                }}
              >
                <NoteIcon color={palette.sarvgun} size={34} />
              </div>
            )}
            <SarvgunAvatar
              bounce={sarvgunBob}
              talking={sarvgunTalking}
              style={{
                height: 620,
                filter: `${sarvgunTalking ? "drop-shadow(0 0 26px rgba(226,98,47,0.55))" : ""} ${nightBrightness}`.trim() || "none",
              }}
            />
          </div>
        </div>
      )}

      {activeLine && <Subtitle line={activeLine} entrance={lineEntrance} />}
    </>
  );
};
