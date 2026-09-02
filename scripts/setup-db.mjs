import { existsSync, readFileSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));

function loadEnvFile() {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) return;

  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^"(.*)"$/, "$1");
  }
}

function sqlitePathFromDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl?.startsWith("file:")) return null;
  const sqlitePath = databaseUrl.slice("file:".length);
  return sqlitePath.startsWith("/") ? sqlitePath : resolve(root, "prisma", sqlitePath);
}

loadEnvFile();

if (process.argv.includes("--reset")) {
  const sqlitePath = sqlitePathFromDatabaseUrl();
  if (sqlitePath && existsSync(sqlitePath)) {
    await unlink(sqlitePath);
  }
}

const db = new PrismaClient();

const statements = [
  `CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL,
    household TEXT NOT NULL DEFAULT '',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS User_email_key ON User(email)`,
  `CREATE TABLE IF NOT EXISTS Page (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    imageUrl TEXT NOT NULL DEFAULT '',
    updatedAt DATETIME NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS Page_slug_key ON Page(slug)`,
  `CREATE TABLE IF NOT EXISTS Ministry (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    imageUrl TEXT NOT NULL DEFAULT '',
    sortOrder INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS Ministry_slug_key ON Ministry(slug)`,
  `CREATE TABLE IF NOT EXISTS ChurchEvent (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '4211 Carol Ave, Fremont, CA 94538',
    startsAt DATETIME NOT NULL,
    endsAt DATETIME,
    imageUrl TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ChurchEvent_slug_key ON ChurchEvent(slug)`,
  `CREATE TABLE IF NOT EXISTS Sermon (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    youtubeId TEXT NOT NULL,
    preacher TEXT NOT NULL DEFAULT 'GSSAM Fremont',
    language TEXT NOT NULL DEFAULT 'Telugu, Hindi, English',
    preachedAt DATETIME NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS GalleryImage (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL,
    album TEXT NOT NULL DEFAULT 'Congregation',
    placement TEXT NOT NULL DEFAULT 'gallery',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS Inquiry (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS FinanceEntry (
    id TEXT PRIMARY KEY NOT NULL,
    memberId TEXT,
    kind TEXT NOT NULL,
    amountCents INTEGER NOT NULL,
    occurredOn DATETIME NOT NULL,
    category TEXT NOT NULL,
    memo TEXT NOT NULL DEFAULT '',
    scope TEXT NOT NULL,
    isDemo BOOLEAN NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FinanceEntry_memberId_fkey FOREIGN KEY (memberId) REFERENCES User(id) ON DELETE SET NULL ON UPDATE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS WeeklyBulletin (
    id TEXT PRIMARY KEY NOT NULL,
    weekOf DATETIME NOT NULL,
    title TEXT NOT NULL,
    scripture TEXT NOT NULL DEFAULT '',
    worshipNotes TEXT NOT NULL DEFAULT '',
    announcements TEXT NOT NULL DEFAULT '',
    offeringTotalCents INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

try {
  for (const statement of statements) {
    await db.$executeRawUnsafe(statement);
  }
  console.log("SQLite tables are ready.");
} finally {
  await db.$disconnect();
}
