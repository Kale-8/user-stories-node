import { ClientDAO } from '../dao/client.dao';
import { CreateClientDTO, UpdateClientDTO, ClientResponseDTO } from '../dto/client.dto';

export class ClientService {
  static async getAllClients(): Promise<ClientResponseDTO[]> {
    const clients = await ClientDAO.findAll();
    return clients.map(this.mapToResponseDTO);
  }

  static async getClientById(id: number): Promise<ClientResponseDTO | null> {
    const client = await ClientDAO.findById(id);
    return client ? this.mapToResponseDTO(client) : null;
  }

  static async createClient(data: CreateClientDTO): Promise<ClientResponseDTO> {
    const client = await ClientDAO.create(data);
    return this.mapToResponseDTO(client);
  }

  static async updateClient(id: number, data: UpdateClientDTO): Promise<ClientResponseDTO | null> {
    const client = await ClientDAO.update(id, data);
    return client ? this.mapToResponseDTO(client) : null;
  }

  static async deleteClient(id: number): Promise<boolean> {
    return ClientDAO.delete(id);
  }

  private static mapToResponseDTO(client: any): ClientResponseDTO {
    return {
      id: client.id,
      nombre: client.nombre,
      email: client.email,
      telefono: client.telefono,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
