import express from 'express';
import Campaign from '../models/campaign.js';
import Lead from '../models/lead.js';
import LeadCampaign from '../models/leadCampaign.js';
import rateLimit from 'express-rate-limit';
import sendEmail from '../config/email.js';

const router = express.Router();

// Configuração do middleware de limitação de taxa
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // Limite de 10 solicitações por IP por janela de 1 minuto
  message: 'Você excedeu o limite de 10 solicitações por minuto!',
});

// Aplicar o middleware de limitação de taxa a todas as rotas
router.use(limiter);

// Endpoint: Obter Informações da Campanha
router.get('/campaigns/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Registrar Lead em Campanha
router.post('/campaigns/:slug/register', async (req, res) => {
  const { slug } = req.params;
  const { lead_name, lead_email, lead_whatsapp } = req.body;
  try {
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    let lead = await Lead.findOne({ where: { email: lead_email } });
    if (!lead) {
      lead = await Lead.create({
        name: lead_name,
        email: lead_email,
        whatsapp: lead_whatsapp,
      });
    }

    await LeadCampaign.create({
      user_id: campaign.user_id,
      campaign_id: campaign.id,
      lead_id: lead.id,
      accept_invite: false,
      invited_by_lead_id: null,  // Ajuste conforme necessário
    });

    // Envia email de confirmação
    await sendEmail(
      lead_email,
      'Registro bem-sucedido na campanha',
      `Olá ${lead_name}, você foi registrado com sucesso na campanha ${campaign.title}.`,
      `<p>Olá ${lead_name},</p><p>Você foi registrado com sucesso na campanha <strong>${campaign.title}</strong>.</p>`
    );

    res.json({
      success: true,
      message: 'Lead registrado com sucesso.',
      lead: lead,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Enviar Convite
router.post('/campaigns/:slug/invite', async (req, res) => {
  const { slug } = req.params;
  const { lead_email, lead_name, invited_by_lead_id } = req.body;
  try {
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    let lead = await Lead.findOne({ where: { email: lead_email } });
    if (!lead) {
      lead = await Lead.create({
        name: lead_name,
        email: lead_email,
        whatsapp: '',
      });
    }

    const [leadCampaign, created] = await LeadCampaign.findOrCreate({
      where: {
        campaign_id: campaign.id,
        lead_id: lead.id,
      },
      defaults: {
        user_id: campaign.user_id,
        invited_by_lead_id: invited_by_lead_id,
        accept_invite: false,
      },
    });

    if (!created) {
      leadCampaign.invited_by_lead_id = invited_by_lead_id;
      await leadCampaign.save();
    }

    // Envia email de convite
    await sendEmail(
      lead_email,
      'Você foi convidado para participar da campanha',
      `Olá ${lead_name}, você foi convidado para participar da campanha ${campaign.title}.`,
      `<p>Olá ${lead_name},</p><p>Você foi convidado para participar da campanha <strong>${campaign.title}</strong>.</p>`
    );

    res.json({
      success: true,
      message: 'Convite enviado com sucesso.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Aceitar Convite
router.get('/campaigns/:campaign_id/leads/:lead_id/accept_invite', async (req, res) => {
  const { campaign_id, lead_id } = req.params;
  try {
    const campaign = await Campaign.findByPk(campaign_id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const leadCampaign = await LeadCampaign.findOne({ where: { campaign_id, lead_id } });
    if (!leadCampaign) {
      return res.status(404).json({ error: 'LeadCampaign not found' });
    }

    if (leadCampaign.accept_invite) {
      return res.status(400).json({ error: 'Invitation already accepted' });
    }

    leadCampaign.accept_invite = true;
    leadCampaign.accepted_at = new Date();
    await leadCampaign.save();

    const invitedByLeadId = leadCampaign.invited_by_lead_id;
    if (invitedByLeadId) {
      const acceptedLeadsCount = await LeadCampaign.count({
        where: {
          campaign_id: campaign.id,
          invited_by_lead_id: invitedByLeadId,
          accept_invite: true,
        },
      });

      if (acceptedLeadsCount === 3) {
        // Envia a segunda recompensa para o invited_by_lead_id
        await sendEmail(
          'invited_by_lead_email', // Trocar pelo email do invited_by_lead_id
          'Você ganhou a segunda recompensa',
          'Parabéns! Você ganhou a segunda recompensa.',
          '<p>Parabéns!</p><p>Você ganhou a segunda recompensa.</p>'
        );
      }
    }

    res.json({
      lead_id: leadCampaign.lead_id,
      invited_by_lead_id: leadCampaign.invited_by_lead_id,
      accept_invite: leadCampaign.accept_invite,
      accepted_at: leadCampaign.accepted_at,
      created_at: leadCampaign.created_at,
      updated_at: leadCampaign.updated_at,
      message: 'Convite aceito com sucesso.',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
