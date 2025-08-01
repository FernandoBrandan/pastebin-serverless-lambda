import { APIGatewayProxyEvent } from "aws-lambda"
import { findUserByEmail } from "./db"
import { verifyJwt } from "./utils"

export const getUserFromAuth = (event: APIGatewayProxyEvent) => {
    const auth = event.headers.Authorization || event.headers.authorization || ''
    const token = auth.split(' ')[1]
    const payload = verifyJwt(token)
    if (!payload || typeof payload !== 'object') return null
    return { userId: payload.userId }
}

export const isPremiumUser = async (email: string): Promise<boolean> => {
    const user = await findUserByEmail(email)
    return user?.plan === 'premium'
} 