// Minimal IndexedDB access for the offline copies. Every call degrades to a
// no-op (or null) where IndexedDB is missing or blocked — private windows,
// tests, server rendering — so offline support is never a reason to fail.

const DB_NAME = "securetanza-offline";
const DB_VERSION = 1;

export type OfflineStore = "responses" | "session";

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  dbPromise ??= new Promise<IDBDatabase | null>((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("responses")) {
          db.createObjectStore("responses", { keyPath: "key" }).createIndex("savedAt", "savedAt");
        }
        if (!db.objectStoreNames.contains("session")) db.createObjectStore("session");
      };
      request.onsuccess = () => {
        const db = request.result;
        // Another tab upgrading the schema: let go so it isn't blocked.
        db.onversionchange = () => {
          db.close();
          dbPromise = null;
        };
        resolve(db);
      };
      request.onerror = request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  }).then((db) => {
    if (!db) dbPromise = null; // try again next time
    return db;
  });
  return dbPromise;
}

function run<T>(
  store: OfflineStore,
  mode: IDBTransactionMode,
  work: (objectStore: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | null> {
  return openDb().then(
    (db) =>
      new Promise<T | null>((resolve) => {
        if (!db) return resolve(null);
        try {
          const tx = db.transaction(store, mode);
          const request = work(tx.objectStore(store));
          tx.oncomplete = () => resolve(request ? request.result : null);
          tx.onerror = tx.onabort = () => resolve(null);
        } catch {
          resolve(null);
        }
      }),
  );
}

export function idbGet<T>(store: OfflineStore, key: string): Promise<T | null> {
  return run<T>(store, "readonly", (s) => s.get(key) as IDBRequest<T>).then((value) => value ?? null);
}

/** `key` only for stores without a keyPath (the session store). */
export async function idbPut(store: OfflineStore, value: unknown, key?: string): Promise<void> {
  await run(store, "readwrite", (s) => s.put(value, key));
}

export async function idbDelete(store: OfflineStore, key: string): Promise<void> {
  await run(store, "readwrite", (s) => s.delete(key));
}

export async function idbClear(store: OfflineStore): Promise<void> {
  await run(store, "readwrite", (s) => s.clear());
}

/**
 * Drops saved responses older than `olderThan`, then the oldest ones beyond
 * `maxEntries`. Walks keys only, so large bodies are never read back.
 */
export async function idbPruneResponses(olderThan: number, maxEntries: number): Promise<void> {
  await run("responses", "readwrite", (s) => {
    const index = s.index("savedAt");
    const expired = index.openKeyCursor(IDBKeyRange.upperBound(olderThan, true));
    expired.onsuccess = () => {
      const cursor = expired.result;
      if (cursor) {
        s.delete(cursor.primaryKey);
        cursor.continue();
        return;
      }
      const count = s.count();
      count.onsuccess = () => {
        let excess = count.result - maxEntries;
        if (excess <= 0) return;
        const oldest = index.openKeyCursor();
        oldest.onsuccess = () => {
          const next = oldest.result;
          if (!next || excess-- <= 0) return;
          s.delete(next.primaryKey);
          next.continue();
        };
      };
    };
  });
}
