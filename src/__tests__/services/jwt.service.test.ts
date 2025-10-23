import { JWTService } from '../../services/jwt.service';

describe('JWTService', () => {
  const mockUser = {
    userId: 1,
    email: 'test@example.com',
    rol: 'vendedor' as const
  };

  describe('generateAccessToken', () => {
    it('should generate access token', () => {
      const token = JWTService.generateAccessToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token', () => {
      const token = JWTService.generateRefreshToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', () => {
      const token = JWTService.generateAccessToken(mockUser);
      const decoded = JWTService.verifyAccessToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockUser.userId);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.rol).toBe(mockUser.rol);
    });

    it('should throw error for invalid token', () => {
      expect(() => JWTService.verifyAccessToken('invalid-token'))
        .toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const token = JWTService.generateRefreshToken(mockUser);
      const decoded = JWTService.verifyRefreshToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockUser.userId);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.rol).toBe(mockUser.rol);
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => JWTService.verifyRefreshToken('invalid-token'))
        .toThrow();
    });
  });
});
