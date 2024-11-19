import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH_L2 } from '$env/static/private';

const db = new Database(DB_PATH_L2, { verbose: console.log });

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = params.id;
  const User = await request.json();
  console.log("PUT User = ", User, "ID = ", id);

  try {
    const sql = `
      UPDATE Users
      SET Name = $Name, Password = $Password
      WHERE ID = $id;
    `;
    const stmnt = db.prepare(sql);
    const result = stmnt.run({ Name: User.Name,Password: User.Password, id });

    if (result.changes === 0) {
      return new Response('User not found', { status: 404 });
    }

    return new Response('User updated', { status: 200 });
  } catch (error) {
    console.error('Error updating User:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};