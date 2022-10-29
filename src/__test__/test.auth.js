import request from 'supertest';
import chai from 'chai';
import app from '../app.js';
import { User } from '../models/User.js';

const { expect } = chai;


describe('Test the auth endpoints', () => {

  it('should allow to create users', async () => {
    const payload = {
      'name': 'teast',
      'email': 'josae@email.com',
      'password': '123456'
    }
    const { body, status } = await request(app).post('/auth/register').send(payload);
    expect(status).to.equal(201);

    // check the userId
    expect(body).to.have.property('userId');
    const userId = body.userId;
    const user = await User.findByPk(userId);
    expect(user.name).to.equal(payload.name);
  });

  it('should return 400 if payload is incomplete', async () => {
    const payload = {
      'name': 'teast',
      'password': '123456'
    }
    const { status } = await request(app).post('/auth/register').send(payload);
    expect(status).to.equal(400);
  });

  it('should return 400 if password is shorter than 6 characters', async () => {
    const payload = {
      'name': 'teast',
      'email': 'josa123e@email.com',
      'password': '12345'
    }
    const { body, status } = await request(app).post('/auth/register').send(payload);
    expect(status).to.equal(400);
    expect(body.message).contains('password must be at least 6 characters');
  });

  it('should return 400 if password or email or name  is equal ""', async () => {
    const payload = {
      'name': '',
      'email': '',
      'password': ''
    }
    const { body, status } = await request(app).post('/auth/register').send(payload);
    expect(status).to.equal(400);
    expect(body.message).contains('email, password and name are required');
  });

  it('should return 400 if email does not have an @ character', async () => {
    const payload = {
      'name': 'teast',
      'email': 'josa123e.email.com',
      'password': '12345123123'
    }
    const { body, status } = await request(app).post('/auth/register').send(payload);
    expect(status).to.equal(400);
    expect(body.message).contains('email must contain @ character');
  });
  
});