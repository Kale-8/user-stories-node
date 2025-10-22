export class ValidationUtil {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 7 && phone.length <= 30;
  }

  static validateProductCode(code: string): boolean {
    const codeRegex = /^[A-Z0-9]+$/;
    return codeRegex.test(code) && code.length >= 1 && code.length <= 50;
  }

  static validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  static validateName(name: string, minLength: number = 2, maxLength: number = 150): boolean {
    return name.length >= minLength && name.length <= maxLength;
  }

  static validatePrice(price: number): boolean {
    return price >= 0;
  }

  static validateStock(stock: number): boolean {
    return Number.isInteger(stock) && stock >= 0;
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
  }

  static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}
