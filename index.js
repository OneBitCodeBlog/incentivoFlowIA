import express from 'express';
import sequelize from './config/database.js';
import adminRouter from './config/admin.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import campaignRoutes from './routes/campaign.js';

dotenv.config();

const app = express();

// AdminJS router
app.use(adminRouter);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', campaignRoutes);

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync(); // Cria as tabelas no banco de dados
        console.log('Tables have been created');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
});