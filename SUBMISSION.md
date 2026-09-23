# Sibling Scene Maker

**Category:** Personal Expression
**Lane:** Community
**Live app:** http://cartoon-generator-frontendbucket-7bac0plh3woi.s3-website-us-east-1.amazonaws.com

## The pitch

Type a few lines of dialogue for two sister characters, pick a mood and a location — or just paste a rough script — and get back a real animated video clip, voiced, scored, and rendered live on AWS in under a minute.

## The story

This started as something much smaller and much more personal: an animated cartoon about my own two sisters, Elahi and Sarvgun, built scene by scene with Claude Code as my coding agent. What began as one fixed episode turned into a question worth answering properly — could the same character art, animation, and voice pipeline be turned into something *generative*, where anyone can write a moment between two sisters and watch it come to life?

That's Sibling Scene Maker: the character designs, backgrounds, mood system, and animation logic from the original episode, rebuilt as a live, on-demand generator running entirely on AWS.

## What it actually does

1. You write dialogue (line by line, or as a loose script) and optionally set a mood, location, activity, and background music — or leave those on "Auto" and let the app infer them from your words.
2. **Amazon Polly** synthesizes a distinct voice per character.
3. **AWS Lambda** orchestrates the whole pipeline: Polly → S3 → triggering a render.
4. **Remotion**, running on its own Lambda function, composites the animated scene — characters with idle/talking/dancing/walking animation, mood effects (anger squiggles, floating hearts), and a background track — into an MP4.
5. The finished video lands in S3 and streams straight back into the page.

Everything, including the two background music tracks (a pop loop and a jazz loop), is generated — nothing downloaded, nothing licensed, nothing stock.

## How the coding agent shipped this

Claude Code didn't just write the animation code — it built and debugged the entire AWS deployment end to end, in the same session, iterating on real failures rather than a clean happy path:

- Designed and iterated the character/animation system (mood-based movement, dancing/walking motion, procedurally synthesized music) based on direct feedback across many rounds
- Deployed Remotion Lambda, diagnosed and fixed a silent webpack bundling failure specific to this machine, and worked around a Windows/npm CLI incompatibility in AWS SAM's build tooling
- Hit and resolved a real AWS account concurrency limit (10 concurrent Lambda executions) that was silently throttling renders, by tuning Remotion's concurrency setting
- Tracked down an esbuild + AWS SDK v3 bundling incompatibility (`createRequire(import.meta.url)` inside a pre-built dependency) and resolved it by shipping real `node_modules` instead of a re-bundled artifact
- Wrote the Polly → S3 → Remotion Lambda orchestration Lambda, the status-polling Lambda, the SAM infrastructure template, and the frontend
- Set up a $5 AWS Budget alarm *before* deploying anything that could incur cost, and kept every IAM policy scoped to specific resource ARNs rather than reaching for broad access
- When AWS Bedrock (the planned path for real AI script understanding) turned out to be blocked account-wide, built and shipped a rule-based fallback parser instead of stalling the project on an external dependency — and left the integration point isolated so swapping in Bedrock later is a small, contained change

## Why Personal Expression / Community

This is a content-creation tool — its whole purpose is helping someone (starting with me) create and share a personalized character-driven scene, which is exactly what the Personal Expression category describes. And it's Community, not Startup, because it was built for the actual people it's about: my own sisters. The generator is built to grow into new scenes, moods, and eventually new characters for the people who inspired it in the first place.

## Try it

http://cartoon-generator-frontendbucket-7bac0plh3woi.s3-website-us-east-1.amazonaws.com

Type two lines, pick "Dancing" and "Pop," and hit Generate — that's the fastest way to see the whole pipeline run live.
