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

// Función para precargar los activos del juego
function precargar() {
    juego.load.image('fondo', 'assets/game/As.jpg'); // Carga del fondo
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48); // Carga del sprite del jugador
    juego.load.image('menu', 'assets/game/menu.png'); // Carga del sprite del menú
    juego.load.image('bala', 'assets/sprites/purple_ball.png'); // Carga del sprite de la bala
}

// Función para crear los elementos del juego
function crear() {
  // Configuración de la física del juego
  juego.physics.startSystem(Phaser.Physics.ARCADE);
  juego.physics.arcade.gravity.y = 0;
  juego.time.desiredFps = 30;

  // Creación del fondo
  fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');

  // Creación del jugador
  jugador = juego.add.sprite(w / 2, h / 2, 'mono');
  juego.physics.enable(jugador);
  jugador.body.collideWorldBounds = true;
  jugador.animations.add('corre', [8, 9, 10, 11]);
  jugador.animations.play('corre', 10, true);

  // Creación de la bala
  bala = juego.add.sprite(0, 0, 'bala');
  juego.physics.enable(bala);
  bala.body.collideWorldBounds = true;
  bala.body.bounce.set(1);
  establecerVelocidadAleatoriaBala();

  // Creación del texto de pausa
  pausaL = juego.add.text(w - 100, 20, 'Pausa', {
    font: '20px Arial',
    fill: '#fff',
  });
  pausaL.inputEnabled = true;
  pausaL.events.onInputUp.add(pausar, this);
  juego.input.onDown.add(manejarPausa, this);

  // Creación de las teclas de control del jugador
  cursors = juego.input.keyboard.createCursorKeys();

  // Configuración de la red neuronal
  nnNetwork = new synaptic.Architect.Perceptron(5, 10, 4);
  nnTrainer = new synaptic.Trainer(nnNetwork);
}

// Función para establecer una velocidad aleatoria a la bala
function establecerVelocidadAleatoriaBala() {
  var velocidadBase = 550;
  var angulo = juego.rnd.angle();
  bala.body.velocity.set(
    Math.cos(angulo) * velocidadBase,
    Math.sin(angulo) * velocidadBase,
  );
}

// Función de actualización del juego, se ejecuta en cada frame
function actualizar() {
  fondo.tilePosition.x -= 1;

  if (!modoAutomatico) {
    manejarMovimientoManual();
  } else {
    if (datosEntrenamiento.length > 0) {
      manejarMovimientoAutomatico();
    } else {
      jugador.body.velocity.x = 0;
      jugador.body.velocity.y = 0;
    }
  }

  juego.physics.arcade.collide(bala, jugador, colisionar, null, this);
}

// Función para manejar el movimiento manual del jugador
function manejarMovimientoManual() {
  var prevX = jugador.body.velocity.x;
  var prevY = jugador.body.velocity.y;

  jugador.body.velocity.x = 0;
  jugador.body.velocity.y = 0;

  var moverIzquierda = cursors.left.isDown ? 1 : 0;
  var moverDerecha = cursors.right.isDown ? 1 : 0;
  var moverArriba = cursors.up.isDown ? 1 : 0;
  var moverAbajo = cursors.down.isDown ? 1 : 0;

  if (moverIzquierda) {
    jugador.body.velocity.x = -300;
  } else if (moverDerecha) {
    jugador.body.velocity.x = 300;
  }

  if (moverArriba) {
    jugador.body.velocity.y = -300;
  } else if (moverAbajo) {
    jugador.body.velocity.y = 300;
  }

  // Solo registrar si hubo un cambio en el movimiento
  if (jugador.body.velocity.x !== prevX || jugador.body.velocity.y !== prevY) {
    registrarDatosEntrenamiento();
  }
}

// Función para manejar el movimiento automático del jugador
function manejarMovimientoAutomatico() {
  var dx = bala.x - jugador.x;
  var dy = bala.y - jugador.y;
  var distancia = Math.sqrt(dx * dx + dy * dy);
  var input = [dx, dy, distancia, jugador.x, jugador.y];

  nnOutput = nnNetwork.activate(input);

  var moverIzquierda = nnOutput[0] > 0.5 ? 1 : 0;
  var moverDerecha = nnOutput[1] > 0.5 ? 1 : 0;
  var moverArriba = nnOutput[2] > 0.5 ? 1 : 0;
  var moverAbajo = nnOutput[3] > 0.5 ? 1 : 0;

  jugador.body.velocity.x = (moverDerecha - moverIzquierda) * 300;
  jugador.body.velocity.y = (moverAbajo - moverArriba) * 300;
}

// Función para registrar los datos de entrenamiento
function registrarDatosEntrenamiento() {
  if (!modoAutomatico && bala.position.x > 0) {
    var dx = bala.x - jugador.x;
    var dy = bala.y - jugador.y;
    var distancia = Math.sqrt(dx * dx + dy * dy);
    var datosIzquierda = cursors.left.isDown ? 1 : 0;
    var datosDerecha = cursors.right.isDown ? 1 : 0;
    var datosArriba = cursors.up.isDown ? 1 : 0;
    var datosAbajo = cursors.down.isDown ? 1 : 0;
    var movimiento = datosIzquierda || datosDerecha || datosArriba || datosAbajo;

    if (movimiento) {
      PX = jugador.x;
      PY = jugador.y;

      datosEntrenamiento.push({
        'input': [dx, dy, distancia, PX, PY],
        'output': [datosIzquierda, datosDerecha, datosArriba, datosAbajo, movimiento]
      });

      console.log('Datos de Entrenamiento Registrados');
    }
  }
}

// Función que se ejecuta cuando hay una colisión entre la bala y el jugador
function colisionar() {
  modoAutomatico = true;
  pausar();
}

// Función para pausar el juego
function pausar() {
  juego.paused = true;
  menu = juego.add.sprite(w / 2, h / 2, 'menu');
  menu.anchor.setTo(0.5, 0.5);
}

// Función para manejar la pausa del juego
function manejarPausa(event) {
  if (juego.paused) {
    var menu_x1 = w / 2 - 270 / 2, menu_x2 = w / 2 + 270 / 2,
        menu_y1 = h / 2 - 180 / 2, menu_y2 = h / 2 + 180 / 2;
    var mouse_x = event.x, mouse_y = event.y;

    if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
      if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1 + 90) {
        entrenamientoCompleto = false;
        datosEntrenamiento = [];
        modoAutomatico = false;
      } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
        if (!entrenamientoCompleto && datosEntrenamiento.length > 0) {
          nnTrainer.train(datosEntrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
          entrenamientoCompleto = true;
        }
        modoAutomatico = true;
      }
      menu.destroy();
      reiniciarJuego();
      juego.paused = false;
    }
  }
}

// Función para reiniciar el juego
function reiniciarJuego() {
  jugador.x = w / 2;
  jugador.y = h / 2;
  jugador.body.velocity.x = 0;
  jugador.body.velocity.y = 0;
  bala.x = 0;
  bala.y = 0;
  establecerVelocidadAleatoriaBala();
}

// Función de renderizado (vacía en este caso)
function renderizar() {
  // Renderizar el estado del juego o información adicional
}
