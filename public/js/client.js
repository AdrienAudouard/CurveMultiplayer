window.onload = init;

let canvas, ctx;
let socket;
let listeJoueur;
let game;
let input;
let renderer;
let gf;
let tchat;

function init() {

    canvas = document.querySelector("#myCanvas");
    listeJoueur = document.querySelector("#listeJoueur");
    ctx = canvas.getContext("2d");
    socket = io.connect('http://localhost:8082');
    game = new Game();
    input = new Input(game, document, socket);
    renderer = new Renderer(game);
    tchat = new Tchat(socket);

    gf = new GameFrameworkClient(canvas, ctx, socket, listeJoueur);

    socket.on('id', function (id) {
       game.id = id;
       console.log('receive id:' + id);
    });

    socket.on('join', function (j) {
        game.join(j.joueur);
        renderer.renderPlayer(j.joueur);
        renderer.renderTableJoueurs();
    });

    socket.on('load', function (d) {
        game.load(d.data);

        game.joueurs.forEach((j) => {
           renderer.renderPlayer(j);
        });

        renderer.renderTableJoueurs();
    });

    socket.on('rename', function (d) {
       game.rename(d.id, d.pseudo);
       renderer.renderTableJoueurs();
    });

    socket.on('leave', function (id) {
       game.leave(id);
       renderer.renderTableJoueurs();
    });

    socket.on('die', function (d) {
       game.die(d.id);
       renderer.renderTableJoueurs();
    });

    socket.on('left', function (d) {
       game.left(d.id, d.press);
    });

    socket.on('right', function (d) {
       game.right(d.id, d.press);
    });

    socket.on('start', function (e) {
        console.log('Debut de la partie');
        game.isStart = true;
        game.updateEvery(game.UPDATE_INTERVAL);
        renderer.render();
    });

    socket.on('timer', function (t) {
       renderer.renderTimer(t);
    });

    socket.on('message', function (m) {
        console.log('Nouveau message: ' + m);
        tchat.message(m);
    });

    socket.on('victory', function (d) {
        game.win(d.winner);
    });

    socket.emit('connection');
}