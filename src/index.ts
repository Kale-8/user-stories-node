import express from 'express';
import router from './routes';
import { sequelize, testConnection } from './config/database';
import './models/associations'; // Import associations

const app = express();
app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await testConnection();
    await sequelize.sync();
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});
