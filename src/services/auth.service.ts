import bcrypt from 'bcryptjs';
import { UserDAO } from '../dao/user.dao';
import { RegisterDTO, LoginDTO } from '../dto/auth.dto';

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
    return { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
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
    return { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
  }
}


