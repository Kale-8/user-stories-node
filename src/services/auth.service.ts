import bcrypt from 'bcryptjs';
import { UserDAO } from '../dao/user.dao';
import { RegisterDTO, LoginDTO } from '../dto/auth.dto';
import { JWTService } from './jwt.service';

export class AuthService {
  static async register(input: RegisterDTO) {
    const existing = await UserDAO.findByEmail(input.email);
    if (existing) {
      throw new Error('Email ya registrado');
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await UserDAO.create({
      nombre: input.nombre,
      email: input.email,
      passwordHash,
      rol: input.rol,
    });
    
    const tokenPayload = { userId: user.id, email: user.email, rol: user.rol };
    const accessToken = JWTService.generateAccessToken(tokenPayload);
    const refreshToken = JWTService.generateRefreshToken(tokenPayload);
    
    return { 
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      accessToken,
      refreshToken
    };
  }

  static async login(input: LoginDTO) {
    const user = await UserDAO.findByEmail(input.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new Error('Credenciales inválidas');
    }
    
    const tokenPayload = { userId: user.id, email: user.email, rol: user.rol };
    const accessToken = JWTService.generateAccessToken(tokenPayload);
    const refreshToken = JWTService.generateRefreshToken(tokenPayload);
    
    return { 
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      accessToken,
      refreshToken
    };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const payload = JWTService.verifyRefreshToken(refreshToken);
      const newAccessToken = JWTService.generateAccessToken(payload);
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Token de refresh inválido');
    }
  }
}


