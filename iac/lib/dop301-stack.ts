import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { DockerImageCode, DockerImageFunction, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';


export class Dop301Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "Table", {
      partitionKey: {
        name: "UserName",
        type: AttributeType.STRING
      },
      removalPolicy: RemovalPolicy.DESTROY
    })

    new StringParameter(this, "TableName", {
      parameterName: "TableName",
      stringValue: table.tableName
    })

    const getUsersFunction = new DockerImageFunction(this, "GetUsersFunction", {
      code: DockerImageCode.fromImageAsset("../get-users"),
      environment: {
        TABLE_NAME: table.tableName
      }
    })

    table.grantReadData(getUsersFunction)

    getUsersFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE
    })

  }
}
