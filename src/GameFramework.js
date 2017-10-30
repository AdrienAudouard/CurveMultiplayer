let GameFramework = class GameFramework {
    constructor (io){
        this.nextId = 0;
        this.listeJoueur = [];
        this.partieEnCours = false;
        this.io = io;
        this.colors = ["#2ecc71", "#3498db", "#9b59b6", "#e74c3c", "#f1c40f", "#ecf0f1", "#95a5a6"];
    }

    creerJoueur(socket) {
        const joueur = new Joueur();
        const x = Math.random() * 380;
        const y = Math.random() * 280;
        const id = socket.id;
        const isHost = this.listeJoueur.length === 0;

        joueur.x = x;
        joueur.y = y;
        joueur.id = id;
        joueur.isHost = isHost;
        joueur.pseudo = "Joueur " + this.nextId;
        joueur.couleur = this.colors[this.listeJoueur.length];

        this.nextId++;

        this.listeJoueur.push(joueur);

        return joueur;
    }

    getJoueur(id) {
        for (let i = 0; i < this.listeJoueur.length; i++) {
            if (this.listeJoueur[i].id == id) return this.listeJoueur[i];
        }

        return null;
    }

    updatePseudo(pseudo, id) {
        var j = this.getPlayer(id);


        if (j) {
            console.log(j.pseudo + '(' + id + ') a maintenant pour pseudo ' + pseudo);

            j.pseudo = pseudo;

            this.io.emit('updateJoueur', j);
        }

    }

    commencerPartie() {
        this.io.emit('commencer', '');

        this.partieEnCours = true;
        this.actualiser();
    }

    actualiser() {
        this.listeJoueur.forEach(function (j) {
            j.x += j.vitesseX * 120;
            j.y += j.vitesseY * 120;
        });

        console.log('passe');

        setTimeout(() => {
            this.actualiser();
        }, 2000);

        this.io.emit('getPlayer', this.listeJoueur);


    }

    supprimerJoueur(id) {
        console.log('Joueur ' + id + ' quitte le jeu');
        this.listeJoueur = this.listeJoueur.filter(item => item.id != id);

        if (this.listeJoueur.length > 0) {
            this.listeJoueur[0].isHost = true;
        }

        this.io.emit('getPlayer', this.listeJoueur);
    }
};

module.exports = GameFramework;