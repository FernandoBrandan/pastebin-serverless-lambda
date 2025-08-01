export interface IUser {
    email: string
    password_hash: string
    plan: 'free' | 'premium'
}
