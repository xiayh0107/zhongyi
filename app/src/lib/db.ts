// Prisma 7 + better-sqlite3 driver adapter
// Singleton in dev to avoid exhausting connections during hot-reload.

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

// SQLite URL is in the form `file:./dev.db` — strip the prefix for better-sqlite3
const dbFilePath = databaseUrl.startsWith("file:")
  ? databaseUrl.slice(5)
  : databaseUrl;

function createClient() {
  const adapter = new PrismaBetterSqlite3({ url: dbFilePath });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
