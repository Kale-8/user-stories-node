import { Cliente } from '../models/Cliente';
import { CreateClientDTO, UpdateClientDTO } from '../dto/client.dto';

export class ClientDAO {
  static async findAll(): Promise<Cliente[]> {
    return Cliente.findAll();
  }

  static async findById(id: number): Promise<Cliente | null> {
    return Cliente.findByPk(id);
  }

  static async findByEmail(email: string): Promise<Cliente | null> {
    return Cliente.findOne({ where: { email } });
  }

  static async create(data: CreateClientDTO): Promise<Cliente> {
    // Check if email already exists
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new Error('El email del cliente ya existe');
    }
    
    return Cliente.create(data);
  }

  static async update(id: number, data: UpdateClientDTO): Promise<Cliente | null> {
    const client = await this.findById(id);
    if (!client) {
      return null;
    }

    // Check if email is being updated and already exists
    if (data.email && data.email !== client.email) {
      const existing = await this.findByEmail(data.email);
      if (existing) {
        throw new Error('El email del cliente ya existe');
      }
    }

    await client.update(data);
    return client.reload();
  }

  static async delete(id: number): Promise<boolean> {
    const client = await this.findById(id);
    if (!client) {
      return false;
    }

    await client.destroy();
    return true;
  }
}
