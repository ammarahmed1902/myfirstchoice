import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("PostgreSQL row-level security protects pricing, approval and customer requests", async (t) => {
  const db = new PGlite();
  await db.exec(
    `create schema auth; create role anon nologin; create role authenticated nologin; create table auth.users(id uuid primary key,email_confirmed_at timestamptz); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid; $$; grant usage on schema public,auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`,
  );
  await db.exec(
    await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"),
  );
  const buyer = "00000000-0000-4000-8000-000000000001",
    other = "00000000-0000-4000-8000-000000000002";
  await db.query(
    "insert into auth.users(id,email_confirmed_at) values($1,now()),($2,now())",
    [buyer, other],
  );
  await db.exec(
    `insert into public.product_prices values('EL-001',10,2.50,'GBP');`,
  );
  async function asBuyer(id: string) {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
    await db.exec("set role authenticated");
  }
  const details = {
    company: "Retail UK Ltd",
    destination: "London SW1A 1AA",
    notes: "Test quotation",
    lines: [{ productId: "EL-001", quantity: 10, sample: false }],
  };
  await t.test("anonymous role cannot read private prices", async () => {
    await db.exec("set role anon");
    await assert.rejects(db.query("select * from public.product_prices"));
    await db.exec("reset role");
  });
  await t.test(
    "pending buyers see no price rows and cannot approve themselves",
    async () => {
      await asBuyer(buyer);
      assert.equal(
        (await db.query("select * from public.product_prices")).rows.length,
        0,
      );
      await assert.rejects(
        db.query("update public.profiles set status='approved'"),
      );
      await assert.rejects(
        db.query("select public.submit_quote($1::jsonb)", [
          JSON.stringify(details),
        ]),
      );
    },
  );
  await t.test(
    "missing enquiry fields cannot bypass SQL validation",
    async () => {
      await asBuyer(buyer);
      await assert.rejects(
        db.query("select public.submit_enquiry($1::jsonb)", ["{}"]),
      );
    },
  );
  await t.test(
    "application is stored privately without granting approval",
    async () => {
      await asBuyer(buyer);
      await db.query("select public.submit_application($1::jsonb)", [
        JSON.stringify({
          name: "Test Buyer",
          company: "Retail UK Ltd",
          businessType: "Retailer",
          requirements: "Audio accessories for our store.",
          phone: "",
          website: "",
        }),
      ]);
      const r = await db.query<{ status: string }>(
        "select status from public.profiles",
      );
      assert.equal(r.rows[0].status, "pending");
      await asBuyer(other);
      assert.equal(
        (await db.query("select * from public.applications")).rows.length,
        0,
      );
    },
  );
  await t.test(
    "trusted admin approval unlocks price rows for that buyer",
    async () => {
      await db.exec("reset role");
      await db.query(
        "update public.profiles set status='approved' where id=$1",
        [buyer],
      );
      await asBuyer(buyer);
      assert.equal(
        (await db.query("select * from public.product_prices")).rows.length,
        1,
      );
    },
  );
  await t.test(
    "approved buyer can save a quote; another buyer cannot read it",
    async () => {
      await asBuyer(buyer);
      await db.query("select public.submit_quote($1::jsonb)", [
        JSON.stringify(details),
      ]);
      assert.equal(
        (await db.query("select * from public.quote_requests")).rows.length,
        1,
      );
      await asBuyer(other);
      assert.equal(
        (await db.query("select * from public.quote_requests")).rows.length,
        0,
      );
    },
  );
  await t.test(
    "direct RPC calls cannot insert forged product refs or quantities",
    async () => {
      await asBuyer(buyer);
      for (const lines of [
        [{ productId: "UNKNOWN", quantity: 1, sample: false }],
        [{ productId: "EL-001", quantity: 0, sample: false }],
        [{ quantity: 1, sample: false }],
        [{ productId: "EL-001", quantity: 1 }],
        [
          { productId: "EL-001", quantity: 6000, sample: false },
          { productId: "EL-001", quantity: 6000, sample: false },
        ],
      ])
        await assert.rejects(
          db.query("select public.submit_quote($1::jsonb)", [
            JSON.stringify({ ...details, lines }),
          ]),
        );
    },
  );
  await t.test("database enforces per-buyer quote rate limits", async () => {
    await asBuyer(buyer);
    for (let n = 0; n < 9; n++)
      await db.query("select public.submit_quote($1::jsonb)", [
        JSON.stringify(details),
      ]);
    await assert.rejects(
      db.query("select public.submit_quote($1::jsonb)", [
        JSON.stringify(details),
      ]),
      /limit reached/,
    );
  });
  await db.close();
});
