import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayClient, GetExportCommand } from '@aws-sdk/client-api-gateway'
import { defaultHeaders } from './utils/headers'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const ui = event?.queryStringParameters?.ui

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

  if (!ui) {
    return {
      statusCode: 200,
      body: response,
      headers: defaultHeaders,
    }
  }

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="SwaggerUI"
    />
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
  </head>
  <body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: 'api-docs',
        dom_id: '#swagger-ui',
      });
    };
  </script>
  </body>
  </html>`

  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html',
    },
  }
}
