// routes/index.js
import express from 'express';
import adminRouter from '../config/admin.js';
import sequelize from '../config/database.js';
import Lead from '../models/lead.js';
import LeadCampaign from '../models/leadCampaign.js';

const router = express.Router();

// AdminJS router
router.use(adminRouter);

// Define suas rotas aqui
router.get('/dashboard/leads-count', async (req, res) => {
  try {
    const count = await Lead.count();
    res.json({ count });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/dashboard/leads-campaign-count', async (req, res) => {
  try {
    const count = await LeadCampaign.count();
    res.json({ count });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/dashboard/accepted-leads-count', async (req, res) => {
  try {
    const count = await LeadCampaign.count({ where: { accept_invite: true } });
    res.json({ count });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
