import Fastify from 'fastify';
import path from 'node:path';
import fs from 'node:fs';
import sqlite3 from 'sqlite3';

const fastify = Fastify({ logger: true });

// Ensure data directory exists for SQLite file storage
const dataDir = process.env.DATA_DIR || '/data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbFilePath = path.join(dataDir, 'app.db');

sqlite3.verbose();
const db = new sqlite3.Database(dbFilePath);

// Initialize a tiny table to verify DB works
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS healthcheck (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL)');
  db.run('INSERT INTO healthcheck (created_at) VALUES (datetime("now"))');
});

// Group API under /api to match nginx proxy_pass
fastify.register(async (instance) => {
  instance.get('/health', async () => ({ status: 'ok' }));
  instance.get('/ping', async () => ({ pong: '3d' }));
}, { prefix: '/api' });

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

fastify.listen({ port, host }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});

