class GameFrameworkClient {
    constructor (canvas, ctx, socket, listeJoueurTable) {
        this.joueurs = [];
        this.canvas = canvas;
        this.ctx = ctx;
        this.socket = socket;
        this.listeJoueurTable = listeJoueurTable;
        this.partieEncours = false;
    }

    ajouterJoueur(p) {
        let joueur = new JoueurClient();
        joueur.updateInit(p, this.socket);

        this.joueurs.push(joueur);

        this.updateTabJoueur();
    }

    initialiserJoueurs(p) {
        console.log('Reinitialisation des joueurs');
        this.joueurs = [];

        for (let i = 0; i < p.length; i++) {
            this.CreerJoueur(p[i]);
        }

        //$('#demanderCommencerPartie').disable(this.getPlayer(this.socket.id).isHost);
    }

    updateTabJoueur() {
        let htmlText = "";

        this.joueurs.forEach(function (j) {
            htmlText += j.getHtmlText();
        });

        this.listeJoueurTable.innerHTML = htmlText;
    }

    updatePseudo(pseudo) {
        console.log('Mise à jour du pseudo...');

        if (pseudo !== '') {
            this.majPseudoSocket(pseudo);
        }
    }


    getJoueur(id) {
        for(let i = 0; i < this.joueurs.length; i++) {
            if (this.joueurs[i].id === id) return this.joueurs[i];
        }

        return null;
    }

    animate() {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.joueurs.forEach(function (j) {
            j.updateDeplacement();
            j.draw(ctx);
        });

        if (this.partieEncours) {
            requestAnimationFrame(() => {
                this.animate();
            });
        }
    }

    updateJoueur(joueur) {
        console.log('Joueur ' + joueur.id + 'mis à jour');

        let j = this.getPlayer(joueur.id);

        j.update(joueur);

        this.updateTabJoueur();
    }

    commencerPartie() {
        this.partieEncours = true;
        this.animate();
    }

    demanderCommencerPartie() {
        this.commencerPartieSocket()
    }



    quitterPartie() {
        this.quitterPartieSocket();
    }

    majPseudoSocket(pseudo) {
        this.socket.emit('updatePseudo', pseudo);
    }

    quitterPartieSocket() {
        this.socket.emit('joueurQuitte', this.socket.id);
    }

    commencerPartieSocket() {
        this.socket.emit('commencer', '');
    }
}