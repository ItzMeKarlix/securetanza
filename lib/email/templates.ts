import type { MailMessage } from "./mailer";

/* Plain, table-free emails: one heading, a sentence or two, one button, and
   the raw link for clients that strip buttons. Every message also explains
   what to do if it wasn't expected. */

const APP_NAME = "Secure Tanza";

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function layout(title: string, paragraphs: string[], action?: { label: string; url: string }, footnote?: string) {
	const body = paragraphs.map((p) => `<p style="margin:0 0 14px;line-height:1.55">${escapeHtml(p)}</p>`).join("");
	const button = action
		? `<p style="margin:22px 0"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:600;padding:11px 18px;border-radius:6px">${escapeHtml(action.label)}</a></p>
<p style="margin:0 0 14px;font-size:13px;color:#475569;line-height:1.5">Or paste this link into your browser:<br><span style="word-break:break-all">${escapeHtml(action.url)}</span></p>`
		: "";
	const foot = footnote
		? `<p style="margin:22px 0 0;font-size:13px;color:#64748b;line-height:1.5">${escapeHtml(footnote)}</p>`
		: "";
	const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:28px">
<p style="margin:0 0 18px;font-size:13px;font-weight:600;color:#0369a1">${APP_NAME}</p>
<h1 style="margin:0 0 16px;font-size:20px">${escapeHtml(title)}</h1>
${body}${button}${foot}
</div></body></html>`;

	const text = [
		title,
		"",
		...paragraphs.flatMap((p) => [p, ""]),
		...(action ? [`${action.label}: ${action.url}`, ""] : []),
		...(footnote ? [footnote] : []),
	].join("\n");

	return { html, text };
}

function hours(ms: number) {
	const h = Math.round(ms / 3_600_000);
	return h === 1 ? "1 hour" : `${h} hours`;
}

export function inviteEmail(to: string, fullName: string, url: string, ttlMs: number): MailMessage {
	const subject = `You've been given access to ${APP_NAME}`;
	return {
		to,
		subject,
		...layout(
			`Welcome, ${fullName}`,
			[
				`An administrator created a ${APP_NAME} account for you. Set your password to finish signing up — you'll sign in with this email address.`,
				`This link works once and expires in ${hours(ttlMs)}.`,
			],
			{ label: "Set your password", url },
			"If you weren't expecting this, you can ignore this email — no account access is granted until a password is set."
		),
	};
}

export function resetEmail(
	to: string,
	fullName: string,
	url: string,
	ttlMs: number,
	reason: "requested" | "unlocked"
): MailMessage {
	const intro =
		reason === "unlocked"
			? "An administrator unlocked your account after repeated failed sign-in attempts. Your previous password no longer works — choose a new one to sign in again."
			: "Someone asked to reset the password for your account. If that was you, choose a new password below.";
	return {
		to,
		subject: reason === "unlocked" ? `Your ${APP_NAME} account was unlocked` : `Reset your ${APP_NAME} password`,
		...layout(
			`Hi ${fullName}`,
			[intro, `This link works once and expires in ${hours(ttlMs)}.`],
			{ label: "Choose a new password", url },
			reason === "unlocked"
				? "If you didn't make those sign-in attempts, tell your administrator — someone may be trying to get into your account."
				: "If you didn't ask for this, ignore this email; your password stays the same."
		),
	};
}

export function passwordChangedEmail(to: string, fullName: string, loginUrl: string): MailMessage {
	return {
		to,
		subject: `Your ${APP_NAME} password was changed`,
		...layout(
			`Hi ${fullName}`,
			[
				`The password for your ${APP_NAME} account was just changed, and any other signed-in sessions were signed out.`,
			],
			{ label: "Sign in", url: loginUrl },
			"If you didn't do this, contact your system administrator immediately."
		),
	};
}

export function emailChangedEmail(to: string, fullName: string, newEmail: string): MailMessage {
	return {
		to,
		subject: `Your ${APP_NAME} sign-in email was changed`,
		...layout(
			`Hi ${fullName}`,
			[
				`An administrator changed the sign-in email for your ${APP_NAME} account to ${newEmail}. From now on, sign in with that address.`,
			],
			undefined,
			"If you didn't expect this, contact your system administrator."
		),
	};
}
