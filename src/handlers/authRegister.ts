import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { hashPassword } from '../auth/utils'
import { createUser, findUserByEmail, validate_table } from '../auth/db'

export const register = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    await validate_table()
    const { email, password } = JSON.parse(event.body || '{}')
    const existing = await findUserByEmail(email)
    if (existing) return { statusCode: 409, body: JSON.stringify({ error: 'User already exists' }) }
    const passwordHash = await hashPassword(password)
    await createUser(email, passwordHash)
    return { statusCode: 201, body: JSON.stringify({ message: 'User created' }) }
}


