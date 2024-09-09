import express from 'express';
import sequelize from './config/database.js';
import adminRouter from './config/admin.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import campaignRoutes from './routes/campaign.js';
import frontendRoutes from './routes/frontend.js'; // Rotas do frontend
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Definir EJS como engine de templates
app.set('view engine', 'ejs');

// Definir o diretório de views
app.set('views', './views');

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Configurar o Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // Limite de 10 requisições por minuto por IP
  message: 'Você excedeu o limite de requisições por minuto. Por favor, tente novamente mais tarde.'
});

// Aplicar o rate limiter a todas as rotas da API
app.use('/api', limiter);

// AdminJS router (não usará layout)
app.use(adminRouter);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', campaignRoutes);

// Frontend routes (apenas essas rotas terão layout)
app.use('/', frontendRoutes); // Aplica layout nas rotas de frontend

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, async () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync({ alter: true });
        console.log('Tables have been created');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
});
