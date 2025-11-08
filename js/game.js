import { PALABRAS_SECRETAS } from '../data/palabras.js';
import { TIPOS_CARTA, GAME_STATE_STORAGE_KEY } from './config.js';
import * as Storage from './storage.js';
import * as UI from './ui.js';

// --- ESTADO INTERNO DEL JUEGO ---
let tableroLogico = [];
let juegoTerminado = false;
let agentesRojosRestantes = 0;
let agentesAzulesRestantes = 0;
let turnoActual = TIPOS_CARTA.AZUL;
const PALABRAS_MAPA = new Map(PALABRAS_SECRETAS.map(p => [p.id, p.palabra]));

// =========================================================
// Funciones Internas de Utilidad
// =========================================================

/**
 * Función para mezclar un array (Fisher-Yates).
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Recalcula contadores y verifica el fin del juego.
 * @param {Array} tablero - El tablero lógico.
 */
function recalcularEstado(tablero) {
    agentesRojosRestantes = tablero.filter(c => c.type === TIPOS_CARTA.ROJO && !c.revealed).length;
    agentesAzulesRestantes = tablero.filter(c => c.type === TIPOS_CARTA.AZUL && !c.revealed).length;

    juegoTerminado = false;
    if (tablero.find(c => c.type === TIPOS_CARTA.ASESINO && c.revealed)) {
        juegoTerminado = true;
    } else if (agentesAzulesRestantes === 0 || agentesRojosRestantes === 0) {
        juegoTerminado = true;
    }

    // Actualizar UI y Consola después de recalcular
    UI.actualizarPuntuacion(agentesAzulesRestantes, agentesRojosRestantes);
    verificarFinJuego(); // Determinar y mostrar el mensaje final
    Storage.guardarEstadoPartida(obtenerEstadoParaGuardar());
}

/**
 * Genera el objeto de estado listo para ser guardado/cifrado.
 */
function obtenerEstadoParaGuardar() {
    return {
        tablero: tableroLogico.map(card => ({
            id: card.id,
            type: TIPOS_CARTA.MAPEO_CODIGO[card.type],
            r: card.revealed
        })),
        turno: turnoActual,
        terminado: juegoTerminado
    };
}

// =========================================================
// Funciones de Control de Flujo (Exportadas)
// =========================================================

/**
 * Función que encapsula toda la lógica para empezar una partida nueva.
 */
export function startNewGame(startingTeam) {

    juegoTerminado = false;
    turnoActual = startingTeam;

    const firstTeam = startingTeam;
    const secondTeam = (firstTeam === TIPOS_CARTA.AZUL) ? TIPOS_CARTA.ROJO : TIPOS_CARTA.AZUL;

    const idsUsados = Storage.cargarIdsUsados();
    let palabrasCandidatas = PALABRAS_SECRETAS.filter(item => !idsUsados.has(item.id));

    if (palabrasCandidatas.length < 25) {
        console.warn("¡Pocas palabras no usadas! Reiniciando la lista completa.");
        Storage.limpiarEstadoPartida(true); // limpia palabras usadas
        palabrasCandidatas = PALABRAS_SECRETAS;
    }

    const palabrasMezcladas = shuffleArray(palabrasCandidatas).slice(0, 25);
    const idsPartidaActual = palabrasMezcladas.map(item => item.id);
    Storage.guardarNuevosIds(idsPartidaActual);

    const tipos = [
        ...Array(9).fill(firstTeam),
        ...Array(8).fill(secondTeam),
        ...Array(7).fill(TIPOS_CARTA.NEUTRAL),
        TIPOS_CARTA.ASESINO
    ];

    const tiposMezclados = shuffleArray(tipos);

    tableroLogico = palabrasMezcladas.map((item, index) => ({
        id: item.id,
        word: item.palabra,
        type: tiposMezclados[index],
        revealed: false
    }));

    Storage.limpiarEstadoPartida(); // Limpiar el estado anterior (si existe)

    UI.ocultarBotonesInicio();
    recalcularEstado(tableroLogico); // <--- Esto guarda el estado
    UI.actualizarIndicadorTurno(turnoActual, juegoTerminado);
    UI.renderizarTablero(tableroLogico, handleCardClick, juegoTerminado);
    UI.mostrarClaveEnConsola(tableroLogico);
}

/**
 * Función principal para manejar la lógica al hacer click en una tarjeta.
 */
export function handleCardClick(event) {
    if (juegoTerminado) return;

    const cardDiv = event.currentTarget;
    const index = parseInt(cardDiv.getAttribute('data-index'));
    const cardData = tableroLogico[index];

    if (cardData.revealed) return;

    cardData.revealed = true;
    let finDeTurno = false;
    const equipoActual = turnoActual;

    switch (cardData.type) {
        case TIPOS_CARTA.ROJO:
            if (equipoActual === TIPOS_CARTA.AZUL) finDeTurno = true;
            break;
        case TIPOS_CARTA.AZUL:
            if (equipoActual === TIPOS_CARTA.ROJO) finDeTurno = true;
            break;
        case TIPOS_CARTA.NEUTRAL:
            finDeTurno = true;
            break;
        case TIPOS_CARTA.ASESINO:
            juegoTerminado = true;
            break;
    }

    recalcularEstado(tableroLogico);
    UI.renderizarTablero(tableroLogico, handleCardClick, juegoTerminado); // Re-renderizar para actualizar color

    // Si no ha terminado, verificar si el turno debe cambiar automáticamente
    if (!juegoTerminado && finDeTurno) {
        passTurn();
    }
}

/**
 * Cambia el turno al equipo contrario y actualiza el indicador en la interfaz.
 */
export function passTurn() {
    if (juegoTerminado) return;

    turnoActual = (turnoActual === TIPOS_CARTA.AZUL) ? TIPOS_CARTA.ROJO : TIPOS_CARTA.AZUL;
    UI.actualizarIndicadorTurno(turnoActual, juegoTerminado);
    Storage.guardarEstadoPartida(obtenerEstadoParaGuardar());
    console.log(`¡Turno cambiado! Ahora es el turno del equipo ${turnoActual.toUpperCase()}.`);
}

/**
 * Verifica las condiciones de victoria o derrota.
 */
function verificarFinJuego() {
    let mensaje = '';

    // 1. Verificar victoria por conteo de agentes
    if (agentesAzulesRestantes === 0) {
        mensaje = '¡<span class="text-blue-400 font-bold">VICTORIA AZUL</span>! 🏆';
    } else if (agentesRojosRestantes === 0) {
        mensaje = '¡<span class="text-red-400 font-bold">VICTORIA ROJA</span>! 🏆';
    }

    // 2. Verificar derrota por Asesino
    const asesinoRevelado = tableroLogico.some(card => card.type === TIPOS_CARTA.ASESINO && card.revealed);

    if (asesinoRevelado && !mensaje) { // Si hay asesino y no hay victoria por conteo (el asesino siempre gana)
        juegoTerminado = true;
        const equipoPerdedor = turnoActual;
        const equipoGanador = (equipoPerdedor === TIPOS_CARTA.AZUL) ? 'Rojo 🔴' : 'Azul 🔵';
        mensaje = `¡JUEGO TERMINADO! <span class="text-red-500 font-bold">ASESINADO</span>. Gana: ${equipoGanador}`;
    } else if (mensaje) { // Si hay victoria por conteo, terminamos.
        juegoTerminado = true;
    }

    if (juegoTerminado) {
        UI.actualizarIndicadorTurno(turnoActual, juegoTerminado, mensaje);
        Storage.limpiarEstadoPartida();
        UI.renderizarTablero(tableroLogico, handleCardClick, juegoTerminado);
    }
}

// =========================================================
// Funciones de Carga y Enlaces (Exportadas)
// =========================================================

/**
 * Intenta cargar una partida guardada desde el Local Storage.
 * @returns {boolean} True si se cargó una partida, false si no.
 */
export function initGame() {
    const estadoGuardado = Storage.cargarEstadoPartida();

    if (estadoGuardado) {
        tableroLogico = estadoGuardado.tablero.map(item => ({
            id: item.id,
            word: PALABRAS_MAPA.get(item.id),
            type: TIPOS_CARTA.MAPEO_INVERSO[item.type],
            revealed: item.r || false
        }));

        turnoActual = estadoGuardado.turno || TIPOS_CARTA.AZUL;
        juegoTerminado = estadoGuardado.terminado || false;

        UI.ocultarBotonesInicio();
        recalcularEstado(tableroLogico);
        UI.actualizarIndicadorTurno(turnoActual, juegoTerminado);
        UI.renderizarTablero(tableroLogico, handleCardClick, juegoTerminado);
        UI.mostrarClaveEnConsola(tableroLogico);
        return true;
    }
    return false;
}

/**
 * Elimina el estado de la partida guardada y devuelve la UI al estado inicial.
 */
export function reiniciarPartida() {
    if (confirm("¿Estás seguro de que quieres borrar la partida actual y volver a la pantalla de inicio?")) {
        Storage.limpiarEstadoPartida();
        UI.mostrarBotonesInicio();
    }
}

/**
 * Genera y muestra un enlace con la clave secreta cifrada para compartir.
 */
export function generarEnlaceClave() {
    const estadoCifrado = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (estadoCifrado) {
        const urlBase = window.location.origin + window.location.pathname;
        const urlToShare = `${urlBase}?clave=${encodeURIComponent(estadoCifrado)}`;

        // Opción 1 (Predeterminada): Mostrar Código QR
        UI.mostrarQR(urlToShare);


        // Opción 2: Usar el viejo 'prompt' (Descomentar esta línea y comentar la línea 1)
        //prompt("Copia y comparte este enlace con el Líder de Espías:", urlToShare);
    } else {
        alert("La partida no ha comenzado o es inválida.");
    }
}

/** Muestra la clave secreta descifrada desde la URL.
 * @param {string} cadenaCifrada - La cadena cifrada obtenida de la URL.
 */
export function mostrarClaveSecretaURL(cadenaCifrada) {
    const cadenaJSON = Storage.descifrarXOR(cadenaCifrada);
    if (!cadenaJSON) {
        alert("Error al cargar la clave. El formato cifrado no es válido.");
        return;
    }

    try {
        const estadoPartida = JSON.parse(cadenaJSON);
        const estadoDecodificado = estadoPartida.tablero;

        if (!Array.isArray(estadoDecodificado) || estadoDecodificado.length !== 25) {
            throw new Error("Formato de tablero incorrecto.");
        }

        // Reconstruir el tablero lógico, marcando todas como REVELADAS
        tableroLogico = estadoDecodificado.map(item => {
            const word = PALABRAS_MAPA.get(item.id);
            const type = TIPOS_CARTA.MAPEO_INVERSO[item.type];
            return {
                id: item.id,
                word: word,
                type: type,
                revealed: true // Todas reveladas para el Líder de Espías
            };
        });

        UI.ocultarBotonesInicio();
        UI.actualizarUIModoLider(tableroLogico);

    } catch (e) {
        console.error("Error al procesar el JSON del tablero descifrado para la clave:", e);
        alert("Error interno al decodificar la clave.");
    }
}

// =========================================================
// Funciones de Acceso a UI (Exportadas)
// =========================================================

/** Obtiene el tablero lógico actual.
 * @returns {Array} El tablero lógico.
 */
export function getTableroLogico() {
    return tableroLogico;
}