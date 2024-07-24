import { aws_lambda_nodejs, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class ServerlessBlogCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
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

    console.info(createBlogPostLambda)
  }
}
