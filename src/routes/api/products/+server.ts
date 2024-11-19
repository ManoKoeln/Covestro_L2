import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH_L2 } from '$env/static/private';
// import type { ProdData } from  "$lib/server/db/";


const db = new Database(DB_PATH_L2, { verbose: console.log });

export const GET: RequestHandler = async () => {
  const sql = `SELECT "_rowid_",* FROM "main"."production" LIMIT 49998 OFFSET 0;  `;
  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return new Response(JSON.stringify(rows), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const product = await request.json();
  console.log("POST Product = " ,product);
  const sql = `
    INSERT INTO production (ID, Fertigungsnummer)
    VALUES ($ID, $Fertigungsnummer);
  `;
  const stmnt = db.prepare(sql);
  const result = stmnt.run(product.ID, product.Fertigungsnummer);

  return new Response(JSON.stringify(result), { status: 201 });
};

