export interface CreateProductDTO {
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
}

export interface UpdateProductDTO {
  nombre?: string;
  precio?: number;
  stock?: number;
}

export interface ProductResponseDTO {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
