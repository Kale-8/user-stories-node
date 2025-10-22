import request from 'supertest';
import app from '../../index';
import { Usuario } from '../../models';
import bcrypt from 'bcryptjs';

describe('AuthController', () => {
  beforeEach(async () => {
    // Crear usuario de prueba
    await Usuario.create({
      nombre: 'Test User',
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      rol: 'vendedor'
    });
  });

  afterEach(async () => {
    await Usuario.destroy({ where: {} });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          nombre: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          rol: 'vendedor'
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('should return 400 if email already exists', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          nombre: 'Duplicate User',
          email: 'test@example.com',
          password: 'password123',
          rol: 'vendedor'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email ya registrado');
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          nombre: 'Incomplete User',
          email: 'incomplete@example.com'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // First login to get tokens
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const refreshResponse = await request(app)
        .post('/auth/refresh')
        .send({
          refreshToken: loginResponse.body.refreshToken
        });

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body.accessToken).toBeDefined();
      expect(refreshResponse.body.refreshToken).toBeDefined();
    });

    it('should return 401 with invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid-token'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token de renovación inválido');
    });
  });
});
