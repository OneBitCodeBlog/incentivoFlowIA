import { Router } from 'express';
import Lead from '../models/lead.js';
import LeadCampaign from '../models/leadCampaign.js';

const router = Router();

router.get('/admin/dashboard/leads', async (req, res) => {
  const count = await Lead.count();
  res.json({ count });
});

router.get('/admin/dashboard/invited-leads', async (req, res) => {
  const count = await LeadCampaign.count();
  res.json({ count });
});

router.get('/admin/dashboard/accepted-leads', async (req, res) => {
  const count = await LeadCampaign.count({ where: { accept_invite: true } });
  res.json({ count });
});

export default router;