import express from 'express';
import Campaign from '../models/campaign.js';
import Lead from '../models/lead.js';
import LeadCampaign from '../models/leadCampaign.js';
import { sendEmail } from '../utils/email.js'; // Importar a função de envio de email

const router = express.Router();

// Obter Informações da Campanha
router.get('/campaigns/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a campanha' });
  }
});

// Registrar Lead em Campanha
router.post('/campaigns/:slug/register', async (req, res) => {
  const { slug } = req.params;
  const { lead_name, lead_email, lead_whatsapp } = req.body;
  try {
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    if (!lead_email || !lead_name || !lead_whatsapp) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    let lead = await Lead.findOne({ where: { email: lead_email } });
    if (!lead) {
      lead = await Lead.create({ name: lead_name, email: lead_email, whatsapp: lead_whatsapp });
    }

    // Enviar email de confirmação de registro
    await sendEmail(lead_email, 'Bem-vindo à campanha!', `Você se registrou com sucesso na campanha "${campaign.title}".`);

    res.json({ success: true, message: 'Lead registrado com sucesso.', lead });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar o lead' });
  }
});

// Enviar Convite
router.post('/campaigns/:slug/invite', async (req, res) => {
  const { slug } = req.params;
  const { lead_email, lead_name, invited_by_lead_id } = req.body;
  try {
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    if (!lead_email || !lead_name) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const inviterLead = await Lead.findByPk(invited_by_lead_id);
    if (!inviterLead) {
      return res.status(400).json({ error: 'Lead que convidou não encontrado' });
    }

    let lead = await Lead.findOne({ where: { email: lead_email } });
    if (!lead) {
      lead = await Lead.create({ name: lead_name, email: lead_email });
    }

    let leadCampaign = await LeadCampaign.findOne({ where: { lead_id: lead.id, campaign_id: campaign.id } });
    if (!leadCampaign) {
      leadCampaign = await LeadCampaign.create({
        lead_id: lead.id,
        campaign_id: campaign.id,
        user_id: campaign.user_id,
        invited_by_lead_id: inviterLead.id, // Atribuir o ID do lead que convidou
        accept_invite: false
      });
    }

    // Enviar email de convite
    await sendEmail(lead_email, 'Convite para a campanha!', `Seu amigo ${inviterLead.name} te convidou para a campanha "${campaign.title}".`);

    res.json({ success: true, message: 'Convite enviado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar o convite' });
  }
});

// Aceitar Convite
router.get('/campaigns/:slug/leads/:lead_id/accept_invite', async (req, res) => {
  const { slug, lead_id } = req.params;
  try {
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    const leadCampaign = await LeadCampaign.findOne({ where: { campaign_id: campaign.id, lead_id } });
    if (!leadCampaign) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    if (leadCampaign.accept_invite) {
      return res.status(400).json({ error: 'Convite já aceito' });
    }

    leadCampaign.accept_invite = true;
    leadCampaign.accepted_at = new Date();
    await leadCampaign.save();

    const inviterLeadCampaigns = await LeadCampaign.findAll({ where: { invited_by_lead_id: leadCampaign.invited_by_lead_id, accept_invite: true } });
    if (inviterLeadCampaigns.length >= 3) {
      const inviterLead = await Lead.findByPk(leadCampaign.invited_by_lead_id);
      // Enviar email de recompensa
      await sendEmail(inviterLead.email, 'Parabéns!', 'Você ganhou a segunda recompensa!');
    }

    res.json({
      lead_id,
      invited_by_lead_id: leadCampaign.invited_by_lead_id,
      accept_invite: leadCampaign.accept_invite,
      accepted_at: leadCampaign.accepted_at,
      created_at: leadCampaign.created_at,
      updated_at: leadCampaign.updated_at,
      message: 'Convite aceito com sucesso.',
      redirect_url: `/campaign/${campaign.slug}/thanks`
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aceitar o convite' });
  }
});

export default router;
