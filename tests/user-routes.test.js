const request = require('supertest');

test('My super test', async () => {
  const res = await request(apiUrl)
    .post('/the/route/to/test')
    .send({
      some: 'data',
    });

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('some data present in the body');
});