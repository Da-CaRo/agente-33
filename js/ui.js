import { TIPOS_CARTA, MODOS_DE_JUEGO, ETIQUETAS_MODOS, MODOS_DE_JUEGO_IMAGENES, MODOS_DE_JUEGO_LOGOS, OPCIONES_TIMER } from './config.js';

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
    if (MODOS_DE_JUEGO_IMAGENES.includes(mode)) {
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
    document.getElementById('pause-timer-btn').classList.add('hidden');
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
    document.getElementById('pause-timer-btn').classList.remove('hidden');
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
 * @param {boolean} imgColorRule - Si es true, se muestras los logos con color.
 */
export function renderizarTablero(tableroLogico, manejarClickTarjeta, juegoTerminado, imgColorRule = true, forzarPalabras = false) {
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
            if (card.img.startsWith('i/')) {
                let src = '';
                if (imgColorRule) {
                    src = `https://cdn.simpleicons.org/${card.img.replace('i/', '')}`;
                } else {
                    src = `https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/${card.img.replace('i/', '')}.svg`;
                }
                cardContent = `<img height="64" width="64" src="${src}" class="p-1 sm:p-2 rounded-lg bg-gray-200" />`
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
export function actualizarUIModoLider(tableroLogico, colorImagenes) {
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
    renderizarTablero(tableroLogico, null, true, colorImagenes); // Pasar 'null' para el click handler

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
 * @param {boolean} show_button - Regla para mostrar o no el botón.
 */
export function actualizarVisibilidadToggleBtn(mode, show_button) {

    const toggleBtn = document.getElementById('toggle-display-btn');
    if (toggleBtn) {
        if (MODOS_DE_JUEGO_IMAGENES.includes(mode) && show_button) {
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
 * Llena el menú desplegable de selección de modos.
 */
export function cargarOpcionesTimer() {
    const selectElement = document.getElementById('timer-select');

    if (!selectElement) {
        console.error('ERROR UI: No se encontró el elemento #timer-select en el DOM.');
        return;
    }

    selectElement.innerHTML = ''; // Limpiar opciones anteriores

    // Iterar sobre las etiquetas legibles de los modos
    for (const [key, label] of Object.entries(OPCIONES_TIMER)) {
        const option = document.createElement('option');
        option.value = key; // El valor real para game.js ('clasico', 'geografia', etc.)
        option.textContent = label; // La etiqueta legible para el usuario
        selectElement.appendChild(option);
    }

    // Asegúrate de que el modo 5 Minutos sea el seleccionado por defecto
    selectElement.value = 5;
}

/**
 * Actualiza el estado visual de los botones de regla según la opción seleccionada.
 * @param {boolean} sePasaTurno - Indica si el turno pasa al fallar.
 */
export function actualizarBotonReglaTurno(sePasaTurno) {
    const btnPass = document.getElementById('rule-pass-on-miss'); // Estándar
    const btnNoPass = document.getElementById('rule-no-pass-on-miss'); // Hardcore

    // Clases para el estado activo (Color-Acento)
    const activeClasses = ['text-white', 'hover:bg-blue-700'];
    // Clases para el estado inactivo (Gris)
    const inactiveClasses = ['bg-gray-700', 'text-gray-300', 'hover:bg-gray-600'];

    if (sePasaTurno) {
        // Activar Pasa Turno (Color-Acento)
        btnPass.classList.remove(...inactiveClasses);
        btnPass.classList.add(...activeClasses);
        btnPass.style.backgroundColor = 'var(--color-acento)';
        // Desactivar No Pasa Turno (Gris)
        btnNoPass.classList.remove(...activeClasses);
        btnNoPass.classList.add(...inactiveClasses);
        btnNoPass.style.backgroundColor = '';
    } else {
        // Desactivar Pasa Turno (Gris)
        btnPass.classList.remove(...activeClasses);
        btnPass.classList.add(...inactiveClasses);
        btnPass.style.backgroundColor = '';
        // Activar No Pasa Turno (Color-Acento)
        btnNoPass.classList.remove(...inactiveClasses);
        btnNoPass.classList.add(...activeClasses);
        btnNoPass.style.backgroundColor = 'var(--color-acento)';
    }
}

/**
 * Actualiza el estado visual de los botones de regla según la opción seleccionada.
 * @param {boolean} sePuedeCambiarAPalabra - Indica si se puede cambiar entre la imagen y la palabra.
 */
export function actualizarBotonReglaImagen(sePuedeCambiarAPalabra) {
    const btnToggleImg = document.getElementById('rule-toggle-img-word'); // Imagen y Palabrar
    const btnNoToggleImg = document.getElementById('rule-no-toggle-img-word'); // Solo Imagen

    // Clases para el estado activo (Color-Acento)
    const activeClasses = ['text-white', 'hover:bg-blue-700'];
    // Clases para el estado inactivo (Gris)
    const inactiveClasses = ['bg-gray-700', 'text-gray-300', 'hover:bg-gray-600'];

    if (sePuedeCambiarAPalabra) {
        // Activar Imagen y Palabra (Color-Acento)
        btnToggleImg.classList.remove(...inactiveClasses);
        btnToggleImg.classList.add(...activeClasses);
        btnToggleImg.style.backgroundColor = 'var(--color-acento)';
        // Desactivar Solo Palabra (Gris)
        btnNoToggleImg.classList.remove(...activeClasses);
        btnNoToggleImg.classList.add(...inactiveClasses);
        btnNoToggleImg.style.backgroundColor = '';
    } else {
        // Desactivar Imagen y Palabra (Gris)
        btnToggleImg.classList.remove(...activeClasses);
        btnToggleImg.classList.add(...inactiveClasses);
        btnToggleImg.style.backgroundColor = '';
        // Activar Solo Palabra (Color-Acento)
        btnNoToggleImg.classList.remove(...inactiveClasses);
        btnNoToggleImg.classList.add(...activeClasses);
        btnNoToggleImg.style.backgroundColor = 'var(--color-acento)';
    }
}

/**
 * Actualiza el estado visual de los botones de regla según la opción seleccionada.
 * @param {boolean} seMuestraLogoColor - Indica si el logo se muestra en el color o en negro.
 */
export function actualizarBotonReglaColor(seMuestraLogoColor) {
    const btnColor = document.getElementById('rule-color-img'); // Estándar (Azul)
    const btnNoColor = document.getElementById('rule-no-color-img'); // Hardcore (Rojo)

    // Clases para el estado activo (Color-Acento)
    const activeClasses = ['text-white', 'hover:bg-blue-700'];
    // Clases para el estado inactivo (Gris)
    const inactiveClasses = ['bg-gray-700', 'text-gray-300', 'hover:bg-gray-600'];

    if (seMuestraLogoColor) {
        // Activar Color (Color-Acento)
        btnColor.classList.remove(...inactiveClasses);
        btnColor.classList.add(...activeClasses);
        btnColor.style.backgroundColor = 'var(--color-acento)';
        // Desactivar No Color (Gris)
        btnNoColor.classList.remove(...activeClasses);
        btnNoColor.classList.add(...inactiveClasses);
        btnNoColor.style.backgroundColor = '';
    } else {
        // Desactivar Color (Gris)
        btnColor.classList.remove(...activeClasses);
        btnColor.classList.add(...inactiveClasses);
        btnColor.style.backgroundColor = '';
        // Activar No Color (Rojo)
        btnNoColor.classList.remove(...inactiveClasses);
        btnNoColor.classList.add(...activeClasses);
        btnNoColor.style.backgroundColor = 'var(--color-acento)';
    }
}

/**
 * Actualiza la visibilidad de los botones de alternancia de la regla de visualización (imagen/palabra).
 * Estos botones solo deben ser visibles si el modo actual es uno de los modos de Bandera.
 * @param {string} currentMode - El modo de juego seleccionado.
 */
export function actualizarVisibilidadBotonesReglaImagenes(currentMode) {
    // Si no tienes un contenedor, necesitarías los IDs de los botones individuales:
    const btnToggle = document.getElementById('rule-toggle-img-word');
    const btnNoToggle = document.getElementById('rule-no-toggle-img-word');

    // Comprobar si el modo actual está en la lista de modos de bandera
    const isFlagMode = MODOS_DE_JUEGO_IMAGENES.includes(currentMode);

    if (isFlagMode) {
        btnToggle.classList.remove('hidden');
        btnNoToggle.classList.remove('hidden');
    } else {
        btnToggle.classList.add('hidden');
        btnNoToggle.classList.add('hidden');
    }
}

/**
 * Actualiza la visibilidad de los botones de alternancia de la regla de visualización (color/negro).
 * Estos botones solo deben ser visibles si el modo actual es uno de los modos de Bandera.
 * @param {string} currentMode - El modo de juego seleccionado.
 */
export function actualizarVisibilidadBotonesReglaColor(currentMode) {
    // Si no tienes un contenedor, necesitarías los IDs de los botones individuales:
    const btnToggle = document.getElementById('rule-color-img');
    const btnNoToggle = document.getElementById('rule-no-color-img');

    // Comprobar si el modo actual está en la lista de modos de bandera
    const isFlagMode = MODOS_DE_JUEGO_LOGOS.includes(currentMode);

    if (isFlagMode) {
        btnToggle.classList.remove('hidden');
        btnNoToggle.classList.remove('hidden');
    } else {
        btnToggle.classList.add('hidden');
        btnNoToggle.classList.add('hidden');
    }
}

/**
 * Formatea segundos a MM:SS.
 */
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Mapeo de equipo a ID de elemento HTML.
 * ¡IMPORTANTE! Asegúrate de que estos IDs existan en tu index.html.
 */
const TIMER_ELEMENT_IDS = {
    [TIPOS_CARTA.ROJO]: 'red-timer',
    [TIPOS_CARTA.AZUL]: 'blue-timer',
    [TIPOS_CARTA.VERDE]: 'green-timer',
};

/**
 * Actualiza la visualización del contador de tiempo para un equipo.
 * @param {string} team - El equipo (TIPOS_CARTA.AZUL/ROJO/VERDE).
 * @param {number} segundosRestantes - El tiempo restante en segundos.
 */
export function actualizarContadorUI(team, segundosRestantes) {
    const elementId = TIMER_ELEMENT_IDS[team];
    const elemento = document.getElementById(elementId);

    if (!elemento) return;

    // Asegurar que el tiempo no sea negativo
    const segundos = Math.max(0, segundosRestantes);

    // Formatear a MM:SS
    const minutos = Math.floor(segundos / 60);
    const segundosFormato = segundos % 60;
    const tiempoFormato = `${minutos.toString().padStart(2, '0')}:${segundosFormato.toString().padStart(2, '0')}`;

    elemento.textContent = tiempoFormato;

    // Lógica para el color (copiada de tu snippet y mejorada)
    // 1. Resetear el estilo de todos los contadores
    ['red-timer', 'blue-timer', 'green-timer'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'font-bold');
    });

    // 2. Aplicar el color de estado
    if (segundos <= 60 && segundos > 0) {
        // Menos de un minuto: Alerta (Amarillo)
        elemento.classList.add('text-yellow-400', 'font-bold');
    } else if (segundos === 0) {
        // Tiempo agotado
        elemento.classList.add('text-red-400', 'font-bold');
    } else {
        // Tiempo normal: Color por defecto (Gris)
        elemento.classList.add('text-gray-500');
    }
}

/**
 * Actualiza la apariencia del botón de pausa.
 * @param {boolean} enPausa - true si está en pausa, false si está corriendo.
 */
export function actualizarBotonPausa(enPausa) {
    const btn = document.getElementById('pause-timer-btn');
    if (!btn) return;

    if (enPausa) {
        // Estado Pausado: Botón de reanudar
        btn.innerHTML = '▶️ Reanudar';
        btn.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        btn.classList.add('bg-green-600', 'hover:bg-green-500');
        //document.getElementById('game-status-text').textContent = "JUEGO PAUSADO"; // Muestra un mensaje en el estado
        //document.getElementById('game-status-text').classList.add('text-red-500');
    } else {
        // Estado Corriendo: Botón de pausar
        btn.innerHTML = '⏸️ Pausar';
        btn.classList.remove('bg-green-600', 'hover:bg-green-500');
        btn.classList.add('bg-gray-700', 'hover:bg-gray-600');
        // Limpiar el mensaje de pausa si existía
        //document.getElementById('game-status-text').textContent = ""; 
        //document.getElementById('game-status-text').classList.remove('text-red-500');
    }
}