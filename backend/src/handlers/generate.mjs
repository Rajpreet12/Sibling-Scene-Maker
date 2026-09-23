import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { renderMediaOnLambda } from '@remotion/lambda-client'
import { parseBuffer } from 'music-metadata'
import { randomUUID } from 'node:crypto'
import { parseScript, inferSceneSettings } from './parse-script.mjs'

const polly = new PollyClient({})
const s3 = new S3Client({})

const REGION = process.env.REMOTION_REGION
const FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME
const SERVE_URL = process.env.REMOTION_SERVE_URL
const BUCKET = process.env.REMOTION_BUCKET

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
}

const VOICE_BY_SPEAKER = {
  elahi: 'Ivy',
  sarvgun: 'Salli',
}

const MAX_LINES = 6
const MAX_CHARS_PER_LINE = 140
const FPS = 30

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return json(200, {})
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }

  const rawScript = typeof payload.script === 'string' ? payload.script.trim() : ''
  const inferred = rawScript ? inferSceneSettings(rawScript) : null

  let lines = Array.isArray(payload.lines) ? payload.lines : []
  if (rawScript) {
    lines = parseScript(rawScript).map((l) => ({
      ...l,
      text: l.text.length > MAX_CHARS_PER_LINE ? l.text.slice(0, MAX_CHARS_PER_LINE - 1) + '…' : l.text,
    }))
  }
  lines = lines.slice(0, MAX_LINES)

  const mood = ['angry', 'warm', 'neutral'].includes(payload.mood) ? payload.mood : (inferred?.mood ?? 'neutral')
  const location = ['living-room', 'hallway', 'stage'].includes(payload.location)
    ? payload.location
    : (inferred?.location ?? 'living-room')
  const activity = ['none', 'dancing', 'walking'].includes(payload.activity) ? payload.activity : (inferred?.activity ?? 'none')
  const music = ['none', 'pop', 'jazz'].includes(payload.music) ? payload.music : (inferred?.music ?? 'none')

  if (lines.length === 0) return json(400, { error: 'At least one line is required (write lines or a script)' })

  for (const line of lines) {
    if (!VOICE_BY_SPEAKER[line.speaker]) {
      return json(400, { error: 'Each line needs speaker "elahi" or "sarvgun"' })
    }
    if (typeof line.text !== 'string' || !line.text.trim()) {
      return json(400, { error: 'Each line needs non-empty text' })
    }
    if (line.text.length > MAX_CHARS_PER_LINE) {
      return json(400, { error: `Lines must be under ${MAX_CHARS_PER_LINE} characters` })
    }
  }

  const requestId = randomUUID()

  try {
    const renderLines = []

    for (let i = 0; i < lines.length; i++) {
      const { speaker, text } = lines[i]

      const synth = await polly.send(
        new SynthesizeSpeechCommand({
          Engine: 'standard',
          OutputFormat: 'mp3',
          VoiceId: VOICE_BY_SPEAKER[speaker],
          Text: text,
        }),
      )
      const audioBuffer = Buffer.from(await synth.AudioStream.transformToByteArray())

      const key = `generated-audio/${requestId}/line-${i}.mp3`
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: audioBuffer,
          ContentType: 'audio/mpeg',
        }),
      )

      const meta = await parseBuffer(audioBuffer, 'audio/mpeg')
      const durationInFrames = Math.max(1, Math.round((meta.format.duration ?? 1.5) * FPS))

      renderLines.push({
        speaker,
        text,
        audioUrl: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`,
        durationInFrames,
      })
    }

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: REGION,
      functionName: FUNCTION_NAME,
      serveUrl: SERVE_URL,
      composition: 'SceneMaker',
      codec: 'h264',
      concurrency: 5,
      inputProps: { lines: renderLines, mood, location, activity, music },
    })

    return json(200, {
      renderId,
      bucketName,
      functionName: FUNCTION_NAME,
      region: REGION,
      understood: { lines: lines.map((l) => ({ speaker: l.speaker, text: l.text })), mood, location, activity, music },
    })
  } catch (err) {
    return json(500, { error: String(err?.message || err) })
  }
}
