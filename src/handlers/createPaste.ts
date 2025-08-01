import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { clientRedis } from '../config/redis'
import { IPaste } from "../type/IPaste"

import { getUserFromAuth, isPremiumUser } from "../auth/authMiddleware"

import { validateContent, validateContentType, validateExpiry } from "../services/validate"
import { saveDB, saveFile } from "../services/database"
import { KgsService } from "../services/kgs"
import { ensurePasteTableExists } from "../utils/ensureTable"


const MAX_SIZE_BYTES = 1_000_000

export const create_paste = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        await ensurePasteTableExists()

        if (!event.body) return { statusCode: 400, body: JSON.stringify({ error: 'Empty request body' }) }

        let body: Partial<IPaste>
        try {
            body = JSON.parse(event.body)
        } catch {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON format' }) }
        }

        if (!body.content || !body.visibility) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: content or visibility' }) }
        }

        const user = getUserFromAuth(event)
        const userId = user?.userId
        const isLoggedIn = !!userId
        const isPremium = isLoggedIn ? await isPremiumUser(userId) : false

        const expireType = body.expireType || 'never'
        const longExpire = ['1w', '1m'].includes(expireType)
        const contentSize = Buffer.byteLength(body.content, 'utf8')

        if (expireType === '1d' && !isLoggedIn) {
            return { statusCode: 403, body: JSON.stringify({ error: 'Login required for 1-day expiration' }) }
        }

        if (longExpire && !isPremium) {
            return { statusCode: 402, body: JSON.stringify({ error: 'Premium required for long-term expiration (1w, 1m)' }) }
        }

        if (body.visibility === 'private' && !isLoggedIn) {
            return { statusCode: 403, body: JSON.stringify({ error: 'Login required for private pastes' }) }
        }

        if (body.visibility === 'private' && longExpire && !isPremium) {
            return { statusCode: 402, body: JSON.stringify({ error: 'Premium required for private + long-term' }) }
        }

        if (contentSize > MAX_SIZE_BYTES && !isPremium) {
            return { statusCode: 402, body: JSON.stringify({ error: 'Content exceeds 1MB. Upgrade to premium.' }) }
        }

        const contentValidation = validateContent(body.content)
        if (contentValidation.error) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid content', details: contentValidation.error }) }
        }

        const contentTypeValid = validateContentType(body.contentType || 'text/plain')
        if (!contentTypeValid) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Unsupported content type' }) }
        }

        const expiresAt = validateExpiry(expireType)
        if (!expiresAt) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid expiration type' }) }
        }

        const kgs = new KgsService()
        const pasteId = await kgs.generatePasteId()
        if (!pasteId) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate paste ID' }) }
        }

        const paste: IPaste = {
            pasteId,
            title: body.title?.trim() || 'Untitled',
            content: contentValidation.contentClean || '',
            contentType: body.contentType || 'text/plain',
            expireType,
            expiresAt,
            visibility: body.visibility,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // Guardar en S3
        await saveFile(paste.pasteId, paste.content)
        // Guardar en DB
        await saveDB(paste)
        const cacheKey = `paste:${pasteId}`
        await clientRedis.set(cacheKey, JSON.stringify(paste), 'EX', 60 * 5)

        return {
            statusCode: 201,
            body: JSON.stringify({
                pasteId: paste.pasteId,
                url: `http://localhost:3000/local/api/v1/pastes?pasteId=${paste.pasteId}`,
                expiresAt: paste.expiresAt,
            }),
        }

    } catch (error) {
        console.error('Error in create_paste:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        }
    }
}
