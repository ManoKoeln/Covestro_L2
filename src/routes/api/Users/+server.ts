import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH_L2 } from '$env/static/private';
// import type { UserData } from  "$lib/server/db/";


const db = new Database(DB_PATH_L2, { verbose: console.log });

export const GET: RequestHandler = async () => {
  const sql = `
SELECT "_rowid_",* FROM "main"."Users" LIMIT 49999 OFFSET 0;
  `;
  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return new Response(JSON.stringify(rows), { status: 200 });
};

// export const POST: RequestHandler = async ({ request }) => {
//   const User = await request.json();
//   console.log("POST User = " ,User);
//   const sql = `
//     INSERT INTO User (ID, Name)
//     VALUES ($ID, $Name);
//   `;
//   const stmnt = db.prepare(sql);
//   const result = stmnt.run(User.ID, User.Name, User.Password, User.Role);

//   return new Response(JSON.stringify(result), { status: 201 });
// };

