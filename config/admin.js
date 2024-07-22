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
import branding from './branding.js';
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { componentLoader, Components } from '../adminjs/components/components.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    },
  ],
  rootPath: process.env.ADMINJS_ROOT_PATH,
  dashboard: {
    handler: async () => {
      return { some: 'output' }; // Adicione dados conforme necessário
    },
    component: Components.Dashboard,
  },
  componentLoader,
  branding: branding,
});

adminJs.watch() 

const router = Router();

const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === process.env.ADMINJS_USERNAME && password === process.env.ADMINJS_PASSWORD) {
      return Promise.resolve({ email });
    }
    return null; // Retorna null para falha na autenticação
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
});

router.use(adminJs.options.rootPath, adminJsRouter);

export default router;
