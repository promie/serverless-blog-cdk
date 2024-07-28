import {
  GetCommand,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  DeleteCommand,
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

const getBlogPost = async (id: string) => {
  const result = await DocumentClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    }),
  )

  return (result.Item as IBlogPost) || null
}

const deleteBlogPost = async (id: string) => {
  await DocumentClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
    }),
  )
}

export { createBlog, listBlogPosts, getBlogPost, deleteBlogPost }
