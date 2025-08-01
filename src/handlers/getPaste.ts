import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { getDB, getFile } from "../services/database"
import { clientRedis } from '../config/redis'
import { ensurePasteTableExists } from "../utils/ensureTable"

// GET /api/v1/pastes?pasteId=abc123
export const get_paste = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    await ensurePasteTableExists()

    const pasteId = event.queryStringParameters?.pasteId
    if (!pasteId) return { statusCode: 400, body: JSON.stringify({ error: 'Missing pasteId' }) }

    // Se busca primero en Redis
    // Si existe, devuelve cache rápido
    const cacheKey = `paste:${pasteId}`
    const cached = await clientRedis.get(cacheKey)
    if (cached) {
        const parsed = JSON.parse(cached)
        return { statusCode: 200, body: JSON.stringify(parsed) }
    }

    const paste = await getDB(pasteId)
    if (!paste) return { statusCode: 404, body: JSON.stringify({ error: 'Paste not found' }) }

    const content = await getFile(pasteId)
    if (!content) return { statusCode: 404, body: JSON.stringify({ error: 'Content not found' }) }
    paste.content = content

    await clientRedis.set(cacheKey, JSON.stringify(paste), 'EX', 60 * 5)

    return { statusCode: 200, body: JSON.stringify(paste) }
}
