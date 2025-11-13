# API Structure
This document explains how to add routes to the backend and how the API architecture works.

## 1. Project structure
In backend: \

srcs/\
├─ server.ts    # Fastify server entrypoint\
├─ routes/\
│ ├─ index.ts   # Registers all route modules\
│ ├─ users.ts   # Example route group\
│ └─ ping.ts    # Example route group\
├─ db/\
│ ├─ schema.ts  # Drizzle ORM schema definitions\
│ └─ client.ts  # DB client instance\
├─ utils/       # Will hold usefull script for the api (ex: password hashing)


- `server.ts` → main Fastify server
- `routes/index.ts` → central registration of all routes
- `routes/*.ts` → route modules, each exporting an async function
- `db/schema.ts` → Drizzle tables and types
- `db/client.ts` → exports a configured `db` instance

---

## 2. Adding a New Route

1. Create a new file in `routes/` (e.g., `products.ts`):

2. Import the db if needed
```ts
import { db } from "../db/client"; 			// Import the whole db
import { products } from "../db/schema";	// Import specific table
```

3. Import types to protect your code
```ts
import { FastifyInstance, FastifyRequest } from "fastify";
```

4. Setup interfaces if your route need data as input.
Interfaces are used to type the variables your api request receive as input 
```ts
interface ProductBody {
  name: string;
  price: number;
}
```
5. Define your route and it's behaviour.
Don't forget to type your fastify elements and use your interfaces if needed.
```ts
export default async function productRoutes(fastify: FastifyInstance) {
  fastify.get("/api/products", async () => {
    return await db.select().from(products);
  });

  fastify.post("/api/products", async (req: FastifyRequest<{ Body: ProductBody }>) => {
    const { name, price } = req.body;
    await db.insert(products).values({ name, price });
    return { success: true };
  });
}
```
6. Register your route in routes/index.ts:
```ts
import productRoutes from "./products";

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(productRoutes);
}
```