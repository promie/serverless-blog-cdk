import {
  PutCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { DocumentClient } from '../lib/dynamodb'
import { IBlogPost } from '../types'

const tableName = process.env.TABLE_NAME || 'Blogs'

const createBlog = async (blog: IBlogPost) => {
  await DocumentClient.send(
    new PutCommand({
      TableName: tableName,
      Item: blog,
    }),
  )
}

const listBlogPosts = async (): Promise<IBlogPost[]> => {
  const { Items } = await DocumentClient.send(
    new ScanCommand({
      TableName: tableName,
    } as ScanCommandInput),
  )

  return Items as IBlogPost[]
}

export { createBlog, listBlogPosts }
