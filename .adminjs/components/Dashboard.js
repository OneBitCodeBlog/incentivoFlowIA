import React, { useEffect, useState } from 'react';
import { ApiClient, useTranslation } from 'adminjs';

const api = new ApiClient();

const Dashboard = () => {
  const { translateMessage } = useTranslation();
  const [data, setData] = useState({
    leads: 0,
    invitedLeads: 0,
    acceptedLeads: 0
  });

  useEffect(() => {
    api.getDashboard().then(response => {
      setData(response.data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ flex: 1, textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '10px' }}>
        <h3>Número de Leads Gerados</h3>
        <h2>{data.leads}</h2>
      </div>
      <div style={{ flex: 1, textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '10px' }}>
        <h3>Leads Convidados</h3>
        <h2>{data.invitedLeads}</h2>
      </div>
      <div style={{ flex: 1, textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', margin: '10px' }}>
        <h3>Leads que Aceitaram Convite</h3>
        <h2>{data.acceptedLeads}</h2>
      </div>
    </div>
  );
};

export default Dashboard;