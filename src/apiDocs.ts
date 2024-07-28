import { APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayClient, GetExportCommand } from '@aws-sdk/client-api-gateway'

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const apiGatewayClient = new APIGatewayClient({
    region: process.env.AWS_REGION || 'ap-southeast-2',
  } as any)
  const restApiId = process.env.API_ID!

  const getExportCommand: any = new GetExportCommand({
    restApiId,
    exportType: 'swagger',
    accepts: 'application/json',
    stageName: 'prod',
  })

  const api: any = await apiGatewayClient.send(getExportCommand)
  const response = Buffer.from(api.body as string, 'base64').toString('utf-8')

  return {
    statusCode: 200,
    body: response,
  }
}
