import express from 'express';
import sequelize from './config/database.js';
import adminRouter from './config/admin.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import campaignRoutes from './routes/campaign.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Configurar o Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 3, // Limite de 10 requisições por minuto por IP
  message: 'Você excedeu o limite de requisições por minuto. Por favor, tente novamente mais tarde.'
});

// Aplicar o rate limiter a todas as rotas da API
app.use('/api', limiter);

// AdminJS router
app.use(adminRouter);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', campaignRoutes);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, async () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync(); // Cria as tabelas no banco de dados
        console.log('Tables have been created');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
});
