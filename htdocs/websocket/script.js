(function () {
    'use strict';
    window.onload = function () {
        var sendbtn, input, connectbtn, state, socket;

        sendbtn = document.getElementById('sendbtn');
        input = document.getElementById('input');
        connectbtn = document.getElementById('connectbtn');
        state = document.getElementById('state');

        if (window.hasOwnProperty('WebSocket')) {
            state.innerHTML = 'State: WebSocket support detected, not connected.';
            connectbtn.disabled = false;
            connectbtn.onclick = function onclick() {
                socket = new window.WebSocket('ws://ws.websocket.us:8080/');
                socket.onopen = function () {
                    state.innerHTML = 'State: Connected.';
                    sendbtn.disabled = false;
                };
                socket.onmessage = function (event) {
                    alert('Received data: ' + event.data);
                };
                socket.onerror = function () {
                    alert('Error!');
                };
                socket.onclose = function () {
                    state.innerHTML = 'State: Disconnected.';
                    sendbtn.disabled = true;
                    connectbtn.innerHTML = 'Connect';
                    connectbtn.onclick = onclick;
                };

                connectbtn.onclick = function () {
                    socket.close();
                    connectbtn.innerHTML = 'Connect';
                    connectbtn.onclick = onclick;
                };
                connectbtn.innerHTML = 'Disconnect';

                sendbtn.onclick = function () {
                    socket.send(input.value);
                };
            };
        } else {
            state.innerHTML = 'State: Your browser doesn\'t support WebSocket, sorry.';
        }
    };
}());
