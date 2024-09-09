import ejs from 'ejs';
import path from 'path';
import { sendEmail } from './email.js';

const sendRewardEmail = async (lead_email, lead_name, campaign, lead_slug, base_url) => {
  const emailTemplatePath = path.resolve('views', 'emails', 'rewardEmail.ejs');

  // Dados para o template
  const data = {
    lead_name,
    campaign_title: campaign.title,
    campaign_first_reward: campaign.first_reward_title,
    claim_reward_url: `${base_url}/api/campaigns/${campaign.slug}/leads/${lead_slug}/claim_reward`,
    invite_url: `${base_url}/c/${campaign.slug}?invited_by_lead_slug=${lead_slug}`,
    required_leads_for_second_reward: campaign.required_leads_for_second_reward,
  };

  // Renderizar o email usando o template EJS
  const emailHtml = await ejs.renderFile(emailTemplatePath, data);

  // Enviar o email
  await sendEmail(lead_email, `Sua recompensa "${campaign.first_reward_title}" chegou`, emailHtml);
};

const sendSecondRewardEmail = async (email, name, campaign, lead_slug, base_url) => {
  const emailTemplatePath = path.resolve('views', 'emails', 'secondRewardEmail.ejs');

  // Dados para o template
  const data = {
    name,
    campaign_title: campaign.title,
    second_reward_title: campaign.second_reward_title,
    second_reward_text: campaign.second_reward_text,
    claim_second_reward_url: `${base_url}/api/campaigns/${campaign.slug}/leads/${lead_slug}/claim_second_reward`,
  };

  // Renderizar o email usando o template EJS
  const emailHtml = await ejs.renderFile(emailTemplatePath, data);

  // Enviar o email
  await sendEmail(email, `Você mereceu, aqui está sua recompensa "${campaign.second_reward_title}"`, emailHtml);
};

export { sendRewardEmail, sendSecondRewardEmail };
