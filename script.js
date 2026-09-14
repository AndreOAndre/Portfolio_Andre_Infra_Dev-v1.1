window.addEventListener('load', () => {
    setTimeout(() => {
        const tooltip = document.getElementById('readerTooltip');
        const text = "Acessibilidade";
        let i = 0;
        
        tooltip.style.opacity = "1";
        tooltip.style.padding = "8px 12px";
        tooltip.style.border = "1px solid #29292e";
        
        const typeWriter = setInterval(() => {
            if (i < text.length) {
                tooltip.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typeWriter);
                setTimeout(() => {
                    tooltip.style.opacity = "0";
                    setTimeout(() => {
                        tooltip.style.padding = "0";
                        tooltip.style.border = "transparent";
                        tooltip.innerHTML = "";
                    }, 500);
                }, 2000);
            }
        }, 70); 
    }, 3000); 
});

const readerBtn = document.getElementById('readerBtn');
let isReaderActive = false;
let synthesis = window.speechSynthesis;
let preferredVoice = null;

function clearHighlights() {
    document.querySelectorAll('.reading-highlight').forEach(el => {
        el.classList.remove('reading-highlight');
    });
}

function loadVoices() {
    const voices = synthesis.getVoices();
    preferredVoice = voices.find(voice => 
        voice.lang === 'pt-BR' && 
        (voice.name.includes('Luciana') || voice.name.includes('Maria') || voice.name.includes('Google') || voice.name.includes('Feminina'))
    ) || voices.find(voice => voice.lang.includes('pt-BR'));
}

if (speechSynthesis.onvoiceschanged !== undefined) { 
    speechSynthesis.onvoiceschanged = loadVoices; 
}
loadVoices();

readerBtn.addEventListener('click', () => {
    isReaderActive = !isReaderActive;
    
    if (isReaderActive) {
        readerBtn.classList.add('active');
        readerBtn.title = "Desativar Leitor de Tela";
    } else {
        readerBtn.classList.remove('active');
        readerBtn.title = "Ativar Leitor de Tela";
        synthesis.cancel(); 
        clearHighlights(); 
    }
});

const readableElements = document.querySelectorAll('.readable, h1, h2, h3, p');

readableElements.forEach(element => {
    element.addEventListener('click', function(e) {
        if (!isReaderActive) return; 
        
        e.stopPropagation();
        clearHighlights(); 
        synthesis.cancel();

        const textToRead = this.innerText;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR'; 
        
        if (preferredVoice) { 
            utterance.voice = preferredVoice; 
        }

        utterance.pitch = 0.8; 
        utterance.rate = 0.85; 

        this.classList.add('reading-highlight');
        
        utterance.onend = () => { 
            this.classList.remove('reading-highlight'); 
        };

        utterance.onerror = () => {
            this.classList.remove('reading-highlight'); 
        };

        synthesis.speak(utterance);
    });
});