import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { comparePassword, signJwt } from '../auth/utils'
import { findUserByEmail, validate_table } from '../auth/db'

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email, password } = JSON.parse(event.body || '{}')

        await validate_table()


        const user = await findUserByEmail(email)
        if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) }

        const valid = await comparePassword(password, user.password_hash)
        if (!valid) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) }

        const token = signJwt({ useremail: user.email })
        if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'Error to genete token' }) }

        return { statusCode: 200, body: JSON.stringify({ token }) }

    } catch (err) {
        console.error('Error en Lambda:', err)
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) }
    }
}