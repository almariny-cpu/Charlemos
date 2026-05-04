const socket = io();
let miNick = "";
let miAvatar = "👤";

function seleccionarAvatar(el) {
    document.querySelectorAll('.grid-avatares span').forEach(s => s.classList.remove('seleccionado'));
    el.classList.add('seleccionado');
    miAvatar = el.innerText;
}

function entrar() {
    const input = document.getElementById('nick-input');
    if (input.value.trim() !== "") {
        miNick = input.value;
        document.getElementById('pantalla-registro').classList.remove('activa');
        document.getElementById('sala-chat').classList.add('activa');
        
        // Agregarme a la lista
        const lista = document.getElementById('lista-usuarios');
        lista.innerHTML += `<div class="user-tag">🟢 ${miNick}</div>`;
    }
}

function enviar() {
    const input = document.getElementById('input');
    if (input.value.trim() !== "") {
        const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        socket.emit('mensaje-a-ny', {
            user: miNick,
            avatar: miAvatar,
            cuerpo: input.value,
            tiempo: hora
        });
        input.value = "";
    }
}

socket.on('mensaje-desde-servidor', (data) => {
    const box = document.getElementById('mensajes');
    const esMio = data.user === miNick;
    
    const div = document.createElement('div');
    div.className = `burbuja ${esMio ? 'mia' : 'suya'}`;
    
    div.innerHTML = `
        <span style="font-size: 24px;">${data.avatar}</span>
        <div class="c">
            <span class="nick-bubble">${data.user}</span>
            <span class="texto-msg">${data.cuerpo}</span>
            <span class="texto-info">${data.tiempo}</span>
        </div>
    `;
    
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});

// Enviar con Enter
document.getElementById('input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviar();
});
