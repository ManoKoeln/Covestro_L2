import type { RequestHandler } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type { Track } from '../../../types';

const db = new Database(DB_PATH, { verbose: console.log });

export const GET: RequestHandler = async () => {
  const sql = `
select t.TrackId as TrackId
, t.name as trackname
, a.AlbumId as albumId
,a.Title as albumTitel
, at.ArtistId as artistID
, at.Name as artistName
, g.Name as genre

from tracks t
join albums a
on t.AlbumId = a.AlbumId
join artists at
on a.ArtistId = at.ArtistId
join genres g
on t.GenreId = g.GenreId
limit 50
  `;
  const stmnt = db.prepare(sql);
  const rows = stmnt.all();
  return new Response(JSON.stringify(rows), { status: 200 });
};