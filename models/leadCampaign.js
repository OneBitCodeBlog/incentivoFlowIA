import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LeadCampaign = sequelize.define('LeadCampaign', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    },
    accept_invite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    accepted_at: {
        type: DataTypes.DATE,
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

export default LeadCampaign;
