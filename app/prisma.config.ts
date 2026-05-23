// Prisma 7 config file
// Prisma 7 不再从根目录 .env 自动读 DATABASE_URL，需要显式配置

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "./prisma/migrations",
  },
});
