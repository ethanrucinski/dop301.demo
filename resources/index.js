const {
    BatchWriteItemCommand,
    DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

async function main() {
    process.env.AWS_PROFILE = "dop";

    // Get table name
    const clientSSM = new SSMClient();
    const tableNameParameter = await clientSSM.send(
        new GetParameterCommand({
            Name: "TableName",
        })
    );
    const tableName = tableNameParameter.Parameter.Value;

    // Create write items command
    const users = require("./users.json");
    const requestItems = {};
    requestItems[tableName] = users.map((user) => {
        return {
            PutRequest: {
                Item: {
                    UserName: {
                        S: user.UserName,
                    },
                    City: {
                        S: user.City,
                    },
                },
            },
        };
    });
    const command = new BatchWriteItemCommand({
        RequestItems: requestItems,
    });

    // Send command
    const clientDynamo = new DynamoDBClient();
    await clientDynamo.send(command);
}

main();
