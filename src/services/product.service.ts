import { ProductDAO } from '../dao/product.dao';
import { CreateProductDTO, UpdateProductDTO, ProductResponseDTO } from '../dto/product.dto';

export class ProductService {
  static async getAllProducts(): Promise<ProductResponseDTO[]> {
    const products = await ProductDAO.findAll();
    return products.map(this.mapToResponseDTO);
  }

  static async getProductById(id: number): Promise<ProductResponseDTO | null> {
    const product = await ProductDAO.findById(id);
    return product ? this.mapToResponseDTO(product) : null;
  }

  static async createProduct(data: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = await ProductDAO.create(data);
    return this.mapToResponseDTO(product);
  }

  static async updateProduct(id: number, data: UpdateProductDTO): Promise<ProductResponseDTO | null> {
    const product = await ProductDAO.update(id, data);
    return product ? this.mapToResponseDTO(product) : null;
  }

  static async deleteProduct(id: number): Promise<boolean> {
    return ProductDAO.delete(id);
  }

  private static mapToResponseDTO(product: any): ProductResponseDTO {
    return {
      id: product.id,
      codigo: product.codigo,
      nombre: product.nombre,
      precio: parseFloat(product.precio),
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
