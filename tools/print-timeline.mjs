import fs from "fs";

const FPS = 30;
const episode = JSON.parse(fs.readFileSync("episode-data.json", "utf8"));
const durations = JSON.parse(fs.readFileSync("public/audio/durations.json", "utf8").replace(/^﻿/, ""));
const s2f = (s) => Math.round(s * FPS);

let cursor = 0;
const OPEN = s2f(3.4);
const ACT = s2f(2.6);
const GAP_A = s2f(0.35);
const GAP_L = s2f(0.3);
const END_HOLD = s2f(1.0);
const END_CARD = s2f(3.6);

console.log(`title-card: ${cursor}..${cursor + OPEN}`);
cursor += OPEN;

let sceneNum = 0;
episode.acts.forEach((act, ai) => {
  console.log(`ACT ${ai + 1} "${act.title}": ${cursor}..${cursor + ACT}`);
  cursor += ACT;
  act.scenes.forEach((scene, si) => {
    sceneNum++;
    const actionId = `a${ai}-s${si}-action`;
    const actionDur = s2f(durations[actionId] ?? 2);
    let local = actionDur;
    if (scene.lines.length) local += GAP_A;
    const lineStarts = [];
    scene.lines.forEach((line, li) => {
      const id = `a${ai}-s${si}-l${li}`;
      const dur = s2f(durations[id] ?? 1.5);
      lineStarts.push({ speaker: line.speaker, start: cursor + local, dur });
      local += dur + GAP_L;
    });
    const sceneDur = local + END_HOLD;
    console.log(`  Scene ${sceneNum} "${scene.title}" (focus=${scene.focus}): ${cursor}..${cursor + sceneDur}`);
    lineStarts.forEach((l) => console.log(`    line[${l.speaker}] @${l.start}..${l.start + l.dur}`));
    cursor += sceneDur;
  });
});
console.log(`end-card: ${cursor}..${cursor + END_CARD}`);
cursor += END_CARD;
console.log(`TOTAL frames: ${cursor}  (${(cursor / FPS).toFixed(1)}s)`);
