import express from 'express';
import Campaign from '../models/campaign.js';
import Lead from '../models/lead.js';
import LeadCampaign from '../models/leadCampaign.js';
import { sendEmail } from '../utils/email.js'; // Importar a função de envio de email
import { sendRewardEmail, sendSecondRewardEmail } from '../utils/emailTemplates.js';


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
  const { lead_name, lead_email, lead_whatsapp, invited_by_lead_slug } = req.body;
  
  try {
    // Verificar se a campanha existe
    const campaign = await Campaign.findOne({ where: { slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    // Validar os dados do lead
    if (!lead_email || !lead_name || !lead_whatsapp) {
      return res.status(400).json({ error: 'Dados inválidos: Nome, Email e WhatsApp são obrigatórios.' });
    }

    // Buscar o lead pelo email
    let lead = await Lead.findOne({ where: { email: lead_email } });
    if (!lead) {
      lead = await Lead.create({ name: lead_name, email: lead_email, whatsapp: lead_whatsapp });
    }

    // Verificar se há um lead que convidou
    let invitedByLead = null;
    if (invited_by_lead_slug) {
      invitedByLead = await Lead.findOne({ where: { slug: invited_by_lead_slug } });

      if (!invitedByLead) {
        console.log(`Lead convidado com slug ${invited_by_lead_slug} não encontrado.`);
      } else {
        console.log(`Lead convidado encontrado: ${invitedByLead.name}`);
      }
    }

    // Criar LeadCampaign associando o lead à campanha e ao possível convidado
    await LeadCampaign.create({
      lead_id: lead.id,
      campaign_id: campaign.id,
      invited_by_lead_id: invitedByLead ? invitedByLead.id : null
    });

    // Enviar email de confirmação de registro usando template
    const base_url = process.env.BASE_URL;
    await sendRewardEmail(lead_email, lead_name, campaign, lead.slug, base_url);

    res.json({ success: true, message: 'Lead registrado com sucesso.', lead });

  } catch (error) {
    console.error('Erro ao registrar o lead:', error);  
    res.status(500).json({ error: 'Erro ao registrar o lead', details: error.message }); 
  }
});


// Reivindicar Recompensa
router.get('/campaigns/:campaign_slug/leads/:lead_slug/claim_reward', async (req, res) => {
  const { campaign_slug, lead_slug } = req.params;
  try {
    // Verificar se a campanha e o lead existem
    const campaign = await Campaign.findOne({ where: { slug: campaign_slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    const lead = await Lead.findOne({ where: { slug: lead_slug } });
    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    // Atualizar o LeadCampaign para marcar que a primeira recompensa foi reclamada
    const leadCampaign = await LeadCampaign.findOne({ where: { campaign_id: campaign.id, lead_id: lead.id } });
    if (!leadCampaign) {
      return res.status(404).json({ error: 'Relação entre campanha e lead não encontrada' });
    }

    // Marcar que o lead reclamou a primeira recompensa
    leadCampaign.first_reward_claimed = true;
    await leadCampaign.save();

    // Verificar se o usuário que convidou atingiu o número necessário para receber a segunda recompensa
    if (leadCampaign.invited_by_lead_id) {
      // Contar quantos leads convidados pelo usuário que convidou já reclamaram a primeira recompensa
      const inviterLeadCampaignsCount = await LeadCampaign.count({
        where: {
          invited_by_lead_id: leadCampaign.invited_by_lead_id,
          first_reward_claimed: true,
        },
      });

      // Buscar o lead que convidou
      const inviterLead = await Lead.findByPk(leadCampaign.invited_by_lead_id);

      // Verificar se o número de convites aceitos atingiu o necessário para a segunda recompensa e se a segunda recompensa já foi enviada
      if (inviterLeadCampaignsCount >= campaign.required_leads_for_second_reward) {
        // Buscar o registro de LeadCampaign do usuário que convidou
        const inviterLeadCampaign = await LeadCampaign.findOne({
          where: {
            lead_id: inviterLead.id,
            campaign_id: campaign.id,
          },
        });

        if (!inviterLeadCampaign.second_reward_send) {
          const inviterLeadSlug = inviterLead.slug; // Slug do lead que convidou
          const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Certifique-se de que o baseUrl está definido
        
          // Enviar a segunda recompensa para o lead que convidou
          await sendSecondRewardEmail(inviterLead.email, inviterLead.name, campaign, inviterLeadSlug, baseUrl);
        
          // Marcar que a segunda recompensa foi enviada para o lead que convidou
          inviterLeadCampaign.second_reward_send = true;
          await inviterLeadCampaign.save();
        }
      }
    }

    // Redirecionar o usuário diretamente para o link da primeira recompensa
    res.redirect(campaign.first_reward_email_link);
  } catch (error) {
    console.error('Erro ao processar a recompensa:', error);
    res.status(500).json({ error: 'Erro ao processar a recompensa' });
  }
});


router.get('/campaigns/:campaign_slug/leads/:lead_slug/claim_second_reward', async (req, res) => {
  const { campaign_slug, lead_slug } = req.params;
  try {
    // Verificar se a campanha e o lead existem
    const campaign = await Campaign.findOne({ where: { slug: campaign_slug } });
    if (!campaign) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    const lead = await Lead.findOne({ where: { slug: lead_slug } });
    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    // Atualizar o LeadCampaign para marcar que a segunda recompensa foi reclamada
    const leadCampaign = await LeadCampaign.findOne({ where: { campaign_id: campaign.id, lead_id: lead.id } });
    if (!leadCampaign) {
      return res.status(404).json({ error: 'Relação entre campanha e lead não encontrada' });
    }

    // Marcar que o lead reclamou a segunda recompensa
    leadCampaign.second_reward_claimed = true;
    await leadCampaign.save();

    // Redirecionar o usuário diretamente para o link da segunda recompensa
    res.redirect(campaign.second_reward_email_link);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a segunda recompensa' });
  }
});

export default router;
