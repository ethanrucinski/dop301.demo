import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { AccountPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


export class Dop301Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "Table", {
      partitionKey: {
        type: AttributeType.STRING,
        name: "UserName"
      }
    })

    const role = new Role(this, "Role", {
      assumedBy: new AccountPrincipal(this.account)
    })

    table.grantReadData(role)
  }
}
