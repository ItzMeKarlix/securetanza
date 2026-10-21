/**
 * One set of input rules for the forms and the API (client-safe: no server
 * imports). The server is authoritative; forms use the same checks so people
 * see the problem before they submit.
 *
 * Two kinds of field:
 *  - Names and similar identifiers use an allow-list: letters (any language),
 *    spaces and a few punctuation marks. Anything else is rejected.
 *  - Free text is cleaned (invisible and control characters removed, spaces
 *    collapsed) and rejected if it contains `<` or `>`, so no markup is ever
 *    stored.
 *
 * React escapes what it renders and the email templates escape what they send,
 * so this is not the only defence against XSS — it keeps markup and invisible
 * characters out of the database, the audit log, exports and PDFs in the first
 * place.
 */
import { z } from "zod";

// C0/C1 control characters except tab and newline, which multiline text keeps.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
// Zero-width characters, soft hyphen, word joiner, BOM, and the bidirectional
// overrides that can make text display differently from what is stored.
const INVISIBLE = /[­​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;
const MARKUP = /[<>]/;

/** Normalised, without control or invisible characters. Single-line text also has its whitespace collapsed. */
export function cleanText(value: string, { multiline = false } = {}): string {
	let text = value.normalize("NFC").replace(INVISIBLE, "");
	if (multiline) {
		text = text.replace(/\r\n?/g, "\n").replace(CONTROL, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
	} else {
		text = text.replace(CONTROL, " ").replace(/\s+/g, " ");
	}
	return text.trim();
}

/**
 * For data imported from official workbooks: clean it and drop anything that
 * looks like markup instead of rejecting the whole row.
 */
export function cleanImportedText(value: unknown): string {
	return cleanText(String(value ?? ""))
		.replace(/<[^>]*>/g, " ")
		.replace(/[<>]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

export function containsMarkup(value: string): boolean {
	return MARKUP.test(value);
}

/** Letters (any script, with accents), then letters, spaces, period, apostrophe, comma or hyphen. */
export const PERSON_NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .,'’-]*$/u;
export const PERSON_NAME_MAX = 100;
export const PERSON_NAME_HINT = "Use letters, spaces, periods, commas, apostrophes and hyphens only.";

/** Null when the name is acceptable, otherwise the message to show. */
export function personNameProblem(raw: string): string | null {
	const name = cleanText(raw);
	if (name.length === 0) return "Full name is required.";
	if (name.length < 2) return "Full name is too short.";
	if (name.length > PERSON_NAME_MAX) return `Full name must be ${PERSON_NAME_MAX} characters or fewer.`;
	if (!PERSON_NAME_PATTERN.test(name) || !/[\p{L}]$|\.$/u.test(name)) return PERSON_NAME_HINT;
	return null;
}

export const personNameField = z
	.string()
	.max(PERSON_NAME_MAX * 2, `Full name must be ${PERSON_NAME_MAX} characters or fewer.`)
	.transform((value) => cleanText(value))
	.superRefine((value, ctx) => {
		const problem = personNameProblem(value);
		if (problem) ctx.addIssue({ code: "custom", message: problem });
	});

/** Free text: cleaned, bounded, and never containing `<` or `>`. */
export function safeTextField({ max, min = 0, label = "This field", multiline = false }: { max: number; min?: number; label?: string; multiline?: boolean }) {
	return z
		.string()
		.max(max * 2, `${label} must be ${max} characters or fewer.`)
		.transform((value) => cleanText(value, { multiline }))
		.superRefine((value, ctx) => {
			if (value.length < min) ctx.addIssue({ code: "custom", message: min <= 1 ? `${label} is required.` : `${label} is too short.` });
			else if (value.length > max) ctx.addIssue({ code: "custom", message: `${label} must be ${max} characters or fewer.` });
			else if (containsMarkup(value)) ctx.addIssue({ code: "custom", message: `${label} can't contain < or >.` });
		});
}

/** Optional free text where blank means "not provided". */
export function optionalSafeText(options: Parameters<typeof safeTextField>[0]) {
	return safeTextField({ ...options, min: 0 })
		.transform((value) => (value === "" ? null : value))
		.nullish();
}

/** Escape LIKE/ILIKE wildcards so a filter matches what was typed, literally. */
export function escapeLike(value: string): string {
	return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Clamp a numeric query parameter; anything unparseable becomes the fallback. */
export function intParam(value: string | null | undefined, fallback: number, min: number, max: number): number {
	const n = value === null || value === undefined || value === "" ? NaN : Number(value);
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, Math.trunc(n)));
}

/** A short, plain query value (filters such as barangay or crime type), or null. */
export function queryText(value: string | null | undefined, max = 120): string | null {
	if (value === null || value === undefined) return null;
	const text = cleanText(value).slice(0, max);
	return text && !containsMarkup(text) ? text : null;
}

/** A numeric route id ("42"), or null for anything else ("42abc", "-1", "1e3"). */
export function idParam(value: string): number | null {
	return /^[1-9]\d{0,8}$/.test(value) ? Number(value) : null;
}

/**
 * A download-safe file name: letters, digits, space, dot, underscore, hyphen
 * and brackets only, at most 120 characters, always ending in `extension`.
 */
export function safeFileName(raw: string, extension: string): string {
	const ext = extension.startsWith(".") ? extension : `.${extension}`;
	const base = cleanText(raw)
		.replace(/\.[A-Za-z0-9]{1,8}$/, "")
		.replace(/[^\p{L}\p{N} ._()-]+/gu, "-")
		.replace(/-{2,}/g, "-")
		.replace(/^[-. ]+|[-. ]+$/g, "")
		.slice(0, 120 - ext.length);
	return `${base || "file"}${ext}`;
}

/** An ISO-8601 date or date-time string that parses, or null. */
export function isoDateParam(value: unknown): string | null {
	if (typeof value !== "string" || value.length > 40 || !/^\d{4}-\d{2}-\d{2}([T ][\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/.test(value)) return null;
	return Number.isNaN(new Date(value).getTime()) ? null : value;
}

/** Long passphrases are welcome; this only stops a megabyte "password" reaching bcrypt and the strength checker. */
export const MAX_PASSWORD_LENGTH = 256;

/** A one-time code (authenticator, emailed or backup) as typed, or "" when it can't be one. */
export function codeParam(value: unknown): string {
	return typeof value === "string" && value.length <= 32 ? value : "";
}

/** The random part of an invite / reset link (32 bytes, base64url), or "" for anything else. */
export function linkTokenParam(value: unknown): string {
	return typeof value === "string" && /^[A-Za-z0-9_-]{20,100}$/.test(value) ? value : "";
}
