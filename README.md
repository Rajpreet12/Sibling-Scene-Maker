# Sibling Scene Maker

An animated-cartoon project about two sisters, Elahi and Sarvgun, in two parts:

1. **The episode** — a fixed animated short, "One Spot Left," built with [Remotion](https://www.remotion.dev).
2. **The generator** — a live web app where anyone can write dialogue for the two characters and get back a real animated, voiced video clip, rendered on-demand on AWS.

**Live app:** deployed via AWS Lambda + API Gateway (see `backend/`).

## How it works

- **Remotion** (`src/`) renders the animation — character art, backgrounds, mood-based movement (idle/talking/dancing/walking), and subtitles — entirely in React/TypeScript.
- **Amazon Polly** synthesizes a distinct voice per character.
- **AWS Lambda** (`backend/src/handlers/`) orchestrates everything:
  - `generate.mjs` — accepts either structured dialogue lines or a free-form script (parsed with `parse-script.mjs`, which also infers mood/location/activity/music from the text), calls Polly, uploads audio to S3, and triggers a render via **Remotion Lambda**.
  - `status.mjs` — polls render progress.
  - `frontend.mjs` — serves the web UI directly over the API Gateway's HTTPS domain.
- Background music (`public/music/`) is synthesized from scratch in code (`tools/generate-music.mjs`) — no samples, nothing licensed.

## Project layout

```
src/                  Remotion compositions (fixed episode + SceneMaker generator)
public/audio/         Pre-generated voice lines for the fixed episode
public/music/         Procedurally generated background music loops
backend/              AWS SAM app: Lambda handlers + infrastructure template
frontend/             The generator's web UI (served by backend/src/handlers/frontend.mjs)
tools/                Render/preview/debug scripts
episode-data.json     Script + scene data for the fixed episode
```

## Running the fixed episode locally

```bash
npm install
npm run dev        # Remotion Studio preview
npx remotion render # render OneSpotLeft to a video file
```

## Deploying the generator

```bash
cd backend
npm install
npm run assemble   # bundle Lambda handlers
sam build
sam deploy
```

Requires a Remotion Lambda function and site already deployed (`npx remotion lambda functions deploy` / `npx remotion lambda sites create` from the project root) — their names/URLs are passed in as SAM parameters (see `backend/samconfig.toml`).
