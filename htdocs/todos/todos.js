(function () {
    'use strict';
    var ul, spinner, password;

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
                var data = JSON.parse(xhr.responseText);
                sortItems(data.items);
                populate(data);
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
                sortItems(data.result.items);
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
                sortItems(data.result.items);
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
                sortItems(data.result.items);
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

    function cmp(a, b) {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    /* check if an item begins with a YYYY-MM-DD ISO 8601 date */
    function getDate(itemName) {
        if (/^\d\d\d\d-\d\d-\d\d/.test(itemName)) {
            return itemName.substr(0, 4 + 1 + 2 + 1 + 2);
        } else {
            return null;
        }
    }

    function isNull(value) {
        return value === null;
    }

    // sort items in descending order by date, with completed items bottom
    function sortItems(items) {
        items.sort(function (a, b) {
            var aDate = getDate(a.name);
            var bDate = getDate(b.name);
            return (cmp(a.state, b.state)
                || cmp(isNull(bDate), isNull(aDate))
                || ((!isNull(aDate) && !isNull(bDate)) ? cmp(bDate, aDate) : 0)
                || cmp(a.name, b.name));
        });
    }

    function populate(data) {
        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            
            var elem = document.createElement('li');
            if (item.state) {
                elem.className = 'done';
            }
            
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
            delbutton.className = 'delete';
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
        entrybox.placeholder = 'YYYY-MM-DD new item';
        entrybox.onkeypress = function (e) {
            if (e.which == 13) {
                addNew(entrybox.value);
            }
        };
        entryboxelem.appendChild(entrybox);
        ul.appendChild(entryboxelem);
    }

    function login(tryPassword) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var data = JSON.parse(xhr.responseText);
                if (data === true) {
                    localStorage.setItem('password', tryPassword);
                    password = tryPassword;
                    todo.style.display = 'block';
                    document.getElementById('todo-launch').style.display = 'none';
                    refresh();
                } else {
                    if (tryPassword === localStorage.getItem('password')) {
                        localStorage.removeItem('password');
                    }
                    alert('bad password');
                }
            }
        };
        xhr.open('POST', '?p=check_password', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
        xhr.send(postEncode({
            password: tryPassword
        }));
    }

    window.onload = function () {
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
        
        if (localStorage.getItem('password') !== null) {
            login(localStorage.getItem('password'));
        }
        document.getElementById('todo-launch').onclick = function () {
            login(prompt('Password'));
        };
    };
}());
