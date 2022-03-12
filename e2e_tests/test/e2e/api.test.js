import { beforeEach, describe, expect, test } from '@jest/globals';
import superTest from 'supertest';
import Server from '../../src/server.js';

describe('API E2E Test Suite', () => {
  beforeEach(async () => {
    await superTest(Server).delete('/');
  });

  test('POST / - should save an item and return ok', async () => {
    const response = await superTest(Server)
      .post('/')
      .send({ name: 'csevero', age: 21 });
    const expectedResponse = { ok: 1 };

    expect(JSON.parse(response.text)).toStrictEqual(expectedResponse);
  });

  test('GET / - should return an array', async () => {
    //if you already has a server QA online you can pass the url to superTest, or pass you server to superTest create a new Server locally
    const response = await superTest(Server).get('/');
    const data = JSON.parse(response.text);

    expect(data).toBeInstanceOf(Array);
    expect(data.length).toEqual(0);
  });

  test('DELETE / - should delete all items and return ok', async () => {
    const response = await superTest(Server).delete('/');

    const expectedResponse = { ok: 1 };
    expect(JSON.parse(response.text)).toStrictEqual(expectedResponse);
  });
});
