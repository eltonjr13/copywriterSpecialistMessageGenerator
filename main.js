const numeroDeWhatsapp = document.querySelector('#numero-whatsapp');
const messageBox = document.querySelector('#mensagem');
const aBtn = document.querySelector('.a-chat');
const seletorPais = document.getElementById('seletor-de-pais');
const generateBtn = document.querySelector('.btn-generate');
const nichoInput = document.querySelector('#nicho');

generateBtn.addEventListener('click', async () => {
    const nicho = nichoInput.value.trim();
    const prompt = `
    Sou um desenvolvedor especializado em soluções automatizadas para captação de clientes. Estou desenvolvendo um sistema que usa a API do ChatGPT para iniciar conversas eficazes com potenciais clientes em diversos nichos. Quero criar mensagens de alta conversão para atrair e engajar clientes, personalizando cada mensagem de acordo com o nicho específico. As mensagens devem ser pessoais e humanas, utilizando técnicas avançadas de copywriting. 
    
    A mensagem deve ser curta, com no máximo 3 linhas, e seguir esta estrutura:
    
    1. Atenção: Começar com um gancho que chame a atenção do cliente imediatamente baseado no seu ${nicho}.
    2. Interesse: Apresentar algo de interesse direto para o cliente no ${nicho} específico.
    3. Desejo: Gerar um desejo pelo serviço oferecido ${nicho}, destacando benefícios e diferenciais.
    4. Ação: Incluir uma chamada para ação clara e convincente baseado no ${nicho}.
    
    Gere apenas uma mensagem curta sem introdução ou formatação extra (sem aspas, sem títulos, sem '[Nome da Empresa]'). Não se apresente como uma empresa, mas sim como eu (Elton), alguém que quer solucionar os problemas do cliente.
    `;
    
    
    

    try {
        const response = await fetch('http://192.168.15.14:3001/generate-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Server response:', data);  // Log the response for debugging
        messageBox.value = data.message.trim();
    } catch (error) {
        console.error('Error generating message:', error);
        alert('Error generating message: ' + error.message);
    }
});

aBtn.addEventListener('click', () => {
    let numero = numeroDeWhatsapp.value;
    let pais = seletorPais.value;
    let message = messageBox.value;
    console.log("O número é ", pais + numero);
    console.log("A mensagem é: ", message);
    numero = numero.replace(/\D/g, '');

    if (!numero) return;
    aBtn.href = `https://wa.me/${pais}${numero}?text=${encodeURIComponent(message)}`;
});

// Function to key "Enter"
numeroDeWhatsapp.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        aBtn.click();
    }
});
