// Imported first by worker.ts. ES imports all run before a module's own code,
// so loading .env inside worker.ts came after Prisma had already initialised
// without DATABASE_URL — and the worker exited on start.
import { config } from 'dotenv';

// Load .env.local first (standard for Next.js), then fall back to .env.
config({ path: '.env.local', quiet: true });
config({ path: '.env', quiet: true });
