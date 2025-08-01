import * as Minio from 'minio'
export const clientMinio = new Minio.Client({
    endPoint: 'localhost', //minio
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: 'minio123',
})

export const validateBucket = async () => {
    const bucketName = 'pastes'
    const exists = await clientMinio.bucketExists(bucketName)
    if (!exists) {
        await clientMinio.makeBucket(bucketName)
        console.log(`Bucket '${bucketName}' creado`)
    }
}