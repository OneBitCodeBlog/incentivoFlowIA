const leadCampaignResourceOptions = {
    properties: {
        id: {
            position: 1,
            isVisible: true, // Torna visível para ajudar na ordenação
        },
        campaign_id: {
            position: 2,
            description: 'Identificador da campanha.',
        },
        lead_id: {
            position: 3,
            description: 'Identificador do lead.',
        },
        invited_by_lead_id: {
            position: 4,
            description: 'Identificador do lead que convidou este lead.',
        },
        first_reward_claimed: {
            position: 5,
            description: 'Indica se a primeira recompensa foi reclamada.',
        },
        second_reward_claimed: {
            position: 6,
            description: 'Indica se a segunda recompensa foi reclamada.',
        },
        second_reward_send: {
            position: 7,
            description: 'Indica se a segunda recompensa foi enviada.',
        },
    },
};

export default leadCampaignResourceOptions;
