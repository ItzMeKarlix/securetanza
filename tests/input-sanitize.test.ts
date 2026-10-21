import { test } from "node:test";
import assert from "node:assert/strict";
import {
	cleanImportedText,
	cleanText,
	escapeLike,
	idParam,
	intParam,
	isoDateParam,
	linkTokenParam,
	personNameField,
	personNameProblem,
	queryText,
	safeFileName,
	safeTextField,
} from "../lib/input-sanitize";
import { isValidEmail } from "../lib/email-address";

test("real names are accepted, including Filipino and accented ones", () => {
	for (const name of ["Juan Dela Cruz", "Ma. Teresa Santos-Reyes", "José Rizal", "Nuñez, Jr.", "O'Brien", "Ana", "Joaquín Ñ. de los Santos"]) {
		assert.equal(personNameProblem(name), null, name);
	}
});

test("names with markup, symbols, digits or invisible characters are rejected", () => {
	for (const name of ["<script>alert(1)</script>", "Juan <b>Cruz</b>", "Robert'); DROP TABLE users;--", "=HYPERLINK(\"x\")", "John123", "a", "-Juan", "Juan@Cruz", "{{7*7}}"]) {
		assert.notEqual(personNameProblem(name), null, name);
	}
});

test("the API name field returns the cleaned name", () => {
	assert.equal(personNameField.parse("  Juan   Dela​ Cruz \n"), "Juan Dela Cruz");
	assert.equal(personNameField.safeParse("<img src=x onerror=alert(1)>").success, false);
	// Invisible direction overrides are removed, never stored.
	assert.equal(personNameField.parse("Juan\u202Eesrever"), "Juanesrever");
});

test("cleanText removes control, zero-width and bidi characters", () => {
	assert.equal(cleanText("a\u0000b​c‮d﻿"), "a bcd");
	assert.equal(cleanText("line one\r\n\r\n\r\nline two", { multiline: true }), "line one\n\nline two");
});

test("free text rejects angle brackets", () => {
	const field = safeTextField({ max: 50, label: "Details" });
	assert.equal(field.parse(" Brgy. Amaya I (Q3) "), "Brgy. Amaya I (Q3)");
	assert.equal(field.safeParse("<svg onload=alert(1)>").success, false);
	assert.equal(field.safeParse("x".repeat(51)).success, false);
});

test("imported workbook text drops markup instead of failing the row", () => {
	assert.equal(cleanImportedText("Theft <script>x</script> (Art. 308)"), "Theft x (Art. 308)");
	assert.equal(cleanImportedText("<b>"), "");
	assert.equal(cleanImportedText(12345), "12345");
});

test("email addresses: ordinary ones pass, injection attempts fail", () => {
	assert.equal(isValidEmail("name@example.gov.ph"), true);
	assert.equal(isValidEmail("first.last+pnp@cvsu.edu.ph"), true);
	for (const bad of ["<script>@x.com", "a\"b@x.com", "a b@x.com", "a@b", "a..b@x.com", "a@x.com>", "javascript:alert(1)@x.com"]) {
		assert.equal(isValidEmail(bad), false, bad);
	}
});

test("query helpers clamp and clean", () => {
	assert.equal(intParam("99999", 100, 1, 500), 500);
	assert.equal(intParam("abc", 100, 1, 500), 100);
	assert.equal(intParam("-5", 0, 0, 10), 0);
	assert.equal(queryText("  Amaya  I "), "Amaya I");
	assert.equal(queryText("<x>"), null);
	assert.equal(escapeLike("50%_off\\"), "50\\%\\_off\\\\");
	assert.equal(idParam("42"), 42);
	for (const bad of ["42abc", "0", "-1", "1e3", "", "4294967296000"]) assert.equal(idParam(bad), null, bad);
	assert.equal(isoDateParam("2026-10-21T00:00:00.000Z"), "2026-10-21T00:00:00.000Z");
	assert.equal(isoDateParam("garbage"), null);
	assert.equal(linkTokenParam("abc'; DROP"), "");
});

test("file names are safe for a download header", () => {
	assert.equal(safeFileName('report"\r\nSet-Cookie: x.pdf', ".pdf"), "report- Set-Cookie- x.pdf");
	assert.equal(safeFileName("../../etc/passwd", "pdf"), "etc-passwd.pdf");
	assert.equal(safeFileName("", ".pdf"), "file.pdf");
});
