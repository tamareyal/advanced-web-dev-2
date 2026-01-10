import dotenv from "dotenv";
import mongoose from "mongoose";
import startServer from "./index";

dotenv.config({ path: ".env.test" });

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mockdatabase";

beforeAll(async () => {
    // Start testing server
    const conn = await startServer(PORT, MONGO_URI);
    // Clear database before running tests
    if (conn) {
        await clearDatabase(conn);
    }
});

async function clearDatabase(connection: mongoose.Connection) {
    const collections = await connection.db?.collections();
    if (collections) {
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
}

