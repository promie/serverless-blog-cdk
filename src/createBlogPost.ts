import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'
import { IBlogPost } from './types'
import { createBlog } from './services/blogService'

interface ICreateBlogPostRequest {
  title: string
  author: string
  content: string
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const partialBlogPost = JSON.parse(event.body!) as ICreateBlogPostRequest

  const id = uuid()
  const createdAt = new Date().toISOString()

  const blogPost: IBlogPost = {
    id,
    createdAt,
    ...partialBlogPost,
  }

  try {
    await createBlog(blogPost)
    return {
      statusCode: 201,
      body: JSON.stringify(blogPost),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
