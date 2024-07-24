import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { IBlogPost } from './types'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const partialBlogPost = JSON.parse(event.body || '{}') as Partial<IBlogPost>

  return {
    statusCode: 201,
    body: JSON.stringify(partialBlogPost),
  }
}
