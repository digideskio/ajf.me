(function () {
    'use strict';
    var vectorToString, prefixes, setPrefixes, texFile, texTile, textures, randomTexture, addFace, addCube, makeWorld, makeViewport, requestFrame, numcubes = 0, numfaces = 0;

    Date.prototype.seconds = function () {
        return this.getTime() / 1000;
    };
    Math.rand = function (max) {
        return this.floor(this.random() * max);
    };

    vectorToString = function (vector, suffix, seperator) {
        seperator = seperator || ', ';
        return vector.join(suffix + seperator) + suffix;
    };

    prefixes = ['Moz', 'O', 'ms', 'webkit'];
    setPrefixes = function (thing, property, value) {
        var i;

        thing[property] = value;

        for (i = 0; i < prefixes.length; i += 1) {
            thing[prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1)] = value;
        }
    };

    texFile = 'terrain.png';
    texTile = 16;
    textures = [
        [1, 0],   // Stone
        [2, 0],   // Dirt
        [4, 0],   // Wood
        [7, 0],   // Brick
        [14, 0],  // Water
        [0, 1],   // Cobblestone
        [1, 1],   // Bedrock
        [2, 1],   // Sand
        [3, 1],   // Gravel
        [6, 1],   // Leaves
        [14, 1],  // Lava
        [0, 2],   // Gold Ore
        [1, 2],   // Iron Ore
        [2, 2],   // Coal Ore
        [4, 2],   // Mossy Cobblestone
        [5, 2],   // Obsidian
        [0, 3],   // Sponge
        [0, 3],   // Glass
        [0, 4],   // Red Wool
        [1, 4],   // Orange Wool
        [2, 4],   // Yellow Wool
        [3, 4],   // Light green Wool
        [4, 4],   // Green Wool
        [5, 4],   // Turquoise Wool
        [6, 4],   // Light blue Wool
        [7, 4],   // Blue Wool
        [8, 4],   // Dark Blue Wool
        [9, 4],   // Purple Wool
        [10, 4],  // Light purple Wool
        [11, 4],  // Fuchsia Wool
        [12, 4],  // Reddish Pink Wool
        [13, 4],  // Dark Gray Wool
        [14, 4],  // Gray Wool
        [15, 4]  // White Wool
    ];
    randomTexture = function () {
        var t, ran, tex;

        ran = Math.rand(41);

        if (ran === 34) {
            // TNT
            tex = [[9, 0], [10, 0], [8, 0], [8, 0], [8, 0], [8, 0]];
        } else if (ran === 35) {
            // Grass 
            tex = [[0, 0], [2, 0], [3, 0], [3, 0], [3, 0], [3, 0]];
        } else if (ran === 36) {
            // Wood 
            tex = [[5, 1], [5, 1], [4, 1], [4, 1], [4, 1], [4, 1]];
        } else if (ran === 37) {
            // Double step
            tex = [[6, 0], [6, 0], [5, 0], [5, 0], [5, 0], [5, 0]];
        } else if (ran === 38) {
            // Iron block
            tex = [[7, 1], [7, 3], [7, 2], [7, 2], [7, 2], [7, 2]];
        } else if (ran === 39) {
            // Gold block
            tex = [[8, 1], [8, 3], [8, 2], [8, 2], [8, 2], [8, 2]];
        } else if (ran === 40) {
            // Bookshelf
            tex = [[4, 0], [4, 0], [3, 2], [3, 2], [3, 2], [3, 2]];
        } else {
            t = textures[ran];
            tex = [t, t, t, t, t, t];
        }
        return tex;
    };

    addFace = function (cube, pos, rot, tex) {
        var transform, face;

        face = document.createElement('div');

        face.style.position = 'absolute';
        face.style.left = '0px';
        face.style.top = '0px';
        face.style.width = texTile + 'px';
        face.style.height = texTile + 'px';

        face.style.backgroundImage = 'url(' + texFile + ')';
        face.style.backgroundPosition = vectorToString([tex[0] * -texTile, tex[1] * -texTile], 'px', ' ');
        // crisp, nearest-neighbour rendering (Gecko & Webkit)
        face.style.imageRendering = '-moz-crisp-edges';
        face.style.imageRendering = '-webkit-optimize-contrast';

        transform = 'translate3d(' + vectorToString(pos, 'px') + ')';
        transform += ' rotateX(' + rot[0] + 'deg)';
        transform += ' rotateY(' + rot[1] + 'deg)';
        setPrefixes(face.style, 'transform', transform);

        numfaces += 1;
        cube.appendChild(face);
    };

    addCube = function (world, position, size, tex) {
        var cube;

        cube = document.createElement('div');

        cube.style.position = 'absolute';
        cube.style.left = '0px';
        cube.style.top = '0px';

        setPrefixes(cube.style, 'transform', 'translate3d(' + vectorToString(position, 'px') + ')');
        setPrefixes(cube.style, 'transformStyle', 'preserve-3d');
        setPrefixes(cube.style, 'backfaceVisibility', 'hidden');

        // Top
        addFace(cube, [0, -size / 2, -size / 2], [-90, 0], tex[0]);
        // Bottom
        addFace(cube, [0, size / 2, -size / 2], [90, 0], tex[1]);
        // ??? Sides
        addFace(cube, [0, 0, 0], [0, 0], tex[2]);
        addFace(cube, [0, 0, -size], [0, 180], tex[3]);
        addFace(cube, [-size / 2, 0, -size / 2], [0, 90], tex[4]);
        addFace(cube, [size / 2, 0, -size / 2], [0, -90], tex[5]);

        numcubes += 1;
        world.appendChild(cube);
    };

    makeViewport = function (world, size, bgcolor) {
        var viewport;

        viewport = document.createElement('div');
        viewport.style.position = 'relative';
        viewport.style.backgroundColor = bgcolor;
        viewport.style.width = size[0] + 'px';
        viewport.style.height = size[1] + 'px';
        viewport.style.overflow = 'hidden';
        viewport.appendChild(world);

        return viewport;
    };

    makeWorld = function (origin) {
        var world;

        world = document.createElement('div');
        world.style.position = 'relative';
        setPrefixes(world.style, 'transformStyle', 'preserve-3d');
        setPrefixes(world.style, 'transformOrigin', vectorToString(origin, 'px', ' '));

        return world;
    };

    requestFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function (callback) {
                  window.setTimeout(callback, 1000 / 60);
                };
    }());
    
    window.onload = function () {
        var i, size, world, viewport, overlay, lastchange, yrot, rotate;

        document.body.style.backgroundColor = '#333';

        size = 600;
        // Origin at (300, 300, 300)
        world = makeWorld([size / 2, size / 2, size / 2]);
        for (i = 0; i < 200; i += 1) {
            addCube(world, [Math.rand(size), Math.rand(size), Math.rand(size)], texTile, randomTexture());
        }

        // Create a viewport
        viewport = makeViewport(world, [size, size], 'rgb(126, 169, 255)');
        document.body.appendChild(viewport);

        // Text overlay
        overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.left = '2px';
        overlay.style.top = '2px';
        overlay.style.color = 'white';
        overlay.style.fontFamily = 'sans-serif';
        overlay.style.fontSize = '12px';
        viewport.appendChild(overlay);

        lastchange = new Date().seconds();
        yrot = 0;

        rotate = function () {
            var delta, xrot, html;

            requestFrame(rotate);
            delta = new Date().seconds() - lastchange;
            // Speed/rotation change is 30 degrees/second
            yrot = (yrot + delta * 30) % 360;
            // Based on y rotation, uses sine wave to bob back and forth
            xrot = Math.sin(yrot / 180 * Math.PI) * 30;

            setPrefixes(world.style, 'transform', 'rotateY(' + yrot + 'deg) rotateX(' + xrot + 'deg)');

            html = 'Block textures from Minecraft Classic, &copy; 2009-2012 Markus Persson<br>';
            html += xrot.toFixed(2) + '°, ' + yrot.toFixed(2) + '°, 0°<br>';
            html += numfaces + ' faces';

            overlay.innerHTML = html;

            lastchange = new Date().seconds();
            /*setTimeout(rotate, 1000 / 60);*/
        };
        rotate();
    };
}());
