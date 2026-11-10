import dotenv from "dotenv";
import path from "node:path";
import { readFileSync } from "node:fs";
import mariadb from "mariadb";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../prisma/generated/prisma/client/client";

dotenv.config({
  path: path.resolve(process.cwd(), "product-backend/.env"),
});

const databaseURL = process.env.DB_URL;

if (!databaseURL) {
  throw new Error("DB_URL is missing");
}

const db = new URL(databaseURL);

const pool = mariadb.createPool({
  host: db.hostname,
  port: Number(db.port),
  user: db.username,
  password: db.password,
  database: db.pathname.slice(1),

  connectionLimit: 5,
  connectTimeout: 10_000,
  acquireTimeout: 20_000,

  ssl: {
    ca: readFileSync(
      path.resolve(process.cwd(), "product-backend/certificate/ca.pem"),
    ),
  },
});
const adapter = new PrismaMariaDb(pool);

export const prisma = new PrismaClient({ adapter });

