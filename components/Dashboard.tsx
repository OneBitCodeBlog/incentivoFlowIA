import React, { useEffect, useState } from 'react';
import { Box, H2, H5, Text } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import { styled } from '@adminjs/design-system/styled-components';

const api = new ApiClient();

const Dashboard = () => {
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
    <Box data-css="default-dashboard">
      <Box
        position="relative"
        overflow="hidden"
        bg="white"
        height={300}
        py={74}
        px={[ 'default', 'lg', 250 ]}
      >
        <Text textAlign="center" color="grey100">
          <H2 fontWeight="bold">Bem-vindo ao Painel de Controle</H2>
          <Text opacity={0.8}>Aqui estão algumas métricas importantes:</Text>
        </Text>
      </Box>
      <Box
        mt={['xl', 'xl', '-100px']}
        mb="xl"
        mx={[0, 0, 0, 'auto']}
        px={['default', 'lg', 'xxl', '0']}
        position="relative"
        flex
        flexDirection="row"
        flexWrap="wrap"
        width={[1, 1, 1, 1024]}
      >
        <Box width={[1, 1 / 2, 1 / 2, 1 / 3]} p="lg">
          <Card>
            <Text textAlign="center">
              <H5>Número de Leads Gerados</H5>
              <H2>{data.leads}</H2>
            </Text>
          </Card>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2, 1 / 3]} p="lg">
          <Card>
            <Text textAlign="center">
              <H5>Leads Convidados</H5>
              <H2>{data.invitedLeads}</H2>
            </Text>
          </Card>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2, 1 / 3]} p="lg">
          <Card>
            <Text textAlign="center">
              <H5>Leads que Aceitaram Convite</H5>
              <H2>{data.acceptedLeads}</H2>
            </Text>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const Card = styled(Box)`
  display: block;
  color: ${({ theme }) => theme.colors.grey100};
  height: 100%;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.space.md};
  transition: all 0.1s ease-in;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary60};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

Card.defaultProps = {
  variant: 'container',
  boxShadow: 'card',
};

export default Dashboard;