/* DESCRIPTION:
    Purpose: This module sets up the webchat functionality with a BEM Module called 'webchat' and with socket.io
    (Main description of the 'webchat' BEM block is in: /readme.txt, it's actual javascripts description is in: /app/public/js/webchat.js)

    How it works:
        - On DOMContentLoaded 'setUpWebchat' is monkey attached to the - window object if it doesn't clash with any members - , that it can be called from script tags.
        - It expects the server address for socket.io and sets up 'socket.io' for the passed server addr.
        - on 'message' from the server it appends the message to the chat window by: webChat.addPartnerMessage(message, user)
        - via webChat.onNewUserMessage it gets the new messages entered by the current user, then it is sent to the server by socket.emit

    Dependencies:
        - webchat BEM module
        - socket.io
*/

(function(){
    'use strict';

    document.addEventListener("DOMContentLoaded", function(event) {
        let isNameClash = window.setUpWebchat !== undefined;
        if (isNameClash) return false;

        window.setUpWebchat = setUpWebchat;
    });

    function setUpWebchat(serverAddr) {
        const webChat = WebChat();

        var socket = io(serverAddr);

        socket.on('connect', function () {
            socket.on('message', ({message, user}) => {
                webChat.addPartnerMessage(message, user);
            });

            webChat.onNewUserMessage((message, user) => {
                socket.emit('message', {message, user});
            });
        });
    }
}());