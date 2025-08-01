import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { ddbDocClient } from "../config/dynamoDBClient"
import { IPaste } from "../type/IPaste"
import { clientMinio, validateBucket } from '../config/minio'

export const saveFile = async (pasteId: string, content: string): Promise<void> => {
    await validateBucket()
    const bucketName = 'pastes'
    const buffer = Buffer.from(content, 'utf-8')
    await clientMinio.putObject(bucketName, pasteId, buffer)
}

export const getFile = async (pasteId: string): Promise<string> => {
    const bucketName = 'pastes'
    const stream = await clientMinio.getObject(bucketName, pasteId)
    return new Promise((resolve, reject) => {
        let data = ''
        stream.on('data', (chunk) => (data += chunk.toString()))
        stream.on('end', () => resolve(data))
        stream.on('error', (err) => reject(err))
    })
}

export const saveDB = async (paste: IPaste) => {
    const { content, ...meta } = paste
    await ddbDocClient.send(new PutCommand({ TableName: 'Paste', Item: meta }))
}

export const getDB = async (pasteId: string): Promise<IPaste | null> => {
    const res = await ddbDocClient.send(new GetCommand({ TableName: "Paste", Key: { pasteId } }))
    if (!res.Item) return null
    const paste = res.Item as IPaste
    if (!paste.pasteId || !paste.visibility) return null
    return paste
}

