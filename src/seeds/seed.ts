import { sequelize } from '../config/database';
import { Usuario } from '../models/Usuario';
import { Producto } from '../models/Producto';
import bcrypt from 'bcryptjs';

async function run(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.sync();

  const [admin, createdAdmin] = await Usuario.findOrCreate({
    where: { email: 'admin@sportsline.local' },
    defaults: {
      nombre: 'Admin',
      email: 'admin@sportsline.local',
      passwordHash: await bcrypt.hash('admin123', 10),
      rol: 'admin',
    },
  });
  console.log('Admin usuario:', createdAdmin ? 'creado' : 'existente', admin.email);

  const productos = [
    { codigo: 'P001', nombre: 'Balón de fútbol', precio: 25.5, stock: 100 },
    { codigo: 'P002', nombre: 'Raqueta de tenis', precio: 89.99, stock: 50 },
    { codigo: 'P003', nombre: 'Guantes de boxeo', precio: 45.0, stock: 30 },
  ];

  for (const p of productos) {
    const [producto, created] = await Producto.findOrCreate({ where: { codigo: p.codigo }, defaults: p });
    console.log(`Producto ${producto.codigo}:`, created ? 'creado' : 'existente');
  }
}

run()
  .then(() => { console.log('Seed completado'); process.exit(0); })
  .catch((err) => { console.error('Error en seed:', err); process.exit(1); });
