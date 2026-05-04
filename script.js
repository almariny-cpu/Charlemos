const socket = io();
let miNick = "";
let miAvatar = "";

function iniciarSesion() {
    const input = document.getElementById('nick-input');
    if (input.value.trim() !== "") {
        miNick = input.value;
        miAvatar = `https://dicebear.com{miNick}`; // Avatares de robots cool
        document.getElementById('login-screen').classList.add('hidden');
        
        // Notificar al servidor que entramos
        socket.emit('nuevo-usuario', { nick: miNick, avatar: miAvatar });
    }
}

function enviarMensaje() {
    const input = document.getElementById('msg-input');
    if (input.value.trim() !== "") {
        socket.emit('mensaje-a-ny', {
            user: miNick,
            avatar: miAvatar,
            cuerpo: input.value
        });
        input.value = "";
        input.style.height = 'auto';
    }
}

socket.on('mensaje-desde-servidor', (data) => {
    const chatBox = document.getElementById('chat-box');
    const esMio = data.user === miNick;
    
    const div = document.createElement('div');
    div.className = `flex ${esMio ? 'justify-end' : 'justify-start'} w-full`;
    
    div.innerHTML = `
        <div class="flex ${esMio ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]">
            <img src="${data.avatar}" class="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700">
            <div class="burbuja ${esMio ? 'mia' : 'otra'}">
                <p class="text-[10px] font-bold mb-1 opacity-70">${data.user}</p>
                <p class="text-sm">${data.cuerpo}</p>
            </div>
        </div>
    `;
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Auto-ajustar tamaño del textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Enviar con Enter
document.getElementById('msg-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
    }
});
