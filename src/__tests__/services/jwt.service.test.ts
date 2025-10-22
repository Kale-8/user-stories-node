import { JWTService } from '../services/jwt.service';

describe('JWTService', () => {
  const mockPayload = {
    userId: 1,
    email: 'test@example.com',
    rol: 'admin',
  };

  describe('generateAccessToken', () => {
    it('should generate access token', () => {
      const token = JWTService.generateAccessToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = JWTService.generateAccessToken(mockPayload);
      const token2 = JWTService.generateAccessToken({ ...mockPayload, userId: 2 });
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token', () => {
      const token = JWTService.generateRefreshToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', () => {
      const token = JWTService.generateAccessToken(mockPayload);
      const verified = JWTService.verifyAccessToken(token);
      
      expect(verified).toEqual(mockPayload);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        JWTService.verifyAccessToken('invalid-token');
      }).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const token = JWTService.generateRefreshToken(mockPayload);
      const verified = JWTService.verifyRefreshToken(token);
      
      expect(verified).toEqual(mockPayload);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        JWTService.verifyRefreshToken('invalid-token');
      }).toThrow();
    });
  });
});
