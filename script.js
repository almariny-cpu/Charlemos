const socket = io();
let miNick = "";
let miAvatar = "";

function iniciarSesion() {
    const input = document.getElementById('nick-input');
    if (input.value.trim() !== "") {
        miNick = input.value;
        miAvatar = `https://dicebear.com{miNick}`;
        document.getElementById('login-screen').classList.add('hidden');
        
        // Añadirme a la lista local
        const lista = document.getElementById('lista-nicks');
        lista.innerHTML += `
            <div class="flex items-center gap-3 p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <img src="${miAvatar}" class="w-10 h-10 rounded-full bg-slate-800">
                <span class="font-bold text-blue-400">${miNick} (Tú)</span>
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
    div.className = `flex ${esMio ? 'justify-end' : 'justify-start'} w-full`;
    
    div.innerHTML = `
        <div class="flex ${esMio ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%]">
            <img src="${data.avatar}" class="w-8 h-8 rounded-full bg-slate-700 shadow-md">
            <div class="burbuja ${esMio ? 'mia' : 'otra'}">
                <p class="text-[10px] font-black uppercase tracking-wider opacity-60 mb-1">${data.user}</p>
                <p>${data.cuerpo}</p>
            </div>
        </div>
    `;
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});
