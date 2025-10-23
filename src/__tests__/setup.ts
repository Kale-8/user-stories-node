// Setup para las pruebas
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key';
process.env.DATABASE_URI = 'postgresql://test:test@localhost:5432/test_db';