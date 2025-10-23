import { drizzle } from 'drizzle-orm/libsql';
import "dotenv/config";
import * as schema from './schema';

export const db = drizzle(process.env.DB_FILE_NAME!, { schema });

export * from './schema';

