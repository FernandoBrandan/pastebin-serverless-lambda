export interface IPaste {
    id?: number
    pasteId: string // unique , lenght 10
    title?: string // 255
    content: string  // text
    contentType: string // text/plain', 'application/json', 'text/javascript
    expireType?: '1h' | '1d' | '1w' | '1m' | 'never'
    expiresAt?: string
    visibility: 'public' | 'unlisted' | 'private'
    createdAt: string
    updatedAt: string
}

// 1d need login
// 1w / 1m to persist should purchase
// to greater than 1MB should purchase


