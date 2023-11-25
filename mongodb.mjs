import {MongoClient } from "mongodb"
import "dotenv/config"

const mongoDbUri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ycsrpox.mongodb.net/?retryWrites=true&w=majority`


export const client = new MongoClient(mongoDbUri);

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err);
        await client.close();
        process.exit(1)
    }
}
run().catch(console.dir);

process.on('SIGINT', async function () {
    console.log("app is terminating");
    await client.close();
    process.exit(0);
});