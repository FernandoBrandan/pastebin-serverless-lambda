import * as Minio from 'minio'

export const clientMinio = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
    secretKey: process.env.MINIO_SECRET_KEY || 'minio123',
})


export const validateBucket = async () => {
    const bucketName = 'pastes'
    const exists = await clientMinio.bucketExists(bucketName)
    if (!exists) {
        await clientMinio.makeBucket(bucketName)
        console.log(`Bucket '${bucketName}' creado`)
    }
}