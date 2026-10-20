import nodemailer, { type Transporter } from "nodemailer";

/**
 * Outbound email over SMTP. Provider-agnostic: Google Workspace, Microsoft 365,
 * Brevo, Mailgun, SES SMTP… are all just different SMTP_* values.
 *
 *   SMTP_HOST, SMTP_PORT (default 587), SMTP_SECURE ("true" for 465),
 *   SMTP_USER, SMTP_PASS, MAIL_FROM ("Secure Tanza <no-reply@example.gov.ph>")
 *
 * Without SMTP_HOST in development, messages are printed to the server console
 * instead, so invite and reset links can be followed locally.
 */

export interface MailMessage {
	to: string;
	subject: string;
	text: string;
	html: string;
}

let transporter: Transporter | null = null;

function isConfigured() {
	return Boolean(process.env.SMTP_HOST);
}

function getTransporter(): Transporter {
	if (transporter) return transporter;
	const port = Number(process.env.SMTP_PORT || 587);
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port,
		secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
		auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
	});
	return transporter;
}

/** Sends one message. Returns false (and logs) on failure instead of throwing. */
export async function sendMail(message: MailMessage): Promise<boolean> {
	if (!isConfigured()) {
		if (process.env.NODE_ENV === "production") {
			console.error("[mail] SMTP_HOST is not set — cannot send:", message.subject, "to", message.to);
			return false;
		}
		console.info(
			`\n[mail:dev] To: ${message.to}\n[mail:dev] Subject: ${message.subject}\n${message.text}\n`
		);
		return true;
	}

	const from = process.env.MAIL_FROM;
	if (!from) {
		console.error("[mail] MAIL_FROM is not set — cannot send:", message.subject);
		return false;
	}

	try {
		await getTransporter().sendMail({ from, ...message });
		return true;
	} catch (error) {
		console.error("[mail] Failed to send", message.subject, "to", message.to, error);
		return false;
	}
}
