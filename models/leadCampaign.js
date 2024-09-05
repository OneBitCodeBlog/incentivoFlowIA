import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LeadCampaign = sequelize.define('LeadCampaign', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    invited_by_lead_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permite valores nulos
    },
    first_reward_claimed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    second_reward_claimed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    second_reward_send: { // Nome do campo corrigido
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

// Associações
LeadCampaign.belongsTo(sequelize.models.Lead, { foreignKey: 'lead_id', as: 'lead' });
LeadCampaign.belongsTo(sequelize.models.Lead, { foreignKey: 'invited_by_lead_id', as: 'invitedByLead' });
LeadCampaign.belongsTo(sequelize.models.Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

export default LeadCampaign;
