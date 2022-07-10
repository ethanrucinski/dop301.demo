const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

exports.handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));

    // Get username
    let body, username;
    try {
        body = JSON.parse(event.body);
        username = body.username;
    } catch (err) {
        return {
            error: `Could not parse input ${err}`,
        };
    }

    // Send command
    let result;
    try {
        const clientDynamo = new DynamoDBClient();
        const command = new GetItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                UserName: {
                    S: username,
                },
            },
        });
        result = await clientDynamo.send(command);
    } catch (err) {
        return {
            error: `Could not retrieve user ${err}`,
        };
    }


    try {
        const response =  {
            username: result.Item.UserName.S,
            city: result.Item.City.S
        }
        return response;
    } catch (err) {
        return {
            error: `Could not process user ${err}`,
        };
    }

    
};
