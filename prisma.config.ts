import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // This replaces `url = env("DATABASE_URL")` from schema.prisma
    url: env("DATABASE_URL"),
  },
});
