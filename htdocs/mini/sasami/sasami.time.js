(function () {
    'use strict';
    var τ = Math.PI * 2;
    var cv, ctx;
    var hand;
    var radius = 200;

    function clear(cv) {
        // when you resize a canvas, it's cleared
        // this is the """""""""idiomatic"""""""""] way to clear a canvas in JS
        // I know what you're thinking. Yes, it's terrible.

        cv.width = cv.width;
    }

    // No longer needed, of course, but let's keep it anyway.
    function line(ctx, length) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -length);
        ctx.stroke();
    }

    function drawHand(ctx, length) {
        layer(ctx, function () {
            ctx.rotate(-τ / 2);
            ctx.scale(length / hand.width, length / hand.width);
            ctx.drawImage(hand, 0, -hand.height / 2);
        });
    }

    function layer(ctx, callback) {
        ctx.save();
        callback();
        ctx.restore();
    }

    window.onload = function () {
        var sasami = new Image();
        sasami.src = 'sasami.jpg';

        hand = new Image();
        hand.src = 'hand.png';

        cv = document.createElement('canvas');
        cv.width = 1280;
        cv.height = 720;
        document.body.appendChild(cv);

        ctx = cv.getContext('2d');

        window.requestAnimationFrame(function render() {
            var time = (new Date).getTime() / 1000;

            var seconds = time % 60,
                minutes = (time % 3600) / 60,
                hours = (time % 86400) / 3600;

            //clear(cv);
            ctx.globalAlpha = 1/128;
            ctx.drawImage(sasami, 0, 0);
            ctx.globalAlpha = 1;
            //ctx.fillStyle = 'rgba(255, 255, 255, 0.125)';
            //ctx.fillRect(0, 0, cv.width, cv.height);

            layer(ctx, function () {
                ctx.translate(640, 245);

                layer(ctx, function () {
                    ctx.rotate((seconds / 60) * τ);
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    drawHand(ctx, radius);
                });

                layer(ctx, function () {
                    ctx.rotate((minutes / 60) * τ);
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    drawHand(ctx, radius * 2/3);
                });

                layer(ctx, function () {
                    ctx.rotate((hours / 24) * τ);
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 3;
                    drawHand(ctx, radius * 1/2);
                });
            });

            window.requestAnimationFrame(render);
        });
    };
}());
