import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { nanoid } from 'nanoid'; // Biblioteca para gerar o slug aleatório

const Lead = sequelize.define('Lead', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    whatsapp: {
        type: DataTypes.STRING(20),
    },
    slug: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
});

// Hook para gerar o slug antes da validação
Lead.beforeValidate((lead) => {
    if (!lead.slug) { // Garantir que o slug seja gerado apenas se estiver vazio
        lead.slug = nanoid(8); // Gera um slug de 8 dígitos
    }
});

export default Lead;
