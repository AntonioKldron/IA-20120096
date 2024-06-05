// Dimensiones del juego
var w = 800; // Ancho del juego
var h = 400; // Alto del juego

// Variables para los objetos del juego
var jugador; // Sprite del jugador
var fondo; // Fondo del juego

// Variables para las balas y naves
var bala, balaD = false, nave; // Bala y nave 1
var bala2, balaD2 = false, nave2; // Bala y nave 2
var bala3, balaD3 = false, nave3; // Bala y nave 3

// Variables para las teclas de control
var salto; // Tecla de salto (SPACEBAR)
var avanza; // Tecla de avanzar (RIGHT)
var atras; // Tecla de retroceder (LEFT)
var menu; // Menú de pausa

// Variables para la física de las balas y estado del jugador
var velocidadBala; // Velocidad de la bala 1
var despBala; // Desplazamiento de la bala 1
var velocidadBala2; // Velocidad de la bala 2
var despBala2; // Desplazamiento de la bala 2
var velocidadBala3; // Velocidad de la bala 3
var despBalaHorizontal3; // Desplazamiento horizontal de la bala 3
var despBalaVertical3; // Desplazamiento vertical de la bala 3
var despBala3; // Desplazamiento total de la bala 3
var estatusAire; // Estado en el aire del jugador
var estatuSuelo; // Estado en el suelo del jugador
var estatusDerecha; // Estado moviéndose a la derecha del jugador
var estatusIzquierda; // Estado moviéndose a la izquierda del jugador

// Variables para la red neuronal y el modo automático
var nnNetwork, nnEntrenamiento, nnSalida, datosEntrenamiento = []; // Red neuronal y datos de entrenamiento
var modoAuto = false, eCompleto = false; // Modo automático y estado de entrenamiento completo

// Creación del juego con Phaser
var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: cargarRecursos, create: crear, update: actualizar, render: renderizar });

// Precarga de los recursos del juego
function cargarRecursos() {
    juego.load.image('fondo', 'assets/game/As.jpg'); // Carga del fondo
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48); // Carga del sprite del jugador
    juego.load.image('nave', 'assets/game/ufo.png'); // Carga del sprite de la nave
    juego.load.image('bala', 'assets/sprites/purple_ball.png'); // Carga del sprite de la bala
    juego.load.image('menu', 'assets/game/menu.png'); // Carga del sprite del menú
}

// Configuración inicial del juego
function crear() {
    juego.physics.startSystem(Phaser.Physics.ARCADE); // Inicialización del sistema de física
    juego.physics.arcade.gravity.y = 800; // Configuración de la gravedad
    juego.time.desiredFps = 30; // Configuración de los FPS deseados

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo'); // Creación del fondo

    // Creación de las naves y balas
    nave = juego.add.sprite(w - 100, h - 70, 'nave');
    bala = juego.add.sprite(w - 100, h, 'bala');
    nave2 = juego.add.sprite(w - 800, h - 400, 'nave');
    bala2 = juego.add.sprite(w - 760, h - 380, 'bala');
    nave3 = juego.add.sprite(w - 100, h - 400, 'nave');
    bala3 = juego.add.sprite(w - 100, h - 370, 'bala');

    // Creación del jugador
    jugador = juego.add.sprite(50, h - 48, 'mono'); // Ajuste para colocar al jugador correctamente sobre el suelo

    // Habilitación de la física para el jugador
    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true; // Evita que el jugador salga del mundo

    // Añadir y reproducir animación de correr para el jugador
    var corre = jugador.animations.add('corre', [8, 9, 10, 11]);
    jugador.animations.play('corre', 10, true);

    // Habilitación de la física para las balas y las naves
    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;
    juego.physics.enable(nave);
    nave.body.collideWorldBounds = true;
    juego.physics.enable(bala2);
    bala2.body.collideWorldBounds = true;
    juego.physics.enable(bala3);
    bala3.body.collideWorldBounds = true;

    // Creación del texto de pausa y configuración de eventos
    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausar, self);
    juego.input.onDown.add(manejarPausa, self);

    // Configuración de las teclas de control
    salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    avanza = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    atras = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    // Inicialización de la red neuronal
    nnNetwork = new synaptic.Architect.Perceptron(6, 5, 5, 5, 4);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}

// Función para entrenar la red neuronal
function entrenarRedNeuronal() {
    nnEntrenamiento.train(datosEntrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
}

// Función para procesar los datos de entrada y obtener la salida de la red neuronal
function datosDeEntrenamiento(param_entrada) {
    console.log("Entrada", param_entrada.join(" ")); // Imprimir parámetros de entrada
    nnSalida = nnNetwork.activate(param_entrada); // Activar la red neuronal con los parámetros de entrada
    var aire = Math.round(nnSalida[0] * 100); // Obtener y redondear el valor de aire
    var piso = Math.round(nnSalida[1] * 100); // Obtener y redondear el valor de piso
    var derecha = Math.round(nnSalida[2] * 100); // Obtener y redondear el valor de derecha
    var izquierda = Math.round(nnSalida[3] * 100); // Obtener y redondear el valor de izquierda
    console.log("\n En la derecha %: " + derecha + "\n En la izquierda %: " + izquierda); // Imprimir valores de derecha e izquierda
    console.log("OUTPUTS: " + (nnSalida[2] >= nnSalida[3])); // Imprimir resultado de comparación de salidas
    return nnSalida[2] >= nnSalida[3]; // Retornar si la salida derecha es mayor o igual que la izquierda
}

// Función para entrenar la red neuronal para los saltos
function entrenamientoSalto(param_entrada) {
    console.log("Entrada", param_entrada.join(" ")); // Imprimir parámetros de entrada
    nnSalida = nnNetwork.activate(param_entrada); // Activar la red neuronal con los parámetros de entrada
    var aire = Math.round(nnSalida[0] * 100); // Obtener y redondear el valor de aire
    var piso = Math.round(nnSalida[1] * 100); // Obtener y redondear el valor de piso
    console.log(" En el Aire %: " + aire + "\n En el suelo %: " + piso); // Imprimir valores de aire y piso
    console.log("OUTPUTS: " + (nnSalida[0] >= nnSalida[1])); // Imprimir resultado de comparación de salidas
    return nnSalida[0] >= nnSalida[1]; // Retornar si la salida aire es mayor o igual que el suelo
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
        var menu_x1 = w / 2 - 135, menu_x2 = w / 2 + 135,
            menu_y1 = h / 2 - 90, menu_y2 = h / 2 + 90;

        var mouse_x = event.x,
            mouse_y = event.y;

        // Verificar si el clic está dentro de los límites del menú
        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1 + 90) {
                eCompleto = false; // Reiniciar estado de entrenamiento completo
                datosEntrenamiento = []; // Limpiar datos de entrenamiento
                modoAuto = false; // Desactivar modo automático
            } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
                if (!eCompleto) {
                    console.log("", "Entrenamiento " + datosEntrenamiento.length + " valores"); // Imprimir mensaje de entrenamiento
                    entrenarRedNeuronal(); // Entrenar la red neuronal
                    eCompleto = true; // Marcar entrenamiento como completo
                }
                modoAuto = true; // Activar modo automático
            }
            menu.destroy(); // Eliminar menú
            resetearVariablesBala1(); // Resetear variables de la bala 1
            resetearVariablesBala2(); // Resetear variables de la bala 2
            resetearVariablesBala3(); // Resetear variables de la bala 3
            resetearJugador(); // Resetear posición del jugador
            juego.paused = false; // Reanudar el juego
        }
    }
}

// Funciones para resetear las variables de las balas
function resetearVariablesBala1() {
    bala.body.velocity.x = 0; // Detener movimiento de la bala 1
    bala.position.x = w - 100; // Resetear posición de la bala 1
    balaD = false; // Marcar bala 1 como no disparada
}

function resetearVariablesBala2() {
    bala2.body.velocity.y = -270; // Detener movimiento vertical de la bala 2
    bala2.position.y = h - 400; // Resetear posición de la bala 2
    balaD2 = false; // Marcar bala 2 como no disparada
}

function resetearVariablesBala3() {
    bala3.body.velocity.y = -270; // Detener movimiento vertical de la bala 3
    bala3.body.velocity.x = 0; // Detener movimiento horizontal de la bala 3
    bala3.position.x = w - 100; // Resetear posición horizontal de la bala 3
    bala3.position.y = h - 500; // Resetear posición vertical de la bala 3
    balaD3 = false; // Marcar bala 3 como no disparada
}

// Función para resetear la posición del jugador
function resetearJugador() {
    jugador.position.x = 50; // Resetear posición horizontal del jugador
}

// Función para hacer saltar al jugador
function saltar() {
    if (jugador.body.onFloor()) { // Asegurarse de que solo salte si está en el suelo
        jugador.body.velocity.y = -300; // Ajuste para una mejor altura de salto
    }
}

// Función para hacer correr al jugador hacia adelante
function correr() {
    jugador.body.velocity.x = 200; // Configurar velocidad hacia adelante
}

// Función para hacer correr al jugador hacia atrás
function correrAtras() {
    jugador.body.velocity.x = -200; // Configurar velocidad hacia atrás
}

// Función para detener al jugador
function detenerse() {
    jugador.body.velocity.x = 0; // Detener movimiento del jugador
}

// Función para actualizar el estado del juego en cada frame
function actualizar() {
    fondo.tilePosition.x -= 1; // Desplazar el fondo hacia la izquierda

    // Manejar colisiones entre el jugador y las naves y balas
    juego.physics.arcade.collide(jugador, nave, colisionH, null, this);
    juego.physics.arcade.collide(jugador, bala, colisionH, null, this);
    juego.physics.arcade.collide(jugador, bala2, colisionH, null, this);
    juego.physics.arcade.collide(jugador, bala3, colisionH, null, this);

    var enSuelo = jugador.body.onFloor(); // Verificar si el jugador está en el suelo
    var enAire = !enSuelo || jugador.body.velocity.y != 0; // Verificar si el jugador está en el aire

    if (!modoAuto) { // Si el modo automático no está activado
        manejarControlManual(enSuelo, enAire); // Manejar el control manual del jugador
    } else if (modoAuto && enSuelo) { // Si el modo automático está activado y el jugador está en el suelo
        manejarControlAutomatico(enSuelo, enAire); // Manejar el control automático del jugador
    }

    actualizarBalas(); // Actualizar el estado de las balas
}

// Función para manejar el control manual del jugador
function manejarControlManual(enSuelo, enAire) {
    if (salto.isDown) { // Si la tecla de salto está presionada
        manejarSalto(enAire); // Manejar el salto
    } else {
        manejarMovimiento(enSuelo, enAire); // Manejar el movimiento
    }
}

// Función para manejar el salto del jugador
function manejarSalto(enAire) {
    jugador.body.velocity.x = 0; // Detener movimiento horizontal durante el salto
    if (atras.isDown && !avanza.isDown) { // Si la tecla de retroceder está presionada y avanzar no lo está
        if (enAire) { // Si está en el aire
            saltar(); // Saltar
            correrAtras(); // Correr hacia atrás
        }
    } else if (avanza.isDown) { // Si la tecla de avanzar está presionada
        if (enAire) { // Si está en el aire
            saltar(); // Saltar
            correr(); // Correr hacia adelante
        } else {
            saltar(); // Saltar
        }
    } else {
        saltar(); // Saltar
    }
}

// Función para manejar el movimiento del jugador
function manejarMovimiento(enSuelo, enAire) {
    if (avanza.isDown && !atras.isDown) { // Si la tecla de avanzar está presionada y retroceder no lo está
        if (enSuelo && !enAire) { // Si está en el suelo y no en el aire
            correr(); // Correr hacia adelante
        }
    } else if (atras.isDown && !avanza.isDown) { // Si la tecla de retroceder está presionada y avanzar no lo está
        if (enSuelo && !enAire) { // Si está en el suelo y no en el aire
            correrAtras(); // Correr hacia atrás
        }
    } else if (!salto.isDown && !atras.isDown && !avanza.isDown) { // Si ninguna tecla está presionada
        jugador.body.velocity.x = 0; // Detener movimiento horizontal
        detenerse(); // Detener al jugador
    } else if (enSuelo && jugador.position.x >= 250) { // Si está en el suelo y ha avanzado más de 250 px
        detenerse(); // Detener al jugador
        correrAtras(); // Correr hacia atrás
    } else {
        detenerse(); // Detener al jugador
    }
}

// Función para manejar el control automático del jugador
function manejarControlAutomatico(enSuelo, enAire) {
    var inputParams = obtenerParametrosEntrada(); // Obtener parámetros de entrada
    if (entrenamientoSalto(inputParams)) { // Si el entrenamiento de salto determina que debe saltar
        if (jugador.body.velocity.x <= 0) { // Si la velocidad horizontal del jugador es menor o igual a 0
            jugador.body.velocity.x = 150; // Configurar velocidad hacia adelante
            saltar(); // Saltar
            correr(); // Correr hacia adelante
        } else {
            saltar(); // Saltar
            detenerse(); // Detener al jugador
        }
    }
    if (datosDeEntrenamiento(inputParams)) { // Si el entrenamiento de datos determina que debe correr
        correr(); // Correr hacia adelante
    } else if (enSuelo && jugador.position.x >= 250) { // Si está en el suelo y ha avanzado más de 250 px
        detenerse(); // Detener al jugador
        correrAtras(); // Correr hacia atrás
    }

    if (!eCompleto && bala.position.x > 0) { // Si el entrenamiento no está completo y la bala está en movimiento
        datosEntrenamiento.push({
            'input': inputParams, // Agregar parámetros de entrada
            'output': [estatusAire, estatuSuelo, estatusDerecha, estatusIzquierda] // Agregar estados de salida
        });
    }
}

// Función para obtener los parámetros de entrada para la red neuronal
function obtenerParametrosEntrada() {
    return [
        despBala = Math.floor(jugador.position.x - bala.position.x), // Desplazamiento de la bala 1
        velocidadBala, // Velocidad de la bala 1
        despBala2 = Math.floor(jugador.position.x - bala2.position.x), // Desplazamiento de la bala 2
        velocidadBala2, // Velocidad de la bala 2
        despBalaHorizontal3 = Math.floor(jugador.position.x - bala3.position.x), // Desplazamiento horizontal de la bala 3
        despBalaVertical3 = Math.floor(jugador.position.y - bala3.position.y), // Desplazamiento vertical de la bala 3
        despBala3 = Math.floor(despBalaHorizontal3 + despBalaVertical3), // Desplazamiento total de la bala 3
        velocidadBala3 // Velocidad de la bala 3
    ];
}

// Función para actualizar el estado de las balas en cada frame
function actualizarBalas() {
    if (!balaD) { // Si la bala 1 no ha sido disparada
        dispararBala1(); // Disparar bala 1
    }
    if (!balaD2) { // Si la bala 2 no ha sido disparada
        dispararBala2(); // Disparar bala 2
    }
    if (!balaD3) { // Si la bala 3 no ha sido disparada
        dispararBala3(); // Disparar bala 3
    }
    if (bala.position.x <= 0) { // Si la bala 1 ha salido de la pantalla
        resetearVariablesBala1(); // Resetear variables de la bala 1
    }
    if (bala2.position.y >= 355) { // Si la bala 2 ha llegado al suelo
        resetearVariablesBala2(); // Resetear variables de la bala 2
    }
    if (bala3.position.x <= 0 || bala3.position.y >= 355) { // Si la bala 3 ha salido de la pantalla o ha llegado al suelo
        resetearVariablesBala3(); // Resetear variables de la bala 3
    }
}

// Función para disparar la bala 1
function dispararBala1() {
    velocidadBala = -1 * velocidadAleatoria(300, 700); // Configurar velocidad aleatoria de la bala 1
    bala.body.velocity.x = velocidadBala; // Aplicar velocidad a la bala 1
    balaD = true; // Marcar bala 1 como disparada
}

// Función para disparar la bala 2
function dispararBala2() {
    velocidadBala2 = -1 * velocidadAleatoria(300, 600); // Configurar velocidad aleatoria de la bala 2
    bala2.body.velocity.y = 0; // Aplicar velocidad a la bala 2
    balaD2 = true; // Marcar bala 2 como disparada
}

// Función para disparar la bala 3
function dispararBala3() {
    velocidadBala3 = -1 * velocidadAleatoria(400, 500); // Configurar velocidad aleatoria de la bala 3
    bala3.body.velocity.y = 0; // Aplicar velocidad vertical a la bala 3
    bala3.body.velocity.x = 1.60 * velocidadBala3; // Aplicar velocidad horizontal a la bala 3
    balaD3 = true; // Marcar bala 3 como disparada
}

// Función para manejar colisiones
function colisionH() {
    modoAuto = false; // Desactivar modo automático en caso de colisión
    datosEntrenamiento.push({
        'input': obtenerParametrosEntrada(), // Agregar parámetros de entrada
        'output': [1, 0, 0, 0] // Estado de muerte (el jugador ha muerto)
    });
    pausar(); // Pausar el juego en caso de colisión
}

// Función para generar una velocidad aleatoria dentro de un rango
function velocidadAleatoria(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Retornar un valor aleatorio entre min y max
}

// Función para renderizar el juego (vacía en este caso)
function renderizar() {
    // Renderizar el estado del juego o información adicional
}
