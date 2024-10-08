import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Campaign = sequelize.define('Campaign', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING(255),
        unique: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    available_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    first_reward_title: {
        type: DataTypes.STRING(255),
    },
    first_reward_text: {
        type: DataTypes.TEXT,
    },
    first_reward_video_url: {
        type: DataTypes.STRING(255),
    },
    first_reward_how_it_works_title: {
        type: DataTypes.STRING(255),
    },
    first_reward_how_it_works_text: {
        type: DataTypes.TEXT,
    },
    first_reward_how_it_works_img_url: {
        type: DataTypes.STRING(255),
    },
    second_reward_title: {
        type: DataTypes.STRING(255),
    },
    second_reward_subtitle: {
        type: DataTypes.STRING(255),
    },
    second_reward_text: {
        type: DataTypes.TEXT,
    },
    second_reward_video_url: {
        type: DataTypes.STRING(255),
    },
    second_reward_invite_title: {
        type: DataTypes.STRING(255),
    },
    second_reward_invite_text: {
        type: DataTypes.TEXT,
    },
    thanks_title: {
        type: DataTypes.STRING(255),
    },
    thanks_text: {
        type: DataTypes.TEXT,
    },
    first_reward_email_title: {
        type: DataTypes.STRING(255),
    },
    first_reward_email_text: {
        type: DataTypes.TEXT,
    },
    first_reward_email_link: {
        type: DataTypes.STRING(255),
    },
    second_reward_email_title: {
        type: DataTypes.STRING(255),
    },
    second_reward_email_text: {
        type: DataTypes.TEXT,
    },
    second_reward_email_link: {
        type: DataTypes.STRING(255),
    },
    invite_email_title: {
        type: DataTypes.STRING(255),
    },
    invite_email_reward: {
        type: DataTypes.TEXT,
    },
    required_leads_for_second_reward: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3, // Número padrão de leads necessários para a segunda recompensa
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

export default Campaign;
