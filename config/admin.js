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
import { ComponentLoader } from 'adminjs';

// Resolver __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();
const Components = {
  Dashboard: componentLoader.add('Dashboard', path.join(__dirname, '../components/Dashboard')),
};

// Registrar o adaptador do Sequelize
AdminJS.registerAdapter(AdminJSSequelize);

const dashboardHandler = async () => {
  const leads = await Lead.count();
  const invitedLeads = await LeadCampaign.count();
  const acceptedLeads = await LeadCampaign.count({ where: { accept_invite: true } });

  return { leads, invitedLeads, acceptedLeads };
};

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
  branding: branding,
  dashboard: {
    component: Components.Dashboard,
    handler: dashboardHandler,
  },
  componentLoader
});

adminJs.watch();

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