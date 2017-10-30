(function (exports) {
    var Input = function (game, document, socket) {
        this.game = game;
        this.document = document;
        this.socket = socket;
        this.leftPress = false;
        this.rightPress = false;

        this.document.onkeydown = function (e) {
            if (e.keyCode == '37') {
                // left arrow

                if (!this.leftPress) {
                    this.leftPress = true;
                    console.log('left down');
                    socket.emit('left', { press: true });
                }
            }
            else if (e.keyCode == '39') {
                if (!this.rightPress) {
                    this.rightPress = true;
                    console.log('right down');
                    socket.emit('right', { press: true });
                }
            }
        };

        this.document.onkeyup = function (e) {
            if (e.keyCode == '37') {
                // left arrow

                this.leftPress = false;
                console.log('left up');
                socket.emit('left', { press: false });
            }
            else if (e.keyCode == '39') {
                this.rightPress = false;
                console.log('right up');
                socket.emit('right', { press: false });

            }
        };

        window.onbeforeunload =  () => {
            this.socket.emit('leave', this.socket.id);
        };

        var start = document.getElementById('start');
        start.addEventListener('click', (e) =>  {
            this.socket.emit('start', '');
        });

        var buttonPseudo = document.getElementById('buttonPseudo');
        buttonPseudo.addEventListener('click', (e) => {
            let pseudo = $('#pseudo').val();

            if (pseudo !== '') {
                this.socket.emit('rename', pseudo);
            }

        });

         var pseudo = document.getElementById('pseudo');
         pseudo.onkeyup = (e) =>  {
             if (e.keyCode == '13') {
                 var p = pseudo.value;

                 if (p != '') {
                     this.socket.emit('rename', p);
                 }
             }
         };
    };

    exports.Input = Input;
})(window);