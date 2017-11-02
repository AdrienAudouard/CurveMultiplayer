window.onload = init;

let canvas, ctx;
let socket;
let listeJoueur;
let game;
let input;
let renderer;
let gf;
let tchat;
let totalSkew = 0;

function init() {
    canvas = document.querySelector("#myCanvas");
    listeJoueur = document.querySelector("#listeJoueur");
    ctx = canvas.getContext("2d");
    socket = io.connect('http://localhost:8082');
    game = new Game();
    input = new Input(game, document, socket);
    renderer = new Renderer(game);
    tchat = new Tchat(socket);

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
        renderer.clearCanvas();
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
        game.joueurs.forEach((j) => {
            renderer.renderPlayer(j);
        });
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

    socket.on('message', function (m) {
        console.log('Nouveau message: ' + m);
        tchat.message(m);
    });

    socket.on('time', function (d) {
        totalSkew += d.lastUpdate - game.timeStamp;
        console.log('totalSkew: ' + totalSkew);
        if (Math.abs(totalSkew) > game.MAX_LATENCY) {
            console.log('Request sync with server');
            socket.emit('state');
            totalSkew = 0;
        }
    });

    socket.on('add bonus', function (d) {
        let b = new BonusRoblochon(d.id, d.x, d.y, game);
        game.addBonus(b);

        console.log(game.bonus);
    });

    socket.on('touch bonus', function (d) {
        console.log(d);

        let b = game.getBonus(d.bonus);
        let j = game.getPlayer(d.joueur);

        console.log(b);

        b.applyBonus(j, game);
        b.estTouche = true;
    });

    socket.on('end bonus', function (d) {
        let b = game.getBonus(d.bonus);
        let j = game.getPlayer(d.joueur);

        b.removeBonus(j);

        game.removeBonus(b);
    });

    socket.on('victory', function (d) {
        game.win(d.winner);
    });

    socket.emit('connection');
}