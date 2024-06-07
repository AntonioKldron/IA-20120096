# Reporte de Desarrollo de un Juego en Phaser con Redes Neuronales para IA

## Introducción

Este proyecto desarrolla un juego utilizando la biblioteca Phaser y redes neuronales implementadas con Synaptic para controlar la inteligencia artificial del juego. El juego se ejecuta en un canvas de 450x400 píxeles y cuenta con un personaje jugador, una bala, y un fondo.

## Estructura del Código

### Declaración de Variables

```javascript
// Dimensiones del juego
var w = 450;
var h = 400;

// Variables para los elementos del juego
var jugador, fondo, bala;

// Variables para el control del jugador y el menú
var cursors, menu, pausaL;

// Variables para la red neuronal y los datos de entrenamiento
var nnNetwork, nnTrainer, nnOutput, datosEntrenamiento = [];
var modoAutomatico = false; // Modo automático
var entrenamientoCompleto = false; // Indica si el entrenamiento está completo
var juegosEntrenamiento = 3; // Número de juegos para el entrenamiento
var juegoActual = 0; // Juego actual
var PX = 200, PY = 200; // Posiciones del jugador
var REVERTIRV = false, REVERTIRH = false; // Variables de control adicionales

// Creación del juego en Phaser
var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', {
  preload: precargar,
  create: crear,
  update: actualizar,
  render: renderizar,
});
