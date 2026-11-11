import { randomBytes } from 'node:crypto'
import { getDatabase } from '../config/sqlite.js'

// Saves an uploaded image in the `files` table and returns its id.
const saveFile = async ({ buffer, mimetype }) => {
  const id = randomBytes(12).toString('hex')
  await getDatabase().execute({
    sql: 'INSERT INTO files (id, mime, data) VALUES (?, ?, ?)',
    args: [id, mimetype, new Uint8Array(buffer)]
  })
  return id
}

const getFile = async (id) => {
  const { rows } = await getDatabase().execute({ sql: 'SELECT mime, data FROM files WHERE id = ?', args: [id] })
  if (!rows[0]) return null
  return { mime: rows[0].mime, data: Buffer.from(rows[0].data) }
}

const deleteFile = async (id) => {
  await getDatabase().execute({ sql: 'DELETE FROM files WHERE id = ?', args: [id] })
}

export { saveFile, getFile, deleteFile }
