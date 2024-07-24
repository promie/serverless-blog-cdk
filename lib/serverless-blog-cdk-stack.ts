import {
  aws_lambda_nodejs,
  aws_apigateway,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class ServerlessBlogCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const api = new aws_apigateway.RestApi(this, 'blogPostApi')

    const createBlogPostLambdaName = 'createBlogPostHandler'
    const createBlogPostLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      createBlogPostLambdaName,
      {
        entry: 'lib/blog-post-handler.ts',
        handler: createBlogPostLambdaName,
        functionName: createBlogPostLambdaName,
      },
    )

    const blogPostPath = api.root.addResource('blogposts')

    blogPostPath.addMethod(
      'POST',
      new aws_apigateway.LambdaIntegration(createBlogPostLambda),
    )
  }
}
