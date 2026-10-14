import { test } from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { PrismaClient } from "../backend/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const base = process.env.TEST_BASE_URL;
const httpTest = base && process.env.TEST_DATABASE_URL ? test : test.skip;

httpTest(
  "authenticated upload isolates invalid rows, tracks Excel rows and preserves source labels",
  async () => {
    const target = new URL(base!);
    assert.ok(
      ["127.0.0.1", "localhost"].includes(target.hostname),
      "HTTP write tests require a local test server",
    );
    const database = new URL(process.env.TEST_DATABASE_URL!);
    assert.ok(
      database.pathname.startsWith("/securetanza_offense_test"),
      "Use the isolated test database",
    );
    const client = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.TEST_DATABASE_URL,
      }),
    });
    try {
      const permission = await client.permission.upsert({
        where: { permissionName: "admin" },
        create: { permissionName: "admin" },
        update: {},
      });
      const user = await client.user.upsert({
        where: { accountNumber: "offense-test-admin" },
        create: {
          accountNumber: "offense-test-admin",
          fullName: "Offense Test Admin",
          passwordHash: await hash("offense-test-password", 4),
        },
        update: {},
      });
      await client.userPermission.upsert({
        where: {
          userId_permissionId: { userId: user.id, permissionId: permission.id },
        },
        create: { userId: user.id, permissionId: permission.id },
        update: {},
      });
    } finally {
      await client.$disconnect();
    }
    const login = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountNumber: "offense-test-admin",
        password: "offense-test-password",
      }),
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie")!.split(";")[0];
    const headers = { Cookie: cookie };
    const all = await (await fetch(`${base}/api/crimes?limit=2000`)).json();
    for (const row of all.data.filter((r: { blotterNo: string }) =>
      r.blotterNo?.startsWith("http-fixture-"),
    )) {
      assert.equal(
        (
          await fetch(`${base}/api/crimes/${row.id}`, {
            method: "DELETE",
            headers,
          })
        ).status,
        200,
      );
    }
    const columns = [
      "blotterno",
      "stn",
      "barangay",
      "dateReported",
      "timeReported",
      "dateCommitted",
      "timeCommitted",
      "incidentType",
      "offense",
      "stageoffelony",
      "suspectCount",
      "investigator",
    ];
    const row = (
      blotter: string,
      offense: string,
      count: unknown = 1,
      investigator: unknown = "",
    ) => [
      blotter,
      "Tanza PS",
      "PUNTA I",
      "2026-01-01",
      "18:00:00",
      "2026-01-01",
      "17:20:00",
      "(Incident) Shooting",
      offense,
      "CONSUMMATED",
      count,
      investigator,
    ];
    const sheet = XLSX.utils.aoa_to_sheet([
      columns,
      row("http-fixture-multiple", "MURDER - RPC ART. 248"),
      [],
      row("http-fixture-multiple", "LIGHT THREATS - RPC ART. 283"),
      row("http-fixture-invalid", "THEFT - RPC ART. 308", "unknown"),
      row("http-fixture-invalid-text", "THEFT - RPC ART. 308", 1, 77),
      row("http-fixture-single", "THEFT - RPC ART. 308"),
    ]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Sheet1");
    const buffer = XLSX.write(book, { type: "buffer", bookType: "xlsx" });
    const form = new FormData();
    form.set("file", new Blob([buffer]), "http-fixture.xlsx");
    const response = await fetch(`${base}/api/crimes/upload`, {
      method: "POST",
      headers,
      body: form,
    });
    assert.equal(response.status, 200);
    const imported = await response.json();
    assert.equal(imported.data.inserted, 3);
    assert.equal(imported.data.skipped, 2);
    const result = await (await fetch(`${base}/api/crimes?limit=2000`)).json();
    const created = result.data.filter((r: { blotterNo: string }) =>
      r.blotterNo?.startsWith("http-fixture-"),
    );
    assert.equal(created.length, 3);
    const second = created.find(
      (r: { blotterNo: string; offense: string }) =>
        r.blotterNo === "http-fixture-multiple" &&
        r.offense === "LIGHT THREATS - RPC ART. 283",
    );
    assert.equal(second.sourceRow, 4);
    assert.equal(second.sourceIncidentType, "(Incident) Shooting");
    assert.equal(second.incidentType, "Light Threats");
    assert.equal(second.hasMultipleOffenses, true);
    assert.equal(second.offenseCount, 2);
    const denied = await fetch(`${base}/api/crimes/${second.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    assert.equal(denied.status, 403);
    const override = await fetch(`${base}/api/crimes/${second.id}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ crimeType: "Light Threats" }),
    });
    assert.equal(override.status, 400);
    for (const record of created)
      assert.equal(
        (
          await fetch(`${base}/api/crimes/${record.id}`, {
            method: "DELETE",
            headers,
          })
        ).status,
        200,
      );
  },
);
