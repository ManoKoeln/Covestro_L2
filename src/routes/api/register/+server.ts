import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH_L2 } from '$env/static/private';
import bcrypt from 'bcrypt';
import type { UserData } from '$lib/types/+types';

const db = new Database(DB_PATH_L2, { verbose: console.log });

export const POST: RequestHandler = async ({ request }) => {
  const tUserData : UserData = await request.json();

  try {
    // const user: { Password: string } = db.prepare('SELECT * FROM Users WHERE Name = ?').get(Password);
    const hashedPassword = await bcrypt.hash(tUserData.Password, 10);
    const user = db.prepare('INSERT INTO Users (Name, Password, Role) VALUES (?, ?, 0)').run(tUserData.Name, hashedPassword,tUserData.Role);
    // const user = db.prepare('SELECT * FROM Users WHERE Name = ?').get(tUserData.Name) as { Password: string};
    if (!user) {

    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
    //   return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Registration successful', role: tUserData.Role }), { status: 200 });
  } catch (error) {
    console.error('Error during Resgistration:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};