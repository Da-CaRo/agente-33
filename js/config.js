// CLAVE SECRETA DE CIFRADO
export const ENCRYPTION_KEY = "AGENT33";

// Constantes de almacenamiento local
export const USADAS_STORAGE_KEY = 'juegoDeEspias_palabrasUsadas';
export const GAME_STATE_STORAGE_KEY = 'juegoDeEspias_estadoActual';
export const RULE_TURN_PASS_KEY = 'juegoDeEspias_reglaPaseTurno';

// Mapeo de tipos de cartas y códigos de codificación
export const TIPOS_CARTA = {
    ROJO: 'red',
    AZUL: 'blue',
    VERDE: 'green',
    NEUTRAL: 'neutral',
    ASESINO: 'assassin',
    // Mapeo de tipos a emojis que se muestran en la consola/alerta
    MAPEO_EMOJI: {
        'red': '🔴',
        'blue': '🔵',
        'green': '🟢',
        'neutral': '🟡',
        'assassin': '⚫'
    },
    // Mapeo de tipos a las iniciales solicitadas para la codificación
    MAPEO_CODIGO: {
        'red': 'R',
        'blue': 'B',
        'green': 'V',
        'neutral': 'N',
        'assassin': 'A'
    },
    // Mapeo inverso de iniciales a tipos
    MAPEO_INVERSO: {
        'R': 'red',
        'B': 'blue',
        'V': 'green',
        'N': 'neutral',
        'A': 'assassin'
    }
};

export const MODOS_DE_JUEGO = {
    CLASICO: 'clasico',
    ORIGINAL: 'original',
    CIENCIA: 'ciencia',
    GEOGRAFIA: 'geografia',
    COMIDA: 'Comida',
    DEPORTE: 'deporte',
    DEPORTESYMAS: 'deportivo',
    PAIS: 'pais',
    CIUDAD: 'ciudad',
    ANIMAL: 'animal',
    PROFESION: 'profesion'
};

export const ETIQUETAS = {
    ORIGINAL: 'Original',
    ANIMAL: 'Animal',
    NATURALEZA: 'Naturaleza',
    CIENCIA: 'Ciencia',
    GEOGRAFIA: 'Geografía',
    PAIS: 'País',
    CIUDAD: 'Ciudad',
    COMIDA: 'Comida',
    DEPORTE: 'Deporte',
    DEPORTESYMAS: 'Deportivo',
    PROFESION: 'Profesión'
};

export const ETIQUETAS_MODOS = {
    [MODOS_DE_JUEGO.CLASICO]: "Clásico (Todas las Palabras)",
    [MODOS_DE_JUEGO.ORIGINAL]: "Original (Palabras del juego original)",
    [MODOS_DE_JUEGO.CIENCIA]: "Ciencia y Naturaleza",
    [MODOS_DE_JUEGO.GEOGRAFIA]: "Geografía",
    [MODOS_DE_JUEGO.COMIDA]: "Comida",
    [MODOS_DE_JUEGO.DEPORTE]: "Deportes",
    [MODOS_DE_JUEGO.DEPORTESYMAS]: "Deportes y mas",
    [MODOS_DE_JUEGO.PAIS]: "Paises",
    [MODOS_DE_JUEGO.CIUDAD]: "Ciudades",
    [MODOS_DE_JUEGO.ANIMAL]: "Animales",
    [MODOS_DE_JUEGO.PROFESION]: "Profesiones"
};

export const MODO_A_CATEGORIAS = {
    [MODOS_DE_JUEGO.TODO]: null,
    [MODOS_DE_JUEGO.ORIGINAL]: [ETIQUETAS.ORIGINAL],
    [MODOS_DE_JUEGO.CIENCIA]: [ETIQUETAS.ANIMAL, ETIQUETAS.NATURALEZA, ETIQUETAS.CIENCIA],
    [MODOS_DE_JUEGO.GEOGRAFIA]: [ETIQUETAS.GEOGRAFIA, ETIQUETAS.PAIS, ETIQUETAS.CIUDAD],
    [MODOS_DE_JUEGO.COMIDA]: [ETIQUETAS.COMIDA],
    [MODOS_DE_JUEGO.DEPORTE]: [ETIQUETAS.DEPORTE],
    [MODOS_DE_JUEGO.DEPORTESYMAS]: [ETIQUETAS.DEPORTE, ETIQUETAS.DEPORTESYMAS],
    [MODOS_DE_JUEGO.PAIS]: [ETIQUETAS.PAIS],
    [MODOS_DE_JUEGO.CIUDAD]: [ETIQUETAS.CIUDAD],
    [MODOS_DE_JUEGO.ANIMAL]: [ETIQUETAS.ANIMAL],
    [MODOS_DE_JUEGO.PROFESION]: [ETIQUETAS.PROFESION]
};

