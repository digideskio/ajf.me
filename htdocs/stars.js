// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
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

            window.requestAnimationFrame(render, canvas);
        };
        render();
    };
}());
