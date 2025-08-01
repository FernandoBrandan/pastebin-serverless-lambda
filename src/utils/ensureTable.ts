import { CreateTableCommand, DescribeTableCommand, ResourceNotFoundException } from '@aws-sdk/client-dynamodb'
import { ddbDocClient } from "../config/dynamoDBClient"

export async function ensurePasteTableExists() {
    const TableName = process.env.PASTES_TABLE || 'Paste'

    try {
        await ddbDocClient.send(new DescribeTableCommand({ TableName }))
        console.log(`Tabla "${TableName}" ya existe`)
    } catch (err) {
        if (err instanceof ResourceNotFoundException) {
            console.log(`Tabla "${TableName}" no existe, creando...`)

            await ddbDocClient.send(
                new CreateTableCommand({
                    TableName,
                    AttributeDefinitions: [
                        { AttributeName: 'pasteId', AttributeType: 'S' },
                    ],
                    KeySchema: [{ AttributeName: 'pasteId', KeyType: 'HASH' }],
                    BillingMode: 'PAY_PER_REQUEST',
                })
            )

            console.log(`Tabla "${TableName}" creada exitosamente`)
        } else {
            console.error('Error verificando tabla:', err)
            throw err
        }
    }
}
