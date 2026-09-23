import { getRenderProgress } from '@remotion/lambda-client'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Content-Type': 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') return json(200, {})

  const renderId = event.pathParameters?.renderId
  const bucketName = event.queryStringParameters?.bucketName
  if (!renderId || !bucketName) {
    return json(400, { error: 'renderId (path) and bucketName (query) are required' })
  }

  try {
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: process.env.REMOTION_FUNCTION_NAME,
      region: process.env.REMOTION_REGION,
    })

    return json(200, {
      done: progress.done,
      overallProgress: progress.overallProgress,
      outputFile: progress.outputFile,
      fatalErrorEncountered: progress.fatalErrorEncountered,
      errors: (progress.errors ?? []).map((e) => e.message),
    })
  } catch (err) {
    return json(500, { error: String(err?.message || err) })
  }
}
