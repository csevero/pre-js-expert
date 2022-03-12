import { createServer } from 'http';
import { once } from 'events';
import { randomUUID } from 'crypto';
const Database = new Map();

function respondJSON(data, res) {
  return res.end(JSON.stringify(data));
}

async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return respondJSON([...Database.values()], res);
  }

  if (method === 'POST') {
    const body = JSON.parse(await once(req, 'data'));
    const id = randomUUID();
    Database.set(id, body);

    return respondJSON({ ok: 1 }, res);
  }

  if (method === 'DELETE') {
    Database.clear();
    return respondJSON({ ok: 1 }, res);
  }
}

export default createServer(handler);
