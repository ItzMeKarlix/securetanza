/// <reference lib="webworker" />
/**
 * Runs zxcvbn off the main thread. Building its dictionaries and scoring a
 * password (with fuzzy matching) takes long enough to freeze typing if done
 * on the page itself.
 */
import { estimatePassword } from "./password-policy";

type Request = { id: number; password: string; userInputs: string[] };

self.onmessage = async (event: MessageEvent<Request>) => {
	const { id, password, userInputs } = event.data;
	try {
		const estimate = await estimatePassword(password, userInputs);
		self.postMessage({ id, ok: true, estimate });
	} catch (error) {
		self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : String(error) });
	}
};
