import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH_L2 } from '$env/static/private';
import bcrypt from 'bcrypt';
import type { UserData } from '$lib/types/+types';

const db = new Database(DB_PATH_L2, { verbose: console.log });

export const POST: RequestHandler = async ({ request }) => {
  const  tUserData : UserData = await request.json();

  try {
    const user = db.prepare('SELECT * FROM Users WHERE Name = ?').get(name) as { Password: string; Role: string };
    if (!user) {
      const hashedPassword = await bcrypt.hash(tUserData.Password, 10);
      const insert = db.prepare('INSERT INTO Users (Name, Password, Role) VALUES (?, ?, ?)');
      insert.run(name, hashedPassword, 'user'); // Default role is 'user'
      return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
    }
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(tUserData.Password, user.Password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    // Anmeldeinformationen sind korrekt
    return new Response(JSON.stringify({ message: 'Login successful', role: user.Role }), { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};