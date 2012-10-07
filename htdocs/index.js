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
    var secs, ul, spinner, password;

    secs = function () {
        return new Date().getTime() / 1000;
    };

    function postEncode(items) {
        var pairs = [];
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                var string = encodeURIComponent(key).replace(/%20/g, '+');
                string += '=';
                string += encodeURIComponent(items[key]).replace(/%20/g, '+');
                pairs.push(string);
            }
        }
        return pairs.join('&');
    }
    
    function clearItems() {
        ul.innerHTML = '';
    }
    
    function showSpinner() {
        spinner.style.display = 'block';
    }
    
    function hideSpinner() {
        spinner.style.display = 'none';
    }
    
    function refresh() {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                hideSpinner();
                populate(JSON.parse(xhr.responseText));
            }
        };
        xhr.open('POST', '?p=list', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.send(postEncode({
            password: password
        }));
        
        clearItems();
        showSpinner();
    }
    
    function changeState(name, state) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var data = JSON.parse(xhr.responseText);
                hideSpinner();
                clearItems();
                populate(data.result);
                if (data.num_changed === 0) {
                    alert('No todo items found with that name!');
                }
            }
        };
        xhr.open('POST', '?p=change_state', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.send(postEncode({
            name: name,
            state: state,
            password: password
        }));
        
        showSpinner();
    }
    
    function addNew(name) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var data = JSON.parse(xhr.responseText);
                hideSpinner();
                clearItems();
                populate(data.result);
            }
        };
        xhr.open('POST', '?p=add_item', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.send(postEncode({
            name: name,
            password: password
        }));
        
        showSpinner();
    }
    
    function delItem(name) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var data = JSON.parse(xhr.responseText);
                hideSpinner();
                clearItems();
                populate(data.result);
                if (data.num_changed === 0) {
                    alert('No todo items found with that name!');
                }
            }
        };
        xhr.open('POST', '?p=del_item', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.send(postEncode({
            name: name,
            password: password
        }));
        
        showSpinner();
    }
    
    function populate(data) {
        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            
            var elem = document.createElement('li');
            
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.state;
            checkbox.onchange = (function (item, checkbox) {
                return function () {
                    changeState(item.name, checkbox.checked);
                };
            }(item, checkbox));
            elem.appendChild(checkbox);
            
            var name = document.createTextNode(item.name);
            elem.appendChild(name);
            
            var delbutton = document.createElement('input');
            delbutton.type = 'submit';
            delbutton.value = 'x';
            delbutton.title = 'delete item';
            delbutton.onclick = (function (item) {
                return function () {
                    delItem(item.name);
                };
            }(item));
            elem.appendChild(delbutton);
            
            ul.appendChild(elem);
        }
        
        var entryboxelem = document.createElement('li');
        var entrybox = document.createElement('input');
        entrybox.type = 'text';
        entrybox.placeholder = 'new item';
        entrybox.onkeypress = function (e) {
            if (e.which == 13) {
                addNew(entrybox.value);
            }
        };
        entryboxelem.appendChild(entrybox);
        ul.appendChild(entryboxelem);
    }

    window.onload = function () {
        // todo
        
        var todo = document.getElementById('todo');
        
        var h1 = document.createElement('h1');
        h1.innerHTML = 'Todo';
        todo.appendChild(h1);
        
        spinner = document.createElement('img');
        spinner.src = 'spinner.gif';
        spinner.style.display = 'none';
        todo.appendChild(spinner);
        
        ul = document.createElement('ul');
        todo.appendChild(ul);
        
        document.getElementById('todo-launch').onclick = function () {
            var xhr = new XMLHttpRequest();
            
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var data = JSON.parse(xhr.responseText);
                    if (data === true) {
                        todo.style.display = 'block';
                        refresh();
                    } else {
                        alert('bad password');
                    }
                }
            };
            xhr.open('POST', '?p=check_password', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            password = prompt('Password');
            xhr.send(postEncode({
                password: password
            }));
        };
        
        var closebtn = document.createElement('input');
        closebtn.type = 'submit';
        closebtn.value = 'x';
        closebtn.title = 'close';
        closebtn.style.position = 'absolute';
        closebtn.style.right = closebtn.style.top = 0;
        closebtn.onclick = function () {
            todo.style.display = 'none';
        };
        todo.appendChild(closebtn);
        
        // stars
        var canvas, ctx, stars, star, i, render;

        canvas = document.getElementById('stars');

        ctx = canvas.getContext('2d');

        // 3 widths: 720 (HTML/CSS default), 920, 320
        if (window.innerWidth > 920) {
            canvas.width = 920;
            canvas.style.width = document.getElementById('wrapper').style.width = '920px';
        } else if (window.innerWidth < 720) {
            canvas.width = 320;
            canvas.style.width = document.getElementById('wrapper').style.width = '320px';        
        }

        document.getElementById('whoosh').onclick = function () {
            canvas.width /= 8;
            this.temp = this.onclick;
            this.onclick = this.onclick2;
            this.onclick2 = this.temp;
            delete this.temp;
            return false;
        };
        document.getElementById('whoosh').onclick2 = function () {
            canvas.width *= 8;
            this.temp = this.onclick;
            this.onclick = this.onclick2;
            this.onclick2 = this.temp;
            delete this.temp;
            return false;
        };

        stars = [];

        render = function render() {
            var starnum, starspeed, now, size;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            starnum = Math.floor(Math.sqrt(canvas.width * canvas.height) / 2);
            starspeed = 115;

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
