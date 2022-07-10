import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
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
    })

    new StringParameter(this, "TableName", {
      parameterName: "TableName",
      stringValue: table.tableName
    })

    

  }
}
