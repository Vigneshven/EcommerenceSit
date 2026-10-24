import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

const backendDir = path.resolve(__dirname, "..");

dotenv.config({
  path: path.join(backendDir, ".env"),
});

const caPath = path.resolve(
  backendDir,
  process.env.DB_CA_PATH ?? "certificate/ca.pem",
);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(caPath, "utf8"),
    rejectUnauthorized: true,
  },
});

export default pool;
