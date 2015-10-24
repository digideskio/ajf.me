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
        var viewport = document.getElementById('viewport');
        var world = document.getElementById('world');

        var width = window.innerWidth;
        var height = window.innerHeight;

        // We calculate some values so that viewport size doesn't change
        // the experience much
        // The original had a 600x600 viewport with 600px perspective
        // That happens to be half of the sum of the width and height
        var perspective = (width + height) / 2;

        // Originally there were 100 skulltrumpets
        // Considering the dimensions, roughly 1 skulltrumpet/2160000 voxels
        // (They're not quite voxels but this ensures roughly the right density)
        var trumpetCount = (width * height * perspective) / 2160000;

        // Originally the 360° turn was completed in 15 seconds
        // That's roughly 1 second/40 pixels
        var secondsPerRotation = width / 40;

        viewport.style.perspective = perspective + 'px';
        world.style.animationDuration = secondsPerRotation + 's';

        for (var i = 0; i < trumpetCount; i++) {
            var sprite = makeSprite(
                'skulltrumpet.gif', 209, 190,
                rand(-width/2, width/2), rand(-height/2, height/2), rand(-width/2, width/2),
                rand(-15, 15), rand(0, 360), rand(-15, 15)
            );
            world.appendChild(sprite);
        }
    };
}());
