document.addEventListener('DOMContentLoaded', () => {
    const loadCampaign = async () => {
        const pathArray = window.location.pathname.split('/');
        const slug = pathArray[2];

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
        document.querySelector('h1').textContent = campaign.title;
        document.querySelector('h2.smaller-text').textContent = campaign.description;
        document.querySelector('p#how-it-works').textContent = campaign.first_reward_how_it_works_text;
        
        if (campaign.first_reward_video_url) {
            const videoPlaceholder = document.querySelector('.video-placeholder');
            const youtubeEmbedUrl = transformYouTubeUrl(campaign.first_reward_video_url);
            
            videoPlaceholder.innerHTML = `
                <iframe src="${youtubeEmbedUrl}" allowfullscreen></iframe>
            `;
        }

        const imgElement = document.querySelector('.how-it-works-image');
        imgElement.setAttribute('src', campaign.first_reward_how_it_works_img_url);
        imgElement.setAttribute('alt', campaign.first_reward_how_it_works_title);
    };

    const transformYouTubeUrl = (url) => {
        const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
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


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const params = new URLSearchParams(window.location.search);
    const invitedByLeadSlug = params.get('invited_by_lead_slug'); // Capturar o slug de quem convidou, se existir
    const pathArray = window.location.pathname.split('/');
    const campaignSlug = pathArray[2];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const leadName = document.getElementById('name').value;
        const leadEmail = document.getElementById('email').value;
        const leadWhatsapp = document.getElementById('whatsapp').value;

        // Verificar se todos os campos obrigatórios foram preenchidos
        if (!leadName || !leadEmail || !leadWhatsapp) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, preencha todos os campos obrigatórios (Nome, Email, WhatsApp).',
            });
            return;
        }

        // Construir os dados do formulário
        const data = {
            lead_name: leadName,
            lead_email: leadEmail,
            lead_whatsapp: leadWhatsapp,
        };

        if (invitedByLeadSlug) {
            data.invited_by_lead_slug = invitedByLeadSlug; // Adicionar o slug do lead que convidou, se existir
        }

        try {
            // Fazer a requisição para o backend
            const response = await fetch(`/api/campaigns/${campaignSlug}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // Mostrar mensagem de erro usando SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: result.error || 'Ocorreu um erro ao registrar o lead.',
                });
            } else {
                // Sucesso - Redirecionar para a página de convite com o slug do novo lead
                const leadSlug = result.lead.slug; // Pegar o slug do lead retornado
                window.location.href = `/c/${campaignSlug}/invite?lead_slug=${leadSlug}`;
            }
        } catch (error) {
            // Tratar erros que possam ocorrer na comunicação com o servidor
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            });
            console.error('Erro na requisição:', error);
        }
    });
});
