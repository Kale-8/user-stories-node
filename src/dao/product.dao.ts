import { Producto, ProductoCreationAttributes } from '../models/Producto';
import { CreateProductDTO, UpdateProductDTO } from '../dto/product.dto';

export class ProductDAO {
  static async findAll(): Promise<Producto[]> {
    return Producto.findAll();
  }

  static async findById(id: number): Promise<Producto | null> {
    return Producto.findByPk(id);
  }

  static async findByCode(codigo: string): Promise<Producto | null> {
    return Producto.findOne({ where: { codigo } });
  }

  static async create(data: CreateProductDTO): Promise<Producto> {
    // Check if code already exists
    const existing = await this.findByCode(data.codigo);
    if (existing) {
      throw new Error('El código del producto ya existe');
    }
    
    return Producto.create(data);
  }

  static async update(id: number, data: UpdateProductDTO): Promise<Producto | null> {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }

    await product.update(data);
    return product.reload();
  }

  static async delete(id: number): Promise<boolean> {
    const product = await this.findById(id);
    if (!product) {
      return false;
    }

    await product.destroy();
    return true;
  }
}
