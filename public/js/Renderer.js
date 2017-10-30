(function (exports) {
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    let Renderer = function (game) {
        this.game = game;
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
    };

    Renderer.prototype.render = function() {
        if (game.isStart) {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);

            let joueurs = this.game.joueurs;

            joueurs.forEach((j) => {
                this.renderPlayer(j)
            });
        }

        var ctx = this;
        requestAnimFrame(function () {
            ctx.render.call(ctx);
        });
    };

    Renderer.prototype.renderPlayer = function (p) {
        this.ctx.save();

        this.ctx.fillStyle = p.couleur;
        this.ctx.strokeStyle = p.couleur;
        this.ctx.lineWidth = p.width;

        this.ctx.beginPath();
        this.ctx.moveTo(p.trace[0].x, p.trace[0].y);


        p.trace.forEach((t) => {
            this.ctx.lineTo(t.x, t.y);
        });

        this.ctx.stroke();

        this.ctx.translate(p.x, p.y + p.width / 2);


        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.width / 2, 0, 2*Math.PI);
        this.ctx.fill();

        this.ctx.restore();
    };

    Renderer.prototype.renderTableJoueurs = function() {
        let listeJoueur = document.getElementById("listeJoueur");

        let htmlText = "";
        console.log('Nb joueurs: ' + this.game.joueurs.length);
        this.game.joueurs.forEach( (j) => {
            htmlText += j.getHtmlText();
        });

        listeJoueur.innerHTML = htmlText;
    };

    Renderer.prototype.renderTimer = function (t) {
        let timer = document.getElementById('timer');

        timer.innerHTML = 'La partie commencer dans ' + t;
    };

    exports.Renderer = Renderer;
})(window);