/* 
- Contenido no vacío
- Tamaño máximo del archivo
- Sanitización de contenido malicioso
*/

// import * as sanitizeHtml from 'sanitize-html'
// import xss from 'xss'

export const validateContent = (content: string) => {
    if (validate_empty(content) && validate_size(content)) {
        const contentClean: string = escapeHtml(sanitize(content))
        return { error: false, contentClean }
    }
    return { error: true, content: 'Error in content text main' }
}

export const validateContentType = (contentType: string): boolean => {
    const allowedTypes = ['text/plain', 'application/json', 'text/javascript']
    return allowedTypes.includes(contentType)
}


export const validateExpiry = (type: string): string => {
    let expiresAt: Date
    const now = new Date()
    switch (type) {
        case '1h':
            expiresAt = new Date(now.getTime() + 3600 * 1000)
            break
        case '1d':
            expiresAt = new Date(now.getTime() + 24 * 3600 * 1000)
            break
        case '1w':
            expiresAt = new Date(now.getTime() + 7 * 24 * 3600 * 1000)
            break
        case '1m':
            expiresAt = new Date(now.setMonth(now.getMonth() + 1))
            break
        case 'never':
        default:
            expiresAt = now
            break
    }

    return expiresAt.toISOString()
}

const validate_empty = (content: string): boolean => {
    return true
}

function validate_size(content: string, maxSizeMB: number = 1): boolean {
    const sizeInBytes = Buffer.byteLength(content, 'utf8')
    const maxSizeInBytes = maxSizeMB * 1024 * 1024
    return sizeInBytes <= maxSizeInBytes
}

const escapeHtml = (content: string): string => {
    return content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}


const sanitize = (content: string): string => {
    // return sanitizeHtml(content, {
    //     allowedTags: ["b", "i", "em", "strong", "code", "pre", "a"],
    //     allowedAttributes: {
    //         a: ["href", "target"],
    //     },
    //     allowedSchemes: ["http", "https", "mailto"],
    // })

    return content
}