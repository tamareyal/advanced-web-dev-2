import dotenv from "dotenv";
import startServer from "./index";

dotenv.config({ path: ".env" });

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

async function main() {
  await startServer(PORT, MONGO_URI);
}

main().catch(() => {
  process.exit(1);
});