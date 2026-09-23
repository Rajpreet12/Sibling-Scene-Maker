// Rule-based script parsing. Bedrock (for real NL understanding) is blocked on this
// AWS account right now (every model invocation returns "Operation not allowed" --
// looks like the same class of account-level restriction as the CloudFront block),
// so this is a keyword/pattern fallback until that's lifted.

export function parseScript(script) {
  const rawLines = script
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const lines = [];
  let nextSpeaker = 'elahi';

  for (const raw of rawLines) {
    const match = raw.match(/^(elahi|sarvgun)\s*[:\-]\s*(.+)$/i);
    if (match) {
      const speaker = match[1].toLowerCase();
      const text = match[2].trim();
      if (text) lines.push({ speaker, text });
      nextSpeaker = speaker === 'elahi' ? 'sarvgun' : 'elahi';
    } else {
      lines.push({ speaker: nextSpeaker, text: raw });
      nextSpeaker = nextSpeaker === 'elahi' ? 'sarvgun' : 'elahi';
    }
  }

  return lines;
}

const KEYWORDS = {
  mood: {
    angry: ['angry', 'fight', 'mad', 'yell', 'scream', 'rival', 'hate', 'furious', 'blowout', 'argu'],
    warm: ['sorry', 'love', 'hug', 'forgive', 'favorite', 'miss you', 'apolog', 'reconcil'],
  },
  activity: {
    dancing: ['dance', 'dancing', 'zumba', 'jumba', 'jump'],
    walking: ['walk', 'walking', 'pacing', 'stroll', 'pace'],
  },
  music: {
    pop: ['pop music', 'pop song', 'upbeat music', 'party music'],
    jazz: ['jazz', 'mellow music', 'calm music', 'soft music'],
  },
  location: {
    hallway: ['school', 'hallway', 'locker', 'sign-up', 'sign up', 'classroom'],
    stage: ['stage', 'curtain', 'trophy', 'talent show', 'spotlight', 'audience', 'performance'],
  },
};

function detect(text, groups) {
  const lower = text.toLowerCase();
  for (const [key, words] of Object.entries(groups)) {
    if (words.some((w) => lower.includes(w))) return key;
  }
  return null;
}

export function inferSceneSettings(script) {
  const mood = detect(script, KEYWORDS.mood) ?? 'neutral';
  const activity = detect(script, KEYWORDS.activity) ?? 'none';
  const location = detect(script, KEYWORDS.location) ?? 'living-room';

  let music = detect(script, KEYWORDS.music);
  if (!music) {
    if (activity === 'dancing') music = 'pop';
    else if (activity === 'walking') music = 'jazz';
    else music = 'none';
  }

  return { mood, activity, location, music };
}
