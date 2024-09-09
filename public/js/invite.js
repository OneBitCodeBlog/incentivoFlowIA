document.addEventListener('DOMContentLoaded', () => {
  const loadCampaign = async () => {
      const pathArray = window.location.pathname.split('/');
      const slug = pathArray[2];  // Pegando corretamente o slug da campanha

      if (!slug) {
          displayError('Slug não encontrado na URL 😱');
          return;
      }

      try {
          const response = await fetch(`/api/campaigns/${slug}`);
          const data = await response.json();
          
          if (!response.ok || data.error) {
              displayError('Campanha não encontrada 😱');
              return;
          }

          populateCampaign(data);
      } catch (error) {
          displayError('Erro ao carregar a campanha 😱');
      }
  };

  const populateCampaign = (campaign) => {
      // Preencher o título superior
      document.querySelector('h1#main_title').textContent = "Sua recompensa foi enviada por email 🎉";

      // Preencher os textos à direita do vídeo com os dados da segunda recompensa
      document.querySelector('h4#second_reward_title').textContent = campaign.second_reward_title || 'Título da segunda recompensa';
      document.querySelector('p#second_reward_text').textContent = campaign.second_reward_text || 'Texto da segunda recompensa';

      // Atualizar o vídeo da segunda recompensa
      if (campaign.second_reward_video_url) {
          const videoPlaceholder = document.querySelector('.video-placeholder iframe');
          const youtubeEmbedUrl = transformYouTubeUrl(campaign.second_reward_video_url);
          videoPlaceholder.setAttribute('src', youtubeEmbedUrl);
      }

      // Capturar o slug do lead e gerar o link de convite
      const leadSlug = getLeadSlug();
      const inviteLink = `${window.location.origin}/c/${campaign.slug}?invited_by_lead_slug=${leadSlug}`;
      document.querySelector('input#user_invite_link').value = inviteLink;

      // Atualizar os links de compartilhamento para redes sociais
      updateSocialLinks(inviteLink, campaign.second_reward_invite_text, campaign.first_reward_title);

      // Preencher o texto final sobre a recompensa
      document.querySelector('span#required_friends').textContent = campaign.required_leads_for_second_reward || '3';
      document.querySelector('span#first_reward_title').textContent = campaign.first_reward_title || 'Primeira recompensa';
  };

  const transformYouTubeUrl = (url) => {
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
  };

  const updateSocialLinks = (inviteLink, inviteText, firstRewardTitle) => {
      const encodedMessage = encodeURIComponent(`${inviteText}. Participe da campanha e ganhe a recompensa: ${firstRewardTitle}.`);
      document.querySelector('#share_twitter').href = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${inviteLink}`;
      document.querySelector('#share_linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${inviteLink}`;
      document.querySelector('#share_instagram').href = `https://www.instagram.com/?url=${inviteLink}`; // Instagram não tem API de compartilhamento direto
      document.querySelector('#share_facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${inviteLink}`;
  };

  const getLeadSlug = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('lead_slug') || 'unknown_slug';  // Corrigido para pegar o 'lead_slug'
  };

  const displayError = (message) => {
      document.body.innerHTML = `
          <div class="d-flex flex-column justify-content-center align-items-center" style="height: 100vh;">
              <h1>${message}</h1>
          </div>
      `;
  };

  loadCampaign();
});

function copyInviteLink() {
  const inviteLinkInput = document.getElementById('user_invite_link');
  inviteLinkInput.select();
  inviteLinkInput.setSelectionRange(0, 99999); // Para dispositivos móveis
  document.execCommand('copy');

  // Exibir um alert SweetAlert confirmando a cópia do link
  Swal.fire({
    icon: 'success',
    title: 'Link copiado!',
    text: 'Seu link de convite foi copiado para a área de transferência.',
    confirmButtonColor: '#F64348'
  });
}
