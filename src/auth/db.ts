import { CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import { ddbDocClient } from '../config/dynamoDBClient'
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { IUser } from '../type/IUser'

const USER_TABLE = 'Users'

export const createUser = async (email: string, passwordHash: string): Promise<void> => {
    const user: IUser = { email, password_hash: passwordHash, plan: 'free' }
    await ddbDocClient.send(new PutCommand({ TableName: 'Users', Item: user }))
}

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const res = await ddbDocClient.send(new GetCommand({ TableName: 'Users', Key: { email } }))
    return res.Item as IUser || null
}

export const validate_table = async () => {
    const tableName = USER_TABLE
    try {
        await ddbDocClient.send(new DescribeTableCommand({ TableName: tableName }))
    } catch (err: any) {
        if (err.name === 'ResourceNotFoundException') {
            console.log(`Tabla '${tableName}' no existe. Creando...`)
            await ddbDocClient.send(
                new CreateTableCommand({
                    TableName: tableName,
                    KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
                    AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
                    BillingMode: 'PAY_PER_REQUEST',
                })
            )
            console.log(`Tabla '${tableName}' creada`)
        } else {
            console.error(`Error al verificar/crear tabla:`, err)
            throw err
        }
    }
}