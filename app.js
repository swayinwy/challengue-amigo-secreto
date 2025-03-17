let amigos = [];
let amigosSorteados = [];

document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML += `
        <div id="modal" class="modal" style="display: none;">
            <div class="modal-content">
                <img src="assets/error-icon.png" class="error-icon" alt="Error">
                <p id="modal-message"></p>
                <button class="ok-button" onclick="cerrarModal()">OK</button>
            </div>
        </div>
        <canvas id="confetti-canvas"></canvas>
        <style>
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: #121212;
                color: white;
                padding: 50px;
                border-radius: 15px;
                text-align: center;
                width: 600px;
                font-size: 24px;
                box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
                position: relative;
            }
            .error-icon {
                width: 80px;
                height: 80px;
                margin-bottom: 20px;
            }
            .ok-button {
                background: #ff4444;
                color: white;
                border: none;
                padding: 15px 30px;
                font-size: 20px;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 20px;
            }
            .ok-button:hover {
                background: #cc0000;
            }
            #confetti-canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 999;
            }
        </style>
    `;

    document.getElementById("amigo").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            agregarAmigo();
        }
    });
});

function mostrarMensaje(mensaje) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    
    modalMessage.textContent = mensaje;
    modal.style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

function agregarAmigo() {
    const input = document.getElementById("amigo");
    const nombre = input.value.trim();

    if (nombre === "") {
        mostrarMensaje("Por favor, inserte un nombre.");
        return;
    }
    
    if (amigos.includes(nombre)) {
        mostrarMensaje("Este nombre ya ha sido agregado.");
        return;
    }
    
    amigos.push(nombre);
    input.value = "";
    actualizarLista();
}

function actualizarLista() {
    const lista = document.getElementById("listaAmigos");
    lista.innerHTML = "";
    
    amigos.forEach((amigo) => {
        const li = document.createElement("li");
        li.textContent = amigo;
        lista.appendChild(li);
    });
}

function sortearAmigo() {
    if (amigos.length === 0) {
        mostrarMensaje("No hay amigos para sortear.");
        return;
    }
    
    if (amigosSorteados.length === amigos.length) {
        mostrarMensaje("Ya se sortearon todos los amigos secretos.");
        return;
    }
    
    let amigoSorteado;
    do {
        const indiceAleatorio = Math.floor(Math.random() * amigos.length);
        amigoSorteado = amigos[indiceAleatorio];
    } while (amigosSorteados.includes(amigoSorteado));
    
    amigosSorteados.push(amigoSorteado);
    document.getElementById("resultado").innerHTML = `<li>El amigo secreto es: <strong>${amigoSorteado}</strong></li>`;
    lanzarConfeti();
}

function lanzarConfeti() {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let confetti = [];
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            speed: Math.random() * 6 + 4,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((c) => {
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateConfetti() {
        confetti.forEach((c) => {
            c.y += c.speed;
            if (c.y > canvas.height) c.y = -10;
        });
    }

    function animateConfetti() {
        drawConfetti();
        updateConfetti();
        requestAnimationFrame(animateConfetti);
    }

    animateConfetti();
    setTimeout(() => (canvas.width = canvas.height = 0), 1000);
}
