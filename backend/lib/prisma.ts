import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	pgPool: Pool | undefined;
	pgKeepWarm: ReturnType<typeof setInterval> | undefined;
};

/** A cold connection to a remote database costs ~0.5-0.9 s (TCP + TLS + auth). */
const IDLE_TIMEOUT_MS = 10 * 60_000;
const KEEP_WARM_EVERY_MS = 25_000;
/** Connections kept open so a request (or two concurrent queries) never pays that cost. */
const KEEP_WARM_CONNECTIONS = 2;

function getOrCreatePool(): Pool {
	if (globalForPrisma.pgPool) {
		return globalForPrisma.pgPool;
	}

	let connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		try {
			// Fallback for standalone scripts/workers running outside Next.js runtime
			// const { config } = require("dotenv");
			// config({ path: ".env.local" });
			// config({ path: ".env" });
			connectionString = process.env.DATABASE_URL;
		} catch {}
	}

	if (!connectionString) {
		throw new Error("DATABASE_URL environment variable is not set");
	}

	const pool = new Pool({
		connectionString,
		max: 10,
		// Was 30 s: any quiet spell dropped every connection, and the next person to
		// sign in waited for a brand-new one.
		idleTimeoutMillis: IDLE_TIMEOUT_MS,
		connectionTimeoutMillis: 10_000,
		keepAlive: true,
	});

	pool.on("error", (err) => {
		console.error("Unexpected error on idle pg client pool:", err);
	});

	globalForPrisma.pgPool = pool;
	startKeepWarm(pool);
	return pool;
}

/**
 * Pings a couple of connections on a timer so they stay open (and stay open on
 * the pooler's side too). unref'd, so scripts and tests still exit normally.
 */
function startKeepWarm(pool: Pool) {
	if (globalForPrisma.pgKeepWarm) clearInterval(globalForPrisma.pgKeepWarm);
	const ping = () =>
		Promise.all(Array.from({ length: KEEP_WARM_CONNECTIONS }, () => pool.query("SELECT 1"))).catch(() => {});
	void ping();
	const timer = setInterval(ping, KEEP_WARM_EVERY_MS);
	timer.unref?.();
	globalForPrisma.pgKeepWarm = timer;
}

function createPrismaClient(): PrismaClient {
	const pool = getOrCreatePool();
	const adapter = new PrismaPg(pool);
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

export async function disconnectPrisma(): Promise<void> {
	try {
		await prisma.$disconnect();
	} catch (e) {
		console.error("Error disconnecting Prisma client:", e);
	}
	if (globalForPrisma.pgKeepWarm) {
		clearInterval(globalForPrisma.pgKeepWarm);
		globalForPrisma.pgKeepWarm = undefined;
	}
	if (globalForPrisma.pgPool) {
		try {
			await globalForPrisma.pgPool.end();
			globalForPrisma.pgPool = undefined;
		} catch (e) {
			console.error("Error ending pg pool:", e);
		}
	}
}

export function getPoolStats() {
	const pool = globalForPrisma.pgPool;
	if (!pool) {
		return {
			max: 10,
			totalCount: 0,
			idleCount: 0,
			waitingCount: 0,
			activeCount: 0,
		};
	}
	const total = pool.totalCount ?? 0;
	const idle = pool.idleCount ?? 0;
	const active = Math.max(0, total - idle);
	return {
		max: 10,
		totalCount: total,
		idleCount: idle,
		waitingCount: pool.waitingCount ?? 0,
		activeCount: active,
	};
}
