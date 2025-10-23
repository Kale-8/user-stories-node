import { ProductService } from '../../services/product.service';
import { Producto } from '../../models';

describe('ProductService', () => {
  beforeEach(async () => {
    // Crear productos de prueba
    await Producto.create({
      codigo: 'TEST001',
      nombre: 'Test Product 1',
      precio: 25.50,
      stock: 10
    });

    await Producto.create({
      codigo: 'TEST002',
      nombre: 'Test Product 2',
      precio: 15.75,
      stock: 5
    });
  });

  afterEach(async () => {
    await Producto.destroy({ where: {} });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = await ProductService.getAllProducts();
      
      expect(products).toHaveLength(2);
      expect(products[0].codigo).toBe('TEST001');
      expect(products[1].codigo).toBe('TEST002');
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const products = await ProductService.getAllProducts();
      const product = await ProductService.getProductById(products[0].id);
      
      expect(product).toBeDefined();
      expect(product?.codigo).toBe('TEST001');
      expect(product?.nombre).toBe('Test Product 1');
      expect(product?.precio).toBe(25.5);
      expect(product?.stock).toBe(10);
    });

    it('should return null for non-existent product', async () => {
      const product = await ProductService.getProductById(999);
      expect(product).toBeNull();
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        codigo: 'TEST003',
        nombre: 'Test Product 3',
        precio: 30.00,
        stock: 15
      };

      const product = await ProductService.createProduct(productData);
      
      expect(product).toBeDefined();
      expect(product.codigo).toBe('TEST003');
      expect(product.nombre).toBe('Test Product 3');
      expect(product.precio).toBe(30);
      expect(product.stock).toBe(15);
    });

    it('should throw error for duplicate code', async () => {
      const productData = {
        codigo: 'TEST001',
        nombre: 'Duplicate Product',
        precio: 20.00,
        stock: 5
      };

      await expect(ProductService.createProduct(productData))
        .rejects.toThrow('El código del producto ya existe');
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const products = await ProductService.getAllProducts();
      const updateData = {
        nombre: 'Updated Product',
        precio: 35.00,
        stock: 20
      };

      const updatedProduct = await ProductService.updateProduct(products[0].id, updateData);
      
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct?.nombre).toBe('Updated Product');
      expect(updatedProduct?.precio).toBe(35);
      expect(updatedProduct?.stock).toBe(20);
    });

    it('should return null for non-existent product', async () => {
      const updateData = { nombre: 'Updated Product' };
      const updatedProduct = await ProductService.updateProduct(999, updateData);
      expect(updatedProduct).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const products = await ProductService.getAllProducts();
      const deleted = await ProductService.deleteProduct(products[0].id);
      
      expect(deleted).toBe(true);
      
      const remainingProducts = await ProductService.getAllProducts();
      expect(remainingProducts).toHaveLength(1);
    });

    it('should return false for non-existent product', async () => {
      const deleted = await ProductService.deleteProduct(999);
      expect(deleted).toBe(false);
    });
  });
});

