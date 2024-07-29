const leadCampaignResourceOptions = {
    properties: {
        id: {
            position: 1,
            isVisible: false,
        },
        user_id: {
            position: 2,
            description: 'Identificador do usuário criador da campanha.',
        },
        campaign_id: {
            position: 3,
            description: 'Identificador da campanha.',
        },
        lead_id: {
            position: 4,
            description: 'Identificador do lead.',
        },
        invited_by_lead_id: {
            position: 5,
            description: 'Identificador do lead que convidou este lead.',
        },
        accept_invite: {
            position: 6,
            description: 'Indicador se o lead aceitou o convite.',
        },
        accepted_at: {
            position: 7,
            description: 'Data em que o lead aceitou o convite.',
        },
        created_at: {
            position: 8,
            isVisible: false,
        },
        updated_at: {
            position: 9,
            isVisible: false,
        },
    },
  };
  
  export default leadCampaignResourceOptions;