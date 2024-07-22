// IncentivoFlow/index.js

import express from 'express';
import sequelize from './config/database.js';
import adminRouter from './config/admin.js';
import routes from './routes/index.js';  // Importe as rotas
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// AdminJS router
app.use(adminRouter);
app.use('/api', routes);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // Cria as tabelas no banco de dados
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
});
