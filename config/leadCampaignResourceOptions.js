const leadResourceOptions = {
  properties: {
      id: {
          position: 1,
          isVisible: false,
      },
      name: {
          position: 2,
          description: 'Nome do lead.',
      },
      email: {
          position: 3,
          description: 'Email do lead.',
      },
      whatsapp: {
          position: 4,
          description: 'Número de WhatsApp do lead.',
      },
      created_at: {
          position: 5,
          isVisible: false,
      },
      updated_at: {
          position: 6,
          isVisible: false,
      },
  },
};

export default leadResourceOptions;
