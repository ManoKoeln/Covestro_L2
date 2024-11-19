import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH_L2 } from '$env/static/private';

const db = new Database(DB_PATH_L2, { verbose: console.log });

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = params.id;
  const product = await request.json();
  console.log("PUT Product = ", product, "ID = ", id);

  try {
    const sql = `
      UPDATE production
      SET Fertigungsnummer = $Fertigungsnummer, Row = $Row, Column = $Column
      WHERE ID = $id;
    `;
    const stmnt = db.prepare(sql);
    // const result = stmnt.run({ Fertigungsnummer: product.Fertigungsnummer, id });
    const result = stmnt.run({ Fertigungsnummer: product.Fertigungsnummer,Row: product.row,Column: product.column, id });

    if (result.changes === 0) {
      return new Response('Product not found', { status: 404 });
    }

    return new Response('Product updated', { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    console.log('Error updating product:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

// export const PUT: RequestHandler = async ({ params, request }) => {
//   const id = params.id;
//   const User = await request.json();
//   console.log("PUT User = ", User, "ID = ", id);

//   try {
//     const sql = `
//       UPDATE Admin
//       SET Name = $Name, Password = $Password
//       WHERE ID = $id;
//     `;
//     const stmnt = db.prepare(sql);
//     const result = stmnt.run({ Fertigungsnummer: User.Name,Row: User.Password, id });

//     if (result.changes === 0) {
//       return new Response('User not found', { status: 404 });
//     }

//     return new Response('User updated', { status: 200 });
//   } catch (error) {
//     console.error('Error updating User:', error);
//     return new Response('Internal Server Error', { status: 500 });
//   }
// };