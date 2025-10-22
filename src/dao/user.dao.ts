import { Usuario, UsuarioCreationAttributes } from '../models/Usuario';

export class UserDAO {
  static async findByEmail(email: string): Promise<Usuario | null> {
    return Usuario.findOne({ where: { email } });
  }

  static async create(data: UsuarioCreationAttributes): Promise<Usuario> {
    return Usuario.create(data);
  }
}


