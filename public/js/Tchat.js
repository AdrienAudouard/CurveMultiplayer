(function (exports) {
    var Tchat = function (socket) {
        this.socket = socket;
        this.tchat = document.getElementById('tchat');

        var tchatText = document.getElementById('tchatText');
        tchatText.onkeyup = (e) => {
            if (e.keyCode == '13') {
                let text = tchatText.value;

                if (text != '') {
                    this.socket.emit('message', text);
                    tchatText.value = '';
                }
            }
        }
    };

    Tchat.prototype.message = function (text) {
        text = '<p>' + text + '</p>';

        this.tchat.innerHTML = this.tchat.innerHTML + text;

        this.tchat.scrollTop = tchat.scrollHeight;
    };

    exports.Tchat = Tchat;
})(window);