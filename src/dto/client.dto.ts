export interface CreateClientDTO {
  nombre: string;
  email: string;
  telefono?: string;
}

export interface UpdateClientDTO {
  nombre?: string;
  email?: string;
  telefono?: string;
}

export interface ClientResponseDTO {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  createdAt: Date;
  updatedAt: Date;
}
