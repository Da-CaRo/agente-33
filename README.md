# 🕵️ Agente 33: Tablero Digital para Juego de Espías

Una implementación moderna, modular y totalmente *offline* de un famoso juego de mesa de deducción con palabras. Permite generar tableros, compartirlos a través de códigos QR y enlaces cifrados, y jugar con roles de Líder de Espías y Agente de Campo.

**¡Juega Ahora!** [**Agente 33 en GitHub Pages**](https://da-caro.github.io/agente-33/)

---

## 🚀 Características Principales

* **Generación de Tableros:** Crea tableros aleatorios de 5x5.
* **Modo de 3 Equipos:** Soporte completo para partidas de 3 equipos (Rojo, Azul, Verde).
* **Códigos Secretos:** Genera claves secretas codificadas y cifradas (XOR + Base64) que contienen la disposición del tablero.
* **Compartir Clave:** Muestra la clave como **QR y texto** para compartir fácilmente con el Líder de Espías.
* **Persistencia de Estado:** Guarda automáticamente la partida y la configuración en el **Local Storage**.
* **Control de Reglas:** Permite activar/desactivar la regla de "Pase de turno al fallar" (Hardcore/Estándar).
* **Limpieza de Datos:** Nuevo botón en el *footer* para **borrar todas las variables** del Local Storage.
* **Modularidad:** Arquitectura JavaScript organizada en módulos (`game.js`, `ui.js`, `storage.js`).

---

## 🛠️ Instalación y Uso

Este proyecto es una aplicación *Single-Page* (SPA) basada en HTML, CSS (Tailwind CSS) y JavaScript vainilla, diseñada para ejecutarse completamente en el navegador.

### Requisitos

* Un navegador web moderno.
* **No requiere servidor web.**
