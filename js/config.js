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
    PROFESION: 'profesion',
    BANDERAS: 'banderas',
    BANDERAS_FACIL: 'banderas_facil',
    BANDERAS_MEDIO: 'banderas_medio',
    BANDERAS_DIFICIL: 'banderas_dificil',
    BANDERAS_AFRICA: 'banderas_africa',
    BANDERAS_AMERICA: 'banderas_america',
    BANDERAS_ASIA: 'banderas_asia',
    BANDERAS_EUROPA: 'banderas_europa',
    BANDERAS_OCEANIA: 'banderas_oceania',
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
    PROFESION: 'Profesión',
    BANDERAS: 'Bandera',
    BANDERAS_FACIL: 'MBP_Facil',
    BANDERAS_MEDIO: 'MBP_Medio',
    BANDERAS_DIFICIL: 'MBP_Dificil',
    BANDERAS_AFRICA: 'MBP_Africa',
    BANDERAS_AMERICANORTE: 'MBP_NA',
    BANDERAS_AMERICASUR: 'MBP_SA',
    BANDERAS_ASIA: 'MBP_Asia',
    BANDERAS_EUROPA: 'MBP_Europa',
    BANDERAS_OCEANIA: 'MBP_Oceania',
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
    [MODOS_DE_JUEGO.PROFESION]: "Profesiones",
    [MODOS_DE_JUEGO.BANDERAS]: "Banderas",
    [MODOS_DE_JUEGO.BANDERAS_FACIL]: 'Banderas Modo Fácil',
    [MODOS_DE_JUEGO.BANDERAS_MEDIO]: 'Banderas Modo Medio',
    [MODOS_DE_JUEGO.BANDERAS_DIFICIL]: 'Banderas Modo Dificil',
    [MODOS_DE_JUEGO.BANDERAS_AFRICA]: 'Banderas de África',
    [MODOS_DE_JUEGO.BANDERAS_AMERICA]: 'Banderas de América',
    [MODOS_DE_JUEGO.BANDERAS_ASIA]: 'Banderas de Asia',
    [MODOS_DE_JUEGO.BANDERAS_EUROPA]: 'Banderas de Europa',
    [MODOS_DE_JUEGO.BANDERAS_OCEANIA]: 'Banderas de Oceanía',
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
    [MODOS_DE_JUEGO.PROFESION]: [ETIQUETAS.PROFESION],
    [MODOS_DE_JUEGO.BANDERAS]: [ETIQUETAS.BANDERAS, ETIQUETAS.PAIS],
    [MODOS_DE_JUEGO.BANDERAS_FACIL]: [ETIQUETAS.BANDERAS_FACIL],
    [MODOS_DE_JUEGO.BANDERAS_MEDIO]: [ETIQUETAS.BANDERAS_FACIL, ETIQUETAS.BANDERAS_MEDIO],
    [MODOS_DE_JUEGO.BANDERAS_DIFICIL]: [ETIQUETAS.BANDERAS_FACIL, ETIQUETAS.BANDERAS_MEDIO, ETIQUETAS.BANDERAS_DIFICIL],
    [MODOS_DE_JUEGO.BANDERAS_AFRICA]: [ETIQUETAS.BANDERAS_AFRICA],
    [MODOS_DE_JUEGO.BANDERAS_AMERICA]: [ETIQUETAS.BANDERAS_AMERICANORTE, ETIQUETAS.BANDERAS_AMERICASUR],
    [MODOS_DE_JUEGO.BANDERAS_ASIA]: [ETIQUETAS.BANDERAS_ASIA],
    [MODOS_DE_JUEGO.BANDERAS_EUROPA]: [ETIQUETAS.BANDERAS_EUROPA],
    [MODOS_DE_JUEGO.BANDERAS_OCEANIA]: [ETIQUETAS.BANDERAS_OCEANIA],
};

export const MODOS_DE_JUEGO_BANDERAS = [
    MODOS_DE_JUEGO.BANDERAS,
    MODOS_DE_JUEGO.BANDERAS_FACIL,
    MODOS_DE_JUEGO.BANDERAS_MEDIO,
    MODOS_DE_JUEGO.BANDERAS_DIFICIL,
    MODOS_DE_JUEGO.BANDERAS_AFRICA,
    MODOS_DE_JUEGO.BANDERAS_AMERICA,
    MODOS_DE_JUEGO.BANDERAS_ASIA,
    MODOS_DE_JUEGO.BANDERAS_EUROPA,
    MODOS_DE_JUEGO.BANDERAS_OCEANIA,
]
