import { APIGatewayProxyResult } from 'aws-lambda'
import { listBlogPosts } from './services/blogService'
import { defaultHeaders } from './utils/headers'

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const blogPosts = await listBlogPosts()
    return {
      statusCode: 200,
      body: JSON.stringify(blogPosts),
      headers: defaultHeaders,
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
