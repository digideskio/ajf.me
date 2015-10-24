(function () {
    'use strict';

    function makeSprite(src, width, height, x, y, z, xRot, yRot, zRot) {
        var elem = document.createElement('img');
        elem.src = src;
        elem.width = width;
        elem.height = height;
        elem.style.opacity = 0.5;
        elem.style.marginLeft = (-width / 2) + 'px';
        elem.style.marginTop = (-height / 2) + 'px';
        elem.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px) rotateX(' + xRot + 'deg) rotateY(' + yRot + 'deg) rotateZ(' + zRot + 'deg)';
        elem.className = 'entity';
        return elem;
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    window.onload = function () {
        var world = document.getElementById('world');

        for (var i = 0; i < 100; i++) {
            var sprite = makeSprite('skulltrumpet.gif', 209, 190, rand(-300, 300), rand(-300, 300), rand(-300, 300), rand(-15, 15), rand(0, 360), rand(-15, 15));
            world.appendChild(sprite);
        }
    };
}());
