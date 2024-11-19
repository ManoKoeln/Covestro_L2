import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH_L2 } from '$env/static/private';

const db = new Database(DB_PATH_L2, { verbose: console.log });

export const GET: RequestHandler = async ({ url }) => {
    console.log("GET UserReq");
  const name = url.searchParams.get('Name');
  if (!name) {
    return new Response('Name query parameter is required', { status: 400 });
  }

  try {
    const user = db.prepare('SELECT * FROM Users WHERE Name = ?').get(name);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};