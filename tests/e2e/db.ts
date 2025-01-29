import { Client } from "@app/clients/entity/client.entity.js";
import { CreateTableCommand, DeleteTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const db = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
});

const ddb = DynamoDBDocumentClient.from(db, { marshallOptions: { convertClassInstanceToMap: true } });


export async function cleanDb(): Promise<void> {
  try {
    await db.send(new DeleteTableCommand({ TableName: 'clients' }));
  } catch (err) {
    console.warn('not deleting table as it not exists:\n' + err.message);
  }
  await db.send(new CreateTableCommand({
    TableName: 'clients',
    AttributeDefinitions: [{ AttributeName: 'clientId', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'clientId', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST'
  }));
}

export async function insertClients(clients: Client[]): Promise<void> {
  await Promise.all(clients.map(Item =>
    ddb.send(new PutCommand({ TableName: 'clients', Item }))
  ));
}

export async function listClients(): Promise<Client[]> {
  const res = await ddb.send(new ScanCommand({ TableName: 'clients' }));

  return res.Items.map(r => {
    const c = Client.parseFromJson(r);
    c.clientId = r.clientId;
    return c;
  })
}
