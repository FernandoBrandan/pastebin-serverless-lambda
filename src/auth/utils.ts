import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// ========== UTILIDADES JWT ==========
export const signJwt = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyJwt = (token: string): any => {
    try { return jwt.verify(token, JWT_SECRET) } catch (err) { return null }
}

// ========== UTILIDADES PASSWORD ==========

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {
    return bcrypt.compare(password, passwordHash)
}

