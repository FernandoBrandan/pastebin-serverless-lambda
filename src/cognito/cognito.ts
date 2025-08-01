// login
import { InitiateAuthCommand, CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider"
const client = new CognitoIdentityProviderClient({ region: "us-east-1" })
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || ''

export const login = async (event) => {
    const { email, password } = JSON.parse(event.body)

    const cmd = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password }
    })

    const result = await client.send(cmd)
    return { statusCode: 200, body: JSON.stringify({ token: result.AuthenticationResult.IdToken }) }
}

// Usuario se registra con email / password vía Cognito.
// Cognito devuelve un JWT.
// Cliente guarda token y lo usa en Authorization: Bearer <token>.
// API Gateway valida ese JWT con Cognito.

export const register = async (event) => {
    const { email, password } = JSON.parse(event.body)
    const cmd = new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID, Username: email, Password: password,
    })
    await client.send(cmd)
    return { statusCode: 201 }
}
