import LeadCampaign from '../models/leadCampaign.js';

const campaignResourceOptions = {
  properties: {
    id: { position: 1, isVisible: false },
    slug: { position: 2, description: 'Identificador único da campanha usado como sub-URL.' },
    title: { position: 3, description: 'Título da campanha.' },
    description: { position: 4, description: 'Descrição detalhada da campanha.' },
    status: { position: 5, description: 'Indicador se a campanha está ativa.' },
    available_at: { position: 6, description: 'Data limite de disponibilidade da campanha.' },
    user_id: { position: 7, description: 'Identificador do usuário criador da campanha.' },
    first_reward_title: { position: 8, description: 'Título da primeira recompensa.' },
    first_reward_text: { position: 9, description: 'Descrição da primeira recompensa.' },
    first_reward_video_url: { position: 10, description: 'URL do vídeo da primeira recompensa.' },
    first_reward_how_it_works_title: { position: 11, description: 'Título de como funciona a primeira recompensa.' },
    first_reward_how_it_works_text: { position: 12, description: 'Descrição de como funciona a primeira recompensa.' },
    first_reward_how_it_works_img_url: { position: 13, description: 'URL da imagem explicativa da primeira recompensa.' },
    second_reward_title: { position: 14, description: 'Título da segunda recompensa.' },
    second_reward_subtitle: { position: 15, description: 'Subtítulo da segunda recompensa.' },
    second_reward_text: { position: 16, description: 'Descrição da segunda recompensa.' },
    second_reward_video_url: { position: 17, description: 'URL do vídeo da segunda recompensa.' },
    second_reward_invite_title: { position: 18, description: 'Título para incentivar os convites para a segunda recompensa.' },
    second_reward_invite_text: { position: 19, description: 'Texto para incentivar os convites para a segunda recompensa.' },
    thanks_title: { position: 20, description: 'Título da página de agradecimento.' },
    thanks_text: { position: 21, description: 'Texto da página de agradecimento.' },
    first_reward_email_title: { position: 22, description: 'Título do email da primeira recompensa.' },
    first_reward_email_text: { position: 23, description: 'Texto do email da primeira recompensa.' },
    first_reward_email_link: { position: 24, description: 'Link do email da primeira recompensa.' },
    second_reward_email_title: { position: 25, description: 'Título do email da segunda recompensa.' },
    second_reward_email_text: { position: 26, description: 'Texto do email da segunda recompensa.' },
    second_reward_email_link: { position: 27, description: 'Link do email da segunda recompensa.' },
    invite_email_title: { position: 28, description: 'Título do email de convite.' },
    invite_email_reward: { position: 29, description: 'Descrição da recompensa no email de convite.' },
    created_at: { position: 30, isVisible: false },
    updated_at: { position: 31, isVisible: false },
    leadCampaignCount: {
      position: 32,
      isVisible: { list: true, filter: false, show: true, edit: false },
    },
    acceptedLeadCampaignCount: {
      position: 33,
      isVisible: { list: true, filter: false, show: true, edit: false },
    },
  },
  actions: {
    list: {
      after: async (response) => {
        const records = response.records;
        for (const record of records) {
          const campaignId = record.params.id;
          record.params.leadCampaignCount = await LeadCampaign.count({ where: { campaign_id: campaignId } });
          record.params.acceptedLeadCampaignCount = await LeadCampaign.count({ where: { campaign_id: campaignId, accept_invite: true } });
        }
        return response;
      },
    },
  },
  listProperties: [
    'slug', 'title', 'description', 'status', 'leadCampaignCount', 'acceptedLeadCampaignCount'
  ],
};

export default campaignResourceOptions;
