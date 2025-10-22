export interface CreateOrderDTO {
  clienteId: number;
  productos: Array<{
    productoId: number;
    cantidad: number;
  }>;
}

export interface OrderResponseDTO {
  id: number;
  clienteId: number;
  vendedorId: number;
  total: number;
  estado: string;
  fechaPedido: Date;
  cliente: {
    id: number;
    nombre: string;
    email: string;
  };
  vendedor: {
    id: number;
    nombre: string;
    email: string;
  };
  productos: Array<{
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: {
      id: number;
      codigo: string;
      nombre: string;
    };
  }>;
}

export interface UpdateOrderStatusDTO {
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
}
