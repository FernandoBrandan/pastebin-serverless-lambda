import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const ddbClient = new DynamoDBClient({
    region: "us-east-1",
    endpoint: "http://localhost:4566",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
})

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)
