// script.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site LIMA RPA SOLUTIONS carregado com sucesso!');

    // --- Menu Mobile ---
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden'); // Alterna a visibilidade do menu
        });

        // Fechar menu ao clicar em um link (para navegação suave)
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden'); // Esconde o menu após clicar
            });
        });
    }

    // --- Lógica de Envio do Formulário de Contato (Voltou a ser um alert()) ---
    // O formulário de contato foi removido do HTML, então esta lógica não será mais executada.
    // Mantida para referência, caso o formulário seja adicionado novamente.
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário
            // Em um ambiente real, você enviaria os dados para um servidor aqui
            // Por exemplo, usando `fetch()`:
            /*
            const formData = new FormData(contactForm);
            fetch('/api/send-email', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                    contactForm.reset(); // Limpa o formulário
                } else {
                    alert('Houve um erro ao enviar a mensagem. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro de conexão. Por favor, tente mais tarde.');
                alert('Erro de conexão. Por favor, tente mais tarde.');
            });
            */
            alert('Sua mensagem foi enviada! Em breve entraremos em contato.');
            contactForm.reset(); // Limpa o formulário após "envio"
        });
    }

    // --- Scroll Suave para Ancoras ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Previne o comportamento padrão do link (salto imediato)
            e.preventDefault();

            // Obtém o valor do atributo href
            const targetId = this.getAttribute('href');

            // Verifica se o targetId é válido (não é apenas '#' ou vazio)
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else {
                    console.warn(`Elemento com ID '${targetId}' não encontrado.`);
                }
            } else if (targetId === '#') {
                // Se for apenas '#', rola para o topo da página
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Funcionalidade do Gerador de Ideias de Solução RPA com AI (Gemini API) ---
    // A seção do gerador de ideias foi removida do HTML, então esta lógica não será mais executada.
    // Mantida para referência, caso a seção seja adicionada novamente.
    const generateSolutionBtn = document.getElementById('generateSolutionBtn');
    const businessChallengeInput = document.getElementById('businessChallenge');
    const solutionOutputDiv = document.getElementById('solutionOutput');
    const solutionTextP = document.getElementById('solutionText');
    const solutionLoadingDiv = document.getElementById('solutionLoading');
    const errorMessageDiv = document.getElementById('errorMessage');

    if (generateSolutionBtn && businessChallengeInput && solutionOutputDiv && solutionTextP && solutionLoadingDiv && errorMessageDiv) {
        generateSolutionBtn.addEventListener('click', async function() {
            const prompt = businessChallengeInput.value.trim();

            if (prompt === "") {
                solutionOutputDiv.classList.add('hidden');
                errorMessageDiv.classList.remove('hidden');
                errorMessageDiv.textContent = "Por favor, descreva seu desafio de negócio antes de gerar uma solução.";
                return;
            }

            solutionOutputDiv.classList.add('hidden');
            errorMessageDiv.classList.add('hidden');
            solutionLoadingDiv.classList.remove('hidden');
            solutionTextP.textContent = '';

            try {
                let chatHistory = [];
                chatHistory.push({
                    role: "user",
                    parts: [{ text: `Como uma empresa de soluções RPA, me dê uma ideia de como a Automação de Processos Robóticos (RPA) pode resolver o seguinte desafio de negócio: "${prompt}". Seja conciso, profissional e foque nos benefícios da RPA. Responda em português.` }]
                });

                const payload = { contents: chatHistory };
                const apiKey = "";
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    solutionTextP.textContent = text;
                    solutionOutputDiv.classList.remove('hidden');
                } else {
                    errorMessageDiv.classList.remove('hidden');
                    errorMessageDiv.textContent = "Ocorreu um erro ao gerar a solução. Tente novamente.";
                    console.error('Estrutura de resposta inesperada da API Gemini:', result);
                }
            } catch (error) {
                errorMessageDiv.classList.remove('hidden');
                errorMessageDiv.textContent = "Ocorreu um erro ao gerar a solução. Por favor, tente novamente.";
                console.error('Erro ao chamar a API Gemini:', error);
            } finally {
                solutionLoadingDiv.classList.add('hidden');
            }
        });
    }
});
