import 'dotenv/config';
import Fastify from 'fastify';
import { db, users } from './db';
import { eq } from 'drizzle-orm';

const fastify = Fastify({ logger: true });

// API Routes
fastify.register(async (instance) => {
  instance.get('/health', async () => ({ 
    status: 'ok',
    timestamp: new Date().toISOString() 
  }));
  
  instance.get('/ping', async () => ({ 
    pong: 'pong',
    message: '🏓 3D Pong API is running!' 
  }));

  
  
  // Simple database test - create, read, update, delete a test user
  // instance.get('/db-test', async () => {
  //   try {
  //     // Create test user
  //     const testUser = {
  //       username: `test_${Date.now()}`,
  //       email: `test${Date.now()}@example.com`,
  //       avatar_url: 'https://i.pravatar.cc/150',
  //     };

  //     const [created] = await db.insert(users).values(testUser).returning();
      
  //     // Read user
  //     const [found] = await db.select().from(users).where(eq(users.id, created.id));
      
  //     // Update user
  //     await db.update(users)
  //       .set({ username: `${testUser.username}_updated` })
  //       .where(eq(users.id, created.id));
      
  //     // Get count
  //     const allUsers = await db.select().from(users);
      
  //     // Delete test user
  //     await db.delete(users).where(eq(users.id, created.id));
      
  //     return {
  //       status: 'connected',
  //       message: 'Database CRUD operations successful',
  //       test: {
  //         created: created.id,
  //         found: found?.username,
  //         totalUsers: allUsers.length,
  //       }
  //     };
  //   } catch (error: any) {
  //     return {
  //       status: 'error',
  //       message: error.message,
  //     };
  //   }
  // });
}, { prefix: '/api' });

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

fastify.listen({ port, host }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});

