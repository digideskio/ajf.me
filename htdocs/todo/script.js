(function () {
    var ul, spinner;
    
    window.onload = function () {
        var h1 = document.createElement('h1');
        h1.innerHTML = 'Todo';
        document.body.appendChild(h1);
        
        spinner = document.createElement('img');
        spinner.src = 'spinner.gif';
        spinner.style.display = 'none';
        document.body.appendChild(spinner);
        
        ul = document.createElement('ul');
        document.body.appendChild(ul);
        
        refresh();
    };
    
    function postEncode(items) {
        var pairs = [];
        for (key in items) {
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
        xhr.open('GET', '?p=list', true);
        xhr.send(null);
        
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
            state: state
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
            name: name
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
            name: name
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
}());
