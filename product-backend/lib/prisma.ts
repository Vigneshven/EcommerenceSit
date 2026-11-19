import dotenv from "dotenv";
import path from "node:path";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../prisma/generated/prisma/client/client";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const databaseURL = process.env.DB_URL;

if (!databaseURL) {
  throw new Error("DB_URL is missing");
}

const db = new URL(databaseURL);

const adapter = new PrismaMariaDb({
  host: db.hostname,
  port: db.port ? Number(db.port) : 3306,
  user: decodeURIComponent(db.username),
  password: decodeURIComponent(db.password),
  database: decodeURIComponent(db.pathname.slice(1)),

  connectionLimit: 5,
  connectTimeout: 10_000,
  acquireTimeout: 20_000,

  // For hosted databases that require SSL, uncomment and provide the CA:
  // ssl: { ca: readFileSync(path.resolve(process.cwd(), "certificate/ca.pem")) },
});

export const prisma = new PrismaClient({ adapter });
