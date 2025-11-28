import { PALABRAS_SECRETAS } from '../data/palabras.js';
import { TIPOS_CARTA, GAME_STATE_STORAGE_KEY, MODOS_DE_JUEGO, MODO_A_CATEGORIAS, ETIQUETAS, MODOS_DE_JUEGO_BANDERAS } from './config.js';
import * as Storage from './storage.js';
import * as UI from './ui.js';

// --- ESTADO INTERNO DEL JUEGO ---
let tableroLogico = [];
let juegoTerminado = false;
let agentesRojosRestantes = 0;
let agentesAzulesRestantes = 0;
let agentesVerdesRestantes = 0;
let turnoActual = TIPOS_CARTA.AZUL;
let numeroDeEquipos = 2;
let paseTurnoAlFallar = true;
let selectedMode = MODOS_DE_JUEGO.ORIGINAL;
const PALABRAS_MAPA = new Map(PALABRAS_SECRETAS.map(p => [p.id, p.palabra]));
const IMAGENES_MAPA = new Map(PALABRAS_SECRETAS.map(p => [p.id, p.img]));

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
    agentesVerdesRestantes = tablero.filter(c => c.type === TIPOS_CARTA.VERDE && !c.revealed).length;

    juegoTerminado = false;
    if (tablero.find(c => c.type === TIPOS_CARTA.ASESINO && c.revealed)) {
        juegoTerminado = true;
    } else if (agentesAzulesRestantes === 0 || agentesRojosRestantes === 0 || (numeroDeEquipos === 3 && agentesVerdesRestantes === 0)) {
        juegoTerminado = true;
    }

    // Actualizar UI y Consola después de recalcular
    UI.actualizarPuntuacion(agentesAzulesRestantes, agentesRojosRestantes, agentesVerdesRestantes, numeroDeEquipos);
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
        terminado: juegoTerminado,
        numTeams: numeroDeEquipos,
        turnPassRule: paseTurnoAlFallar,
        selectedMode: selectedMode
    };
}

// =========================================================
// Funciones de Control de Flujo (Exportadas)
// =========================================================

/**
 * Función que encapsula toda la lógica para empezar una partida nueva.
 */
export function startNewGame(startingTeam, numTeams, rulePassOnMiss, mode) {

    juegoTerminado = false;
    turnoActual = startingTeam;
    numeroDeEquipos = numTeams;
    paseTurnoAlFallar = rulePassOnMiss;
    selectedMode = mode;

    const equipos = [TIPOS_CARTA.AZUL, TIPOS_CARTA.ROJO];
    if (numTeams === 3) equipos.push(TIPOS_CARTA.VERDE);

    // 1. Determinar la distribución de cartas (9/8 para 2 equipos, 8/8/8 para 3)
    let tipos = [];
    if (numTeams === 2) {
        const firstTeam = startingTeam;
        const secondTeam = equipos.find(e => e !== firstTeam);
        tipos = [
            ...Array(9).fill(firstTeam),
            ...Array(8).fill(secondTeam),
            ...Array(7).fill(TIPOS_CARTA.NEUTRAL),
            TIPOS_CARTA.ASESINO
        ];
    } else { // numTeams === 3 (8/8/8/1 y 1 Asesino)
        tipos = [
            ...Array(8).fill(TIPOS_CARTA.AZUL),
            ...Array(8).fill(TIPOS_CARTA.ROJO),
            ...Array(8).fill(TIPOS_CARTA.VERDE),
            TIPOS_CARTA.ASESINO
        ];
    }

    // 2. FILTRAR LAS PALABRAS POR TEMA
    let palabrasFiltradas;
    const categoriasSeleccionadas = MODO_A_CATEGORIAS[selectedMode];

    if (selectedMode === MODOS_DE_JUEGO.CLASICO || !categoriasSeleccionadas) {
        // Modo clásico: usa TODAS las palabras que NO se han usado previamente.
        palabrasFiltradas = PALABRAS_SECRETAS.filter(item => {
            // Excluir si tiene la etiqueta "Bandera". Si item.etiquetas es null/undefined, se incluye.
            return !(item.etiquetas && item.etiquetas.includes(ETIQUETAS.BANDERAS));
        });
    } else {
        // Filtrar las palabras: la palabra debe incluir AL MENOS una de las categorías seleccionadas
        palabrasFiltradas = PALABRAS_SECRETAS.filter(item => {
            // Si la palabra no tiene 'etiquetas' o su array está vacío, la descartamos en modos temáticos
            if (!item.etiquetas || item.etiquetas.length === 0) return false;

            // Comprobar si alguno de los etiquetas de la palabra está incluido en las categorías del modo
            return item.etiquetas.some(tema => categoriasSeleccionadas.includes(tema));
        });

        if (palabrasFiltradas.length < 25) {
            console.error(`¡ERROR! Solo hay ${palabrasFiltradas.length} palabras disponibles para el tema ${selectedMode} (Categorías: ${categoriasSeleccionadas.join(', ')}).`);
            return;
        }
    }

    // 2. APLICAR LÓGICA DE PALABRAS USADAS
    const idsUsados = Storage.cargarIdsUsados();
    let palabrasCandidatas = palabrasFiltradas.filter(item => !idsUsados.has(item.id));

    if (palabrasCandidatas.length < 25 && selectedMode !== MODOS_DE_JUEGO.CLASICO) {
        // LÓGICA DE REINICIO DE HISTORIAL TEMÁTICO
        console.warn(`Pocas palabras no usadas (${palabrasCandidatas.length}) para el tema ${selectedMode}. Reiniciando historial para este tema.`);
        const idsDelTema = palabrasFiltradas.map(item => item.id);
        Storage.limpiarIdsUsados(idsDelTema);
        palabrasCandidatas = palabrasFiltradas;

    } else if (palabrasCandidatas.length < 25 && selectedMode === MODOS_DE_JUEGO.CLASICO) {
        // Lógica existente para el modo Clásico (usa todas las disponibles)
        console.warn("¡Pocas palabras no usadas en modo CLÁSICO! Reiniciando la lista completa.");
        Storage.limpiarEstadoPartida(true);
        palabrasCandidatas = PALABRAS_SECRETAS;
    }

    const palabrasMezcladas = shuffleArray(palabrasCandidatas).slice(0, 25);
    const idsPartidaActual = palabrasMezcladas.map(item => item.id);
    Storage.guardarNuevosIds(idsPartidaActual);

    const tiposMezclados = shuffleArray(tipos);

    tableroLogico = palabrasMezcladas.map((item, index) => {
        return {
            id: item.id,
            word: item.palabra,
            type: tiposMezclados[index],
            revealed: false,
            img: item.img || null
        };
    });

    Storage.limpiarEstadoPartida(); // Limpiar el estado anterior (si existe)

    UI.ocultarBotonesInicio();
    recalcularEstado(tableroLogico); // <--- Esto guarda el estado
    UI.actualizarIndicadorTurno(turnoActual, juegoTerminado);
    UI.actualizarVisibilidadToggleBtn(selectedMode);
    UI.setInitialDisplayMode(selectedMode);
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

    // 1. Si se revela el Asesino, el juego termina.
    // 2. Si la tarjeta NO es del color del equipo actual (es de otro equipo o Neutral),
    //    comprueba la regla de pasar el turno al fallar.
    // 3. Si la tarjeta ES del color del equipo actual, finDeTurno sigue siendo false 
    //    y el turno continúa.
    if (cardData.type === TIPOS_CARTA.ASESINO) {
        juegoTerminado = true;
    } else if (cardData.type !== equipoActual) {
        if (paseTurnoAlFallar) {
            // Si la regla indica que el turno debe pasar al fallar, se pasa el turno
            finDeTurno = true;
        } else {
            // Si la regla indica que NO pasa el turno, finDeTurno sigue siendo false, 
            // simplemente termina la acción sin pasar el turno, esperando la siguiente acción.
        }
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

    let nextTurn = turnoActual;

    if (numeroDeEquipos === 2) {
        nextTurn = (turnoActual === TIPOS_CARTA.AZUL) ? TIPOS_CARTA.ROJO : TIPOS_CARTA.AZUL;
    } else if (numeroDeEquipos === 3) {
        // Ciclo: Azul -> Rojo -> Verde -> Azul...
        const teams = [TIPOS_CARTA.AZUL, TIPOS_CARTA.ROJO, TIPOS_CARTA.VERDE];
        const currentIndex = teams.indexOf(turnoActual);
        const nextIndex = (currentIndex + 1) % teams.length;
        nextTurn = teams[nextIndex];
    }

    turnoActual = nextTurn;
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
    } else if (numeroDeEquipos === 3 && agentesVerdesRestantes === 0) {
        mensaje = '¡<span class="text-green-400 font-bold">VICTORIA VERDE</span>! 🏆';
    }

    // 2. Verificar derrota por Asesino
    const asesinoRevelado = tableroLogico.some(card => card.type === TIPOS_CARTA.ASESINO && card.revealed);

    if (asesinoRevelado) {
        juegoTerminado = true;

        const equipoPerdedor = turnoActual;
        let equipoGanadorTexto = '';

        if (numeroDeEquipos === 2) {
            equipoGanadorTexto = (equipoPerdedor === TIPOS_CARTA.AZUL) ? 'Rojo 🔴' : 'Azul 🔵';
        } else {
            const equiposRestantes = [TIPOS_CARTA.AZUL, TIPOS_CARTA.ROJO, TIPOS_CARTA.VERDE]
                .filter(e => e !== equipoPerdedor)
                .map(e => TIPOS_CARTA.MAPEO_EMOJI[e]);

            equipoGanadorTexto = `Los equipos restantes: ${equiposRestantes.join(' y ')}`;
        }

        mensaje = `¡JUEGO TERMINADO! <span class="text-red-500 font-bold">ASESINADO</span>. Ganan: ${equipoGanadorTexto}`;
    } else if (mensaje) {
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
            revealed: item.r || false,
            img: IMAGENES_MAPA.get(item.id),
        }));

        turnoActual = estadoGuardado.turno || TIPOS_CARTA.AZUL;
        juegoTerminado = estadoGuardado.terminado || false;
        numeroDeEquipos = estadoGuardado.numTeams || 2;
        paseTurnoAlFallar = estadoGuardado.turnPassRule !== undefined ? estadoGuardado.turnPassRule : true;
        selectedMode = estadoGuardado.selectedMode || MODOS_DE_JUEGO.ORIGINAL;

        UI.ocultarBotonesInicio();
        recalcularEstado(tableroLogico);
        UI.actualizarIndicadorTurno(turnoActual, juegoTerminado);
        UI.actualizarVisibilidadToggleBtn(selectedMode);
        UI.setInitialDisplayMode(selectedMode);
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
        UI.ocultarEstadisticas();
        UI.ocultarTablero();
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
            const img = IMAGENES_MAPA.get(item.id);
            return {
                id: item.id,
                word: word,
                type: type,
                revealed: true, // Todas reveladas para el Líder de Espías
                img: img
            };
        });

        numeroDeEquipos = tableroLogico.some(card => card.type === TIPOS_CARTA.VERDE) ? 3 : 2;
        paseTurnoAlFallar = estadoPartida.turnPassRule !== undefined ? estadoPartida.turnPassRule : true;

        UI.ocultarBotonesInicio();
        UI.actualizarUIModoLider(tableroLogico);
        UI.actualizarVisibilidadToggleBtn(estadoPartida.selectedMode);

    } catch (e) {
        console.error("Error al procesar el JSON del tablero descifrado para la clave:", e);
        alert("Error interno al decodificar la clave.");
    }
}

/**
 * Intenta obtener el estado codificado del tablero desde el parámetro 'clave' de la URL.
 * @returns {string | null} La cadena codificada o null.
        */
export function obtenerEstadoCodificadoURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('clave'); // Busca el parámetro ?clave=...
}

/**
 * Vuelve a renderizar el tablero con el estado actual, útil para el toggle de visualización.
 */
export function reRenderBoard() {
    // Si el juego está en modo líder de espías, forzar el modo de líder (que a su vez llama a renderizarTablero)
    // Se utiliza el indicador de texto de UI.actualizarUIModoLider para la detección.
    if (document.getElementById('current-turn').innerHTML.includes('MODO LÍDER DE ESPÍAS')) {
        UI.actualizarUIModoLider(tableroLogico);
    } else {
        UI.renderizarTablero(tableroLogico, handleCardClick, juegoTerminado);
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

