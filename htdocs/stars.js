(function () {
    'use strict';
    var secs;

    secs = function () {
        return new Date().getTime() / 1000;
    };

    window.onload = function () {
        var canvas, ctx, stars, star, i, render;

        canvas = document.getElementById('stars');

        ctx = canvas.getContext('2d');

        stars = [];

        render = function render() {
            var starnum, starspeed, now, size;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            starnum = Math.floor(Math.sqrt(canvas.width * canvas.height) / 2);
            starspeed = canvas.width / 8;

            if (stars.length < starnum - 1) {
                for (i = stars.length; i < starnum; i += 1) {
                    star = {
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        depth: Math.pow(Math.random(), 2),
                        prev: secs()
                    };
                    stars.push(star);
                }
            } else if (stars.length > starnum - 1) {
                stars.splice(starnum);
            }

            for (i = 0; i < stars.length; i += 1) {
                now = secs();
                stars[i].x -= stars[i].depth * starspeed * (now - stars[i].prev);
                stars[i].prev = now;

                while (stars[i].x < 0) {
                    stars[i].x += canvas.width;
                }

                size = 3 * stars[i].depth;
                ctx.fillStyle = 'white';
                ctx.fillRect(stars[i].x - size / 2, stars[i].y - size / 2, size, size);
            }

            window.setTimeout(render, 1000 / 30);
        };
        render();
    };
}());
