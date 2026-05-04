const socket = io();
let miNick = "";
let miAvatar = "";

function iniciarSesion() {
    const input = document.getElementById('nick-input');
    if (input.value.trim() !== "") {
        miNick = input.value;
        miAvatar = `https://dicebear.com{miNick}`;
        
        // 1. Ocultamos el login y MOSTRAMOS la app
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        
        // 2. Agregamos nuestro nick a la lista
        const lista = document.getElementById('lista-nicks');
        lista.innerHTML = `
            <div class="flex items-center gap-3 p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <img src="${miAvatar}" class="w-10 h-10 rounded-full bg-slate-800">
                <span class="font-bold text-blue-400 text-sm">${miNick} (Tú)</span>
            </div>
        `;
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
    }
}

socket.on('mensaje-desde-servidor', (data) => {
    const chatBox = document.getElementById('chat-box');
    const esMio = data.user === miNick;
    
    const div = document.createElement('div');
    div.className = `flex ${esMio ? 'justify-end' : 'justify-start'} w-full animate-in fade-in slide-in-from-bottom-2 duration-300`;
    
    div.innerHTML = `
        <div class="flex ${esMio ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%]">
            <img src="${data.avatar}" class="w-8 h-8 rounded-full bg-slate-700 shadow-sm">
            <div class="p-3 rounded-2xl text-sm shadow-md ${esMio ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-100 rounded-bl-none'}">
                <p class="text-[10px] font-black uppercase opacity-60 mb-1">${data.user}</p>
                <p>${data.cuerpo}</p>
            </div>
        </div>
    `;
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Enviar con Enter
document.getElementById('msg-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
    }
});
