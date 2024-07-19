import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import User from '../models/user.js';
import Campaign from '../models/campaign.js';
import Lead from '../models/lead.js';
import LeadCampaign from '../models/leadCampaign.js';
import campaignResourceOptions from './campaignResourceOptions.js';
import leadResourceOptions from './leadResourceOptions.js';
import leadCampaignResourceOptions from './leadCampaignResourceOptions.js';
import { Router } from 'express';

// Registrar o adaptador do Sequelize
AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
    resources: [
        User,
        {
            resource: Campaign,
            options: campaignResourceOptions,
        },
        {
            resource: Lead,
            options: leadResourceOptions,
        },
        {
            resource: LeadCampaign,
            options: leadCampaignResourceOptions,
        }
    ],
    rootPath: process.env.ADMINJS_ROOT_PATH,
    branding: {
        companyName: 'IncentivoFlow',
        logo: false,  // Pode adicionar uma URL para um logo se desejar
        softwareBrothers: false,
        theme: {
            colors: {
                primary100: '#000000',
                primary80: '#333333',
                primary60: '#666666',
                primary40: '#999999',
                primary20: '#CCCCCC',
                accent: '#000000',
                love: '#FF0000',
                grey100: '#151515',
                grey80: '#333333',
                grey60: '#4D4D4D',
                grey40: '#666666',
                grey20: '#E2E2E2',
                white: '#FFFFFF',
                errorDark: '#FF0000',
                error: '#FF3333',
                errorLight: '#FF6666',
                successDark: '#00FF00',
                success: '#33FF33',
                successLight: '#66FF66',
                infoDark: '#0000FF',
                info: '#3333FF',
                infoLight: '#6666FF',
                bg: '#1F1F1F', // Login page background color
                hoverBg: '#2C2C2C', // Sidebar item hover background color
                border: '#333333', // Sidebar border color
                inputBorder: '#4D4D4D', // Input border color
                separator: '#333333', // Sidebar separator color
                highlight: '#666666', // Sidebar highlight color
            },
        },
    },
});

const router = Router();

const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
        if (email === process.env.ADMINJS_USERNAME && password === process.env.ADMINJS_PASSWORD) {
            return Promise.resolve({ email });
        }
        return Promise.reject();
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
});

router.use(adminJs.options.rootPath, adminJsRouter);

export default router;
