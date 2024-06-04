// Dimensiones del juego
var w = 400; // Ancho del juego
var h = 400; // Alto del juego

// Variables para los objetos del juego
var jugador, fondo, bala; // Sprite del jugador, fondo y bala

// Variables para las teclas de control y elementos del menú
var cursors, menu, pausaL; // Teclas de control, menú de pausa y texto de pausa

// Variables para la red neuronal y su entrenamiento
var nnNetwork, nnEntrenamiento, nnSalida; // Red neuronal, entrenamiento y salida
var datosEntrenamiento = []; // Datos de entrenamiento para la red neuronal

// Variables de control
var autoMode = false, eCompleto = false; // Modo automático y estado de entrenamiento completo
var VOLVIENDOV = false, VOLVIENDOH = false; // Flags para el control de movimiento

// Posición del jugador
var JX = 200, JY = 200; // Coordenadas iniciales del jugador

// Creación del juego con Phaser
var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: cargarRecursos, create: crear, update: actualizar, render: renderizar });

// Precarga de los recursos del juego
function cargarRecursos() {
    juego.load.image('fondo', 'assets/game/As.jpg'); // Carga del fondo
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48); // Carga del sprite del jugador
    juego.load.image('menu', 'assets/game/menu.png'); // Carga del sprite del menú
    juego.load.image('bala', 'assets/sprites/purple_ball.png'); // Carga del sprite de la bala
}

// Configuración inicial del juego
function crear() {
    juego.physics.startSystem(Phaser.Physics.ARCADE); // Inicialización del sistema de física
    juego.physics.arcade.gravity.y = 0; // Sin gravedad
    juego.time.desiredFps = 30; // Configuración de los FPS deseados

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo'); // Creación del fondo

    // Creación del jugador en el centro de la pantalla
    jugador = juego.add.sprite(w / 2, h / 2, 'mono');
    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true; // Evita que el jugador salga del mundo
    jugador.animations.add('corre', [8, 9, 10, 11]).play(10, true); // Añadir y reproducir animación de correr

    // Creación de la bala
    bala = juego.add.sprite(0, 0, 'bala');
    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true; // Evita que la bala salga del mundo
    bala.body.bounce.set(1); // Configurar rebote de la bala
    setRandomBalaVelocity(); // Establecer velocidad aleatoria de la bala

    // Creación del texto de pausa y configuración de eventos
    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausar, this);
    juego.input.onDown.add(manejarPausa, this);

    cursors = juego.input.keyboard.createCursorKeys(); // Configuración de las teclas de control

    // Inicialización de la red neuronal
    nnNetwork = new synaptic.Architect.Perceptron(3, 6, 6, 6, 5);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}

// Función para entrenar la red neuronal
function entrenarRedNeuronal() {
    nnEntrenamiento.train(datosEntrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
}

// Función para procesar los datos verticales y obtener la salida de la red neuronal
function datosVertical(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada); // Activar la red neuronal con los parámetros de entrada
    if (param_entrada[2] < 80 && nnSalida[2] > 0.4 && nnSalida[2] < 0.6) return false; // Validación de entrada
    return nnSalida[2] >= nnSalida[3]; // Retornar comparación de salida vertical
}

// Función para procesar los datos horizontales y obtener la salida de la red neuronal
function datosHorizontal(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada); // Activar la red neuronal con los parámetros de entrada
    if (param_entrada[2] < 80 && nnSalida[1] > 0.4 && nnSalida[1] < 0.6) return false; // Validación de entrada
    return nnSalida[0] >= nnSalida[1]; // Retornar comparación de salida horizontal
}

// Función para procesar los datos de movimiento y obtener la salida de la red neuronal
function datosMovimiento(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada); // Activar la red neuronal con los parámetros de entrada
    if (param_entrada[2] < 80 && nnSalida[1] > 0.4 && nnSalida[1] < 0.6) return false; // Validación de entrada
    return nnSalida[4] * 100 >= 20; // Retornar comparación de salida de movimiento
}

// Función para pausar el juego
function pausar() {
    juego.paused = true; // Pausar el juego
    menu = juego.add.sprite(w / 2, h / 2, 'menu'); // Añadir sprite del menú
    menu.anchor.setTo(0.5, 0.5); // Centrar el menú
}

// Función para manejar el clic en el menú de pausa
function manejarPausa(event) {
    if (juego.paused) {
        var mouse_x = event.x, mouse_y = event.y;
        var menu_x1 = w / 2 - 135, menu_x2 = w / 2 + 135;
        var menu_y1 = h / 2 - 90, menu_y2 = h / 2 + 90;

        // Verificar si el clic está dentro de los límites del menú
        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            if (mouse_y <= menu_y1 + 90) {
                eCompleto = false; // Reiniciar estado de entrenamiento completo
                datosEntrenamiento = []; // Limpiar datos de entrenamiento
                autoMode = false; // Desactivar modo automático
            } else {
                if (!eCompleto) {
                    entrenarRedNeuronal(); // Entrenar la red neuronal
                    eCompleto = true; // Marcar entrenamiento como completo
                }
                autoMode = true; // Activar modo automático
            }
            menu.destroy(); // Eliminar menú
            resetearJuego(); // Resetear el juego
            juego.paused = false; // Reanudar el juego
        }
    }
}

// Función para resetear el estado del juego
function resetearJuego() {
    jugador.x = w / 2; // Resetear posición horizontal del jugador
    jugador.y = h / 2; // Resetear posición vertical del jugador
    jugador.body.velocity.x = 0; // Detener movimiento horizontal del jugador
    jugador.body.velocity.y = 0; // Detener movimiento vertical del jugador
    bala.x = 0; // Resetear posición horizontal de la bala
    bala.y = 0; // Resetear posición vertical de la bala
    setRandomBalaVelocity(); // Establecer velocidad aleatoria de la bala
}

// Función para establecer una velocidad aleatoria a la bala
function setRandomBalaVelocity() {
    var speed = 550; // Velocidad de la bala
    var angle = juego.rnd.angle(); // Obtener un ángulo aleatorio
    bala.body.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed); // Establecer velocidad basada en el ángulo
}

// Función para actualizar el estado del juego en cada frame
function actualizar() {
    fondo.tilePosition.x -= 1; // Desplazar el fondo hacia la izquierda

    if (!autoMode) { // Si el modo automático no está activado
        jugador.body.velocity.x = 0; // Detener movimiento horizontal del jugador
        jugador.body.velocity.y = 0; // Detener movimiento vertical del jugador

        if (cursors.left.isDown) { // Si la tecla de izquierda está presionada
            jugador.body.velocity.x = -300; // Mover jugador hacia la izquierda
        } else if (cursors.right.isDown) { // Si la tecla de derecha está presionada
            jugador.body.velocity.x = 300; // Mover jugador hacia la derecha
        }

        if (cursors.up.isDown) { // Si la tecla de arriba está presionada
            jugador.body.velocity.y = -300; // Mover jugador hacia arriba
        } else if (cursors.down.isDown) { // Si la tecla de abajo está presionada
            jugador.body.velocity.y = 300; // Mover jugador hacia abajo
        }
    }

    // Manejar colisiones entre la bala y el jugador
    juego.physics.arcade.collide(bala, jugador, colision, null, this);

    var dx = bala.x - jugador.x; // Calcular distancia horizontal entre la bala y el jugador
    var dy = bala.y - jugador.y; // Calcular distancia vertical entre la bala y el jugador
    var distancia = Math.sqrt(dx * dx + dy * dy); // Calcular distancia total

    // Inicializar estados del jugador
    var estatusIzquierda = 0, estatusDerecha = 0, estatusArriba = 0, estatusAbajo = 0, estatusMovimiento = 0;

    if (!autoMode) { // Si el modo automático no está activado
        if (dx > 0) { // Si la bala está a la derecha del jugador
            estatusIzquierda = 1; // Estado de movimiento a la izquierda
            estatusMovimiento = 1; // Estado de movimiento activo
        } else { // Si la bala está a la izquierda del jugador
            estatusDerecha = 1; // Estado de movimiento a la derecha
        }

        if (dy > 0) { // Si la bala está debajo del jugador
            estatusArriba = 1; // Estado de movimiento hacia arriba
        } else { // Si la bala está arriba del jugador
            estatusAbajo = 1; // Estado de movimiento hacia abajo
        }

        if (jugador.body.velocity.x != 0 || jugador.body.velocity.y != 0) { // Si el jugador está en movimiento
            estatusMovimiento = 1; // Estado de movimiento activo
        }
    }

    if (autoMode && datosMovimiento([dx, dy, distancia, JX, JY])) { // Si el modo automático está activado y se determina movimiento
        if (distancia <= 150) { // Si la distancia es menor o igual a 150
            if (datosVertical([dx, dy, distancia, JX, JY]) && !VOLVIENDOV) { // Si se determina movimiento vertical y no está volviendo
                jugador.body.velocity.y -= 35; // Mover jugador hacia arriba
            } else if (!datosVertical([dx, dy, distancia, JX, JY]) && !VOLVIENDOV && distancia <= 95) { // Si se determina movimiento vertical inverso y no está volviendo
                jugador.body.velocity.y += 35; // Mover jugador hacia abajo
            }

            if (datosHorizontal([dx, dy, distancia, JX, JY]) && !VOLVIENDOH) { // Si se determina movimiento horizontal y no está volviendo
                jugador.body.velocity.x -= 35; // Mover jugador hacia la izquierda
            } else if (!datosHorizontal([dx, dy, distancia, JX, JY]) && !VOLVIENDOH && distancia <= 95) { // Si se determina movimiento horizontal inverso y no está volviendo
                jugador.body.velocity.x += 35; // Mover jugador hacia la derecha
            }

            if (jugador.x > 300) { // Si el jugador se ha movido demasiado a la derecha
                jugador.body.velocity.x = -350; // Mover jugador rápidamente hacia la izquierda
                VOLVIENDOH = true; // Marcar que está volviendo horizontalmente
            } else if (jugador.x < 100) { // Si el jugador se ha movido demasiado a la izquierda
                jugador.body.velocity.x = 350; // Mover jugador rápidamente hacia la derecha
                VOLVIENDOH = true; // Marcar que está volviendo horizontalmente
            } else if (VOLVIENDOH && jugador.x > 150 && jugador.x < 250) { // Si el jugador está volviendo y se encuentra dentro de los límites centrales
                jugador.body.velocity.x = 0; // Detener movimiento horizontal
                VOLVIENDOH = false; // Marcar que ha terminado de volver horizontalmente
            }

            if (jugador.y > 300) { // Si el jugador se ha movido demasiado hacia abajo
                jugador.body.velocity.y = -350; // Mover jugador rápidamente hacia arriba
                VOLVIENDOV = true; // Marcar que está volviendo verticalmente
            } else if (jugador.y < 100) { // Si el jugador se ha movido demasiado hacia arriba
                jugador.body.velocity.y = 350; // Mover jugador rápidamente hacia abajo
                VOLVIENDOV = true; // Marcar que está volviendo verticalmente
            } else if (VOLVIENDOV && jugador.y > 150 && jugador.y < 250) { // Si el jugador está volviendo y se encuentra dentro de los límites centrales
                jugador.body.velocity.y = 0; // Detener movimiento vertical
                VOLVIENDOV = false; // Marcar que ha terminado de volver verticalmente
            }
        } else if (distancia >= 200) { // Si la distancia es mayor o igual a 200
            jugador.body.velocity.y = 0; // Detener movimiento vertical
            jugador.body.velocity.x = 0; // Detener movimiento horizontal
        }
    }

    if (!autoMode && bala.position.x > 0) { // Si el modo automático no está activado y la bala está en movimiento
        JX = jugador.x; // Actualizar posición horizontal del jugador
        JY = jugador.y; // Actualizar posición vertical del jugador

        datosEntrenamiento.push({
            'input': [dx, dy, distancia, JX, JY], // Añadir parámetros de entrada
            'output': [estatusIzquierda, estatusDerecha, estatusArriba, estatusAbajo, estatusMovimiento] // Añadir estados de salida
        });
    }
}

// Función para manejar colisiones
function colision() {
    autoMode = true; // Activar modo automático
    pausar(); // Pausar el juego en caso de colisión
}

// Función para renderizar el juego (vacía en este caso)
function renderizar() {
    // Renderizar el estado del juego o información adicional
}
