(function () {
    'use strict';
    var rand;
    rand = function () {
        return String.fromCharCode(Math.floor(Math.random() * 256));
    };
    
    window.onload = function () {
    document.body.style.fontFamily = 'monospace';
        window.setInterval(function () {
            var i, str = '', node;
            for (i = 0; i < 4096; i += 1) {
                str += rand();
            }
            node = document.createTextNode(str);
            document.body.appendChild(node);
        }, 10);
    };
}());
