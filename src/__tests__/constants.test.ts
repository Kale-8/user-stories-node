import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

describe('Constants', () => {
  describe('HTTP_STATUS', () => {
    it('should have all required status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have all required error messages', () => {
      expect(ERROR_MESSAGES.INVALID_ID).toBeDefined();
      expect(ERROR_MESSAGES.RESOURCE_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.USER_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.PRODUCT_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.CLIENT_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.ORDER_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.DUPLICATE_PRODUCT_CODE).toBeDefined();
    });
  });
});


