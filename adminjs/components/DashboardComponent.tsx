import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, H3, Text, theme } from '@adminjs/design-system';
import styled, { ThemeProvider } from 'styled-components';

// Define types for the data
interface DashboardData {
  leadsCount: number;
  leadsCampaignCount: number;
  acceptedLeadsCount: number;
}

// Styled components
const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NumberText = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
`;

// Component definition
const DashboardComponent: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    leadsCount: 0,
    leadsCampaignCount: 0,
    acceptedLeadsCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsCountResponse = await axios.get('/api/dashboard/leads-count');
        const leadsCampaignCountResponse = await axios.get('/api/dashboard/leads-campaign-count');
        const acceptedLeadsCountResponse = await axios.get('/api/dashboard/accepted-leads-count');

        setData({
          leadsCount: leadsCountResponse.data.count,
          leadsCampaignCount: leadsCampaignCountResponse.data.count,
          acceptedLeadsCount: acceptedLeadsCountResponse.data.count,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box variant="white" m="xxl" p="xl" flex flexDirection="row" justifyContent="space-between">
        <StyledBox>
          <H3>Leads Gerados</H3>
          <NumberText>{data.leadsCount}</NumberText>
        </StyledBox>
        <StyledBox>
          <H3>Leads Convidados</H3>
          <NumberText>{data.leadsCampaignCount}</NumberText>
        </StyledBox>
        <StyledBox>
          <H3>Convite OK</H3>
          <NumberText>{data.acceptedLeadsCount}</NumberText>
        </StyledBox>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardComponent;
