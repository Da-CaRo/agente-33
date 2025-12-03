import { TIPOS_CARTA, MODOS_DE_JUEGO, ETIQUETAS_MODOS, MODOS_DE_JUEGO_BANDERAS } from './config.js';

// =========================================================
// Funciones de Visibilidad y Estado del Tablero
// =========================================================

export let mostrarImagenes = false;

/**
 * Establece el estado inicial de visualización (imágenes vs. palabras) basado en el modo de juego.
 * Si el modo es de banderas, fuerza 'mostrarImagenes' a true.
 * @param {string} mode - El modo de juego seleccionado.
 */
export function setInitialDisplayMode(mode) {
    if (MODOS_DE_JUEGO_BANDERAS.includes(mode)) {
        mostrarImagenes = true;
    } else {
        mostrarImagenes = false;
    }
}

/**
 * Muestra los botones de inicio y oculta los controles del juego.
 */
export function mostrarBotonesInicio() {
    document.getElementById('start-buttons').classList.remove('hidden');
    document.getElementById('pass-turn-btn').classList.add('hidden');
    document.getElementById('show-key-btn').classList.add('hidden');
    document.getElementById('reset-game-btn').classList.add('hidden');
    document.getElementById('share-key-btn').classList.add('hidden');
    document.getElementById('toggle-display-btn').classList.add('hidden');
    document.getElementById('game-board').innerHTML = '<div class="text-center text-gray-400 text-3xl p-10 col-span-5">Selecciona el equipo que empieza para comenzar una nueva partida.</div>';
    document.getElementById('current-turn').innerHTML = 'Esperando inicio...';
    document.querySelector('#blue-score span').textContent = '-';
    document.querySelector('#red-score span').textContent = '-';
    document.querySelector('#green-score span').textContent = '-';
}

/**
 * Oculta los botones de inicio y muestra los controles del juego.
 */
export function ocultarBotonesInicio() {
    document.getElementById('start-buttons').classList.add('hidden');
    document.getElementById('pass-turn-btn').classList.remove('hidden');
    document.getElementById('show-key-btn').classList.remove('hidden');
    document.getElementById('reset-game-btn').classList.remove('hidden');
    document.getElementById('share-key-btn').classList.remove('hidden');
    document.getElementById('toggle-display-btn').classList.remove('hidden');
}

// =========================================================
// Funciones de Renderizado y Marcador
// =========================================================

/**
 * Actualiza los contadores de agentes en la interfaz.
 */
export function actualizarPuntuacion(azules, rojos, verdes, numTeams) {
    document.querySelector('#blue-score span').textContent = azules;
    document.querySelector('#red-score span').textContent = rojos;

    const greenScoreDiv = document.getElementById('green-score');

    if (numTeams === 3) {
        greenScoreDiv.classList.remove('hidden');
        greenScoreDiv.querySelector('span').textContent = verdes;
    } else {
        greenScoreDiv.classList.add('hidden');
    }
}

/** Actualiza el indicador del turno actual en la interfaz.
 * @param {string} turnoActual - El equipo cuyo turno es actualmente ('red' o 'blue').
 * @param {boolean} juegoTerminado - Indica si el juego ha terminado.
 * @param {string} mensajeFin - Mensaje a mostrar si el juego ha terminado.
 */
export function actualizarIndicadorTurno(turnoActual, juegoTerminado, mensajeFin) {
    if (juegoTerminado) {
        document.getElementById('current-turn').innerHTML = mensajeFin;
        document.getElementById('pass-turn-btn').disabled = true;
    } else {
        let color, textoTurno;
        if (turnoActual === TIPOS_CARTA.AZUL) {
            color = 'blue';
            textoTurno = 'Azul 🔵';
        } else if (turnoActual === TIPOS_CARTA.ROJO) {
            color = 'red';
            textoTurno = 'Rojo 🔴';
        } else if (turnoActual === TIPOS_CARTA.VERDE) {
            color = 'green';
            textoTurno = 'Verde 🟢';
        }
        document.getElementById('current-turn').innerHTML = `Turno: <span class="text-${color}-400">${textoTurno}</span>`;
        document.getElementById('pass-turn-btn').disabled = false;
    }
}

/** Renderiza el tablero de juego en la interfaz.
 * @param {Array} tableroLogico - El tablero lógico con las cartas y sus estados.
 * @param {Function} manejarClickTarjeta - Función para manejar el clic en una tarjeta.
 * @param {boolean} juegoTerminado - Indica si el juego ha terminado.
 * @param {boolean} forzarPalabras - Si es true, siempre muestra palabras (útil para el modo Líder de Espías).
 */
export function renderizarTablero(tableroLogico, manejarClickTarjeta, juegoTerminado, forzarPalabras = false) {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // Limpiamos el tablero

    tableroLogico.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.setAttribute('data-index', index);
        cardDiv.setAttribute('data-id', card.id);

        if (card.revealed) {
            let cssClass = '';
            switch (card.type) {
                case TIPOS_CARTA.ROJO: cssClass = 'bg-red-agent'; break;
                case TIPOS_CARTA.AZUL: cssClass = 'bg-blue-agent'; break;
                case TIPOS_CARTA.VERDE: cssClass = 'bg-green-agent'; break;
                case TIPOS_CARTA.NEUTRAL: cssClass = 'bg-neutral-agent'; break;
                case TIPOS_CARTA.ASESINO: cssClass = 'bg-assassin'; break;
            }
            cardDiv.className = `card ${cssClass} flex items-center justify-center p-1 sm:p-2 rounded-lg shadow-xl aspect-[16/9]`;
        } else {
            cardDiv.className = 'card bg-gray-200 text-gray-900 flex items-center justify-center p-1 sm:p-2 rounded-lg shadow-xl cursor-pointer hover:shadow-2xl transition duration-150 transform hover:scale-[1.01] aspect-[16/9]';
            if (!juegoTerminado) {
                cardDiv.addEventListener('click', manejarClickTarjeta);
            }
        }

        // Lógica para alternar entre imagen y palabra
        const shouldShowImage = mostrarImagenes && card.img && !forzarPalabras;
        let cardContent;

        if (shouldShowImage) {
            if (card.img.startsWith('img/')) {
                cardContent = `<img src="${card.img}" class="h-16"></img>`
            } else {
                cardContent = `<span class="fi fi-${card.img}" alt="${card.word}"></span>`;;

            }

        } else {
            cardContent = card.word
        }

        const textSpan = document.createElement('span');
        textSpan.className = 'card-text font-bold uppercase text-center';
        textSpan.innerHTML = cardContent;
        cardDiv.appendChild(textSpan);

        board.appendChild(cardDiv);

        if (juegoTerminado) {
            cardDiv.removeEventListener('click', manejarClickTarjeta);
        }
    });

}

/**
 * Actualiza el texto y el icono del botón de alternancia.
 */
export function actualizarTextoToggleBtn() {
    const toggleBtn = document.getElementById('toggle-display-btn');
    mostrarImagenes = !mostrarImagenes;
    if (toggleBtn) {
        if (toggleBtn.disabled) {
            toggleBtn.innerHTML = '🔠 Sin imágenes';
            toggleBtn.title = 'El modo de juego actual no admite imágenes';
            return;
        }
        if (mostrarImagenes) {
            toggleBtn.innerHTML = '🔠 Mostrar Palabras';
            toggleBtn.title = 'Cambiar a Palabras';
        } else {
            toggleBtn.innerHTML = '🖼️ Mostrar Imágenes';
            toggleBtn.title = 'Cambiar a Imágenes';
        }
    }
    
}

// =========================================================
// Funciones de Clave Secreta
// =========================================================

/**
 * Muestra la clave secreta en la consola para el líder de espías.
 * @param {Array} tableroLogico - El tablero lógico con las cartas y sus tipos.
 */
export function mostrarClaveEnConsola(tableroLogico) {
    if (!tableroLogico || tableroLogico.length !== 25) return;

    console.log("--- CLAVE SECRETA (PARA EL LÍDER DE ESPÍAS) ---");
    console.log("-----------------------------------------------");

    let claveConsola = "";
    for (let i = 0; i < 25; i++) {
        claveConsola += TIPOS_CARTA.MAPEO_EMOJI[tableroLogico[i].type];
        if ((i + 1) % 5 === 0) {
            claveConsola += "\n";
        }
    }

    console.log(claveConsola);
    console.log("-----------------------------------------------\n");
}

/**
 * Muestra la clave secreta en una alerta para el líder de espías.
 * @param {Array} tableroLogico - El tablero lógico con las cartas y sus tipos.
 */
export function mostrarClaveEnAlerta(tableroLogico) {
    let claveAlerta = "CLAVE SECRETA\n(LÍDER DE ESPÍAS):\n\n";
    for (let i = 0; i < 25; i++) {
        claveAlerta += TIPOS_CARTA.MAPEO_EMOJI[tableroLogico[i].type];
        if ((i + 1) % 5 === 0) {
            claveAlerta += "\n";
        }
    }


    // 2. Ocultar el QR y mostrar el código
    document.getElementById('qr-canvas').classList.add('hidden');
    document.getElementById('qr-instructions').classList.add('hidden');

    const claveCodeElement = document.getElementById('clave-code');

    // Asignar el texto formateado (usando <pre> para respetar los saltos de línea \n)
    claveCodeElement.textContent = claveAlerta;
    claveCodeElement.classList.remove('hidden');

    // 3. Mostrar el modal
    document.getElementById('qr-modal').classList.remove('hidden');

}

/**
 * Genera un código QR para la URL proporcionada y lo muestra en un modal.
 * @param {string} url - La URL de la clave secreta a codificar.
 */
export function mostrarQR(url) {
    const qrCanvas = document.getElementById('qr-canvas');
    const qrModal = document.getElementById('qr-modal');

    // 1. Generar el código QR
    new QRious({
        element: qrCanvas,
        value: url,
        size: 250 // Tamaño del QR
    });

    // 2. Mostrar el modal
    document.getElementById('clave-code').classList.add('hidden'); // OCULTA el texto de la clave
    document.getElementById('qr-canvas').classList.remove('hidden'); // MUESTRA el canvas del QR
    document.getElementById('qr-instructions').classList.remove('hidden');

    qrModal.classList.remove('hidden');
}

/** Actualiza la interfaz para el modo líder de espías.
 * @param {Array} tableroLogico - El tablero lógico con las cartas y sus tipos.
 */
export function actualizarUIModoLider(tableroLogico) {
    // 1. Ocultar botones no relevantes
    document.getElementById('pass-turn-btn').classList.add('hidden');
    document.getElementById('reset-game-btn').classList.add('hidden');
    document.getElementById('show-key-btn').classList.add('hidden');
    document.getElementById('share-key-btn').classList.add('hidden');

    // 2. Actualizar el indicador de turno
    document.getElementById('current-turn').innerHTML = '🚨 <span class="text-purple-400 font-bold">MODO LÍDER DE ESPÍAS</span> 🚨';

    // 3. Calcular y actualziar los conteos iniciales contando las cartas del tablero
    const initialCounts = tableroLogico.reduce((counts, card) => {
        if (card.type === TIPOS_CARTA.AZUL) counts.blue++;
        else if (card.type === TIPOS_CARTA.ROJO) counts.red++;
        else if (card.type === TIPOS_CARTA.VERDE) counts.green++;
        return counts;
    }, { blue: 0, red: 0, green: 0 });

    document.querySelector('#blue-score span').textContent = initialCounts.blue;
    document.querySelector('#red-score span').textContent = initialCounts.red;
    document.querySelector('#green-score span').textContent = initialCounts.green;

    const is3TeamGame = tableroLogico.some(card => card.type === TIPOS_CARTA.VERDE);
    if (is3TeamGame) {
        document.getElementById('green-score').classList.remove('hidden');
    } else {
        document.getElementById('green-score').classList.add('hidden');
    }

    // 4. Renderizar el tablero
    renderizarTablero(tableroLogico, null, true); // Pasar 'null' para el click handler

    // 5. Mostrar la clave en consola
    mostrarClaveEnConsola(tableroLogico);
}

/** 
 * Oculta el contenedor de estadísticas del juego. 
 */
export function ocultarEstadisticas() {
    document.getElementById('game-stats').classList.add('hidden');
}

/** 
 * Oculta el layout del juego. 
 */
export function ocultarTablero() {
    document.getElementById('game-layout').classList.add('hidden');
    document.getElementById('start-buttons').classList.remove('hidden');
    document.querySelector('footer').classList.remove('hidden')
}

/** 
 * Muestra el layout del juego. 
 */
export function mostrarTablero() {
    document.getElementById('game-layout').classList.remove('hidden');
    document.getElementById('start-buttons').classList.add('hidden');
    document.querySelector('footer').classList.add('hidden')
}

/** 
 * Muestra el contenedor de estadísticas del juego. 
 */
export function mostrarEstadisticas() {
    document.getElementById('game-stats').classList.remove('hidden');
}

/**
 * Controla si el botón de alternancia (imágenes/palabras) debe ser visible.
 * Se muestra solo si el modo actual es uno de los modos de bandera.
 * @param {string} mode - El modo de juego seleccionado.
 */
export function actualizarVisibilidadToggleBtn(mode) {
    const toggleBtn = document.getElementById('toggle-display-btn');
    if (toggleBtn) {
        if (MODOS_DE_JUEGO_BANDERAS.includes(mode)) {
            toggleBtn.classList.remove('hidden'); // Mostrar si es un modo de banderas
        } else {
            toggleBtn.classList.add('hidden'); // Ocultar si no lo es
        }
    }
}

// =========================================================
// Funciones de Configuración de Opciones
// =========================================================

/**
 * Llena el menú desplegable de selección de modos.
 */
export function cargarOpcionesTema() {
    const selectElement = document.getElementById('mode-select');

    if (!selectElement) {
        console.error('ERROR UI: No se encontró el elemento #mode-select en el DOM.');
        return;
    }

    selectElement.innerHTML = ''; // Limpiar opciones anteriores

    // Iterar sobre las etiquetas legibles de los modos
    for (const [key, label] of Object.entries(ETIQUETAS_MODOS)) {
        const option = document.createElement('option');
        option.value = key; // El valor real para game.js ('clasico', 'geografia', etc.)
        option.textContent = label; // La etiqueta legible para el usuario
        selectElement.appendChild(option);
    }

    // Asegúrate de que el modo ORIGINAL sea el seleccionado por defecto
    selectElement.value = MODOS_DE_JUEGO.ORIGINAL;
}

/**
 * Actualiza el estado visual de los botones de regla según la opción seleccionada.
 * @param {boolean} sePasaTurno - Indica si el turno pasa al fallar.
 */
export function actualizarBotonRegla(sePasaTurno) {
    const btnPass = document.getElementById('rule-pass-on-miss'); // Estándar (Azul)
    const btnNoPass = document.getElementById('rule-no-pass-on-miss'); // Hardcore (Rojo)

    // Clases específicas para el botón "Pasa Turno" (Estándar)
    const activePassClasses = ['bg-blue-600', 'text-white', 'hover:bg-blue-700'];
    // Clases específicas para el botón "NO Pasa Turno" (Hardcore)
    const activeNoPassClasses = ['bg-red-600', 'text-white', 'hover:bg-red-700'];
    // Clases para el estado inactivo (Gris)
    const inactiveClasses = ['bg-gray-700', 'text-gray-300', 'hover:bg-gray-600'];

    if (sePasaTurno) {
        // Activar Pasa Turno (Estándar - Azul)
        btnPass.classList.remove(...inactiveClasses);
        btnPass.classList.add(...activePassClasses);
        // Desactivar No Pasa Turno (Hardcore - Gris)
        btnNoPass.classList.remove(...activeNoPassClasses);
        btnNoPass.classList.add(...inactiveClasses);
    } else {
        // Desactivar Pasa Turno (Estándar - Gris)
        btnPass.classList.remove(...activePassClasses);
        btnPass.classList.add(...inactiveClasses);
        // Activar No Pasa Turno (Hardcore - Rojo)
        btnNoPass.classList.remove(...inactiveClasses);
        btnNoPass.classList.add(...activeNoPassClasses);
    }
}
