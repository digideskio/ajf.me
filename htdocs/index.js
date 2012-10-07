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

    function doPost(url, items, callback) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = callback;
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(postEncode(items));
    }

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
        doPost('?p=list', {
            password: password
        }, function () {
            if (this.readyState === 4) {
                hideSpinner();
                populate(JSON.parse(this.responseText));
            }
        });
        
        clearItems();
        showSpinner();
    }
    
    function changeState(name, state) {
        doPost('?p=change_state', {
            name: name,
            state: state,
            password: password
        }, function () {
            if (this.readyState === 4) {
                var data = JSON.parse(this.responseText);
                hideSpinner();
                clearItems();
                populate(data.result);
                if (data.num_changed === 0) {
                    alert('No todo items found with that name!');
                }
            }
        });
        
        showSpinner();
    }
    
    function addNew(name) {
        doPost('?p=add_item', {
            name: name,
            password: password
        }, function () {
            if (this.readyState === 4) {
                var data = JSON.parse(this.responseText);
                hideSpinner();
                clearItems();
                populate(data.result);
            }
        });
        
        showSpinner();
    }
    
    function delItem(name) {
        doPost('?p=del_item', {
            name: name,
            password: password
        }, function () {
            if (this.readyState === 4) {
                var data = JSON.parse(this.responseText);
                hideSpinner();
                clearItems();
                populate(data.result);
                if (data.num_changed === 0) {
                    alert('No todo items found with that name!');
                }
            }
        });
        
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
        spinner.src = 'data:image/gif;base64,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';
        spinner.style.display = 'none';
        todo.appendChild(spinner);
        
        ul = document.createElement('ul');
        todo.appendChild(ul);
        
        document.getElementById('todo-launch').onclick = function () {
            password = prompt('Password');
            doPost('?p=check_password', {
                password: password
            }, function () {
                if (this.readyState === 4) {
                    var data = JSON.parse(this.responseText);
                    if (data === true) {
                        todo.style.display = 'block';
                        refresh();
                    } else {
                        alert('bad password');
                    }
                }
            });
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
