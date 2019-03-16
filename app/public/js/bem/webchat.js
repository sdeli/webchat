/* 
    DESCRIPTION:

    Purpose: 
        -The purpose of this module is to provide an interface for the BEM block called ‘webchat’.
        (Main desccription of the 'webchat' BEM block is in /readme.txt).
        - Additionally to do certain functionalities automatically - which are important to the chat window to work properly- , on a way that their complexity is hidden from other programmers, who are using the module. 
        - The module is not intended to use with more of the same instance of ‘webchat’ or with any other chat instance.
    
    The Interface:
        - The interface provides functionality to:
            - enter message from a certain partner => addPartnerMessage,
            - get the information, the current user has entered into the chat window => onNewUserMessage

        - The interface is an object created by a factory function called 'WebChat', which is monkey attached to the window object if it doesnt clash with any other members of the window object
            - For the sake of the 'name clash checking' the callback -registered to the DOMContentLoaded event- returns, if there is any other member on the window object, which is called the same.
            - Moreover if it returns, then nothing runs from the script, even the 'document.querySelector' methods wont run, which is a tiny performance optimization.
            - This same callback function  - registered to the DOMContentLoaded event - provides a closure to encapsulate all information - needed for the object, which will serve as the interface to communicate with the webchat - and to leverage 'protected' members.

        - 'onNewUserMessage':
            - when it is called, it expects the ‘userMessageHandlerCb’ callback function as a paramter to be passed.
            - ‘userMessageHandlerCb’ function will be called every time the user has clicked the send button (and entered proper data). The message of the user and the user name will be passed into it.
            - Additionally it appends the users new message to the chat window.

        - ‘addPartnerMessage’
            - When it is called, it expects the partners username and message, which will be appended to the chat window.

        - Additional, hidden functionalties
            - deleting messages from the top of the window, if the newes message is out of the chats ‘feed’ element (so basically when it is not visible anymore, because the message is under an other element). => "popOldestMsgFromChatFeed"

        Dependencies: nothing;
        <ol>
                        <li>Which one is a chat applciation, communicating with a polite chatbot, provided by Docler Holding</li>
                    </ol>
                    <ol>
                        <li>Which one is communicating with different bot, provided by sandor</li>
                    </ol>
*/

'use strict';
document.addEventListener("DOMContentLoaded", function(event) {

    let isNameClash = window.WebChat !== undefined;
    if (isNameClash) return false;

    const webChatFeed = document.querySelector('.webchat__feed');
    const inputRow = document.querySelector('.webchat__input-row');
    const webChatSendBtn = document.querySelector('input[name="sendButton"]');
    const webChatMsgInput = document.querySelector('input[name="message"]');
    const webChatUserName = document.querySelector('input[name="userName"]');

    const WEBCHAT_USER_MSG__CLASS = 'webchat__feed__message webchat__feed__message--right';
    const WEBCHAT_PARTNER_MSG__CLASS = 'webchat__feed__message';
    // MIN_GUTTER === The least gutter which need to be between inputRow and webChatFeed
    const MIN_GUTTER = 10;

    window.WebChat = () => {
        let webChat = {
            onNewUserMessage,
            addPartnerMessage
        }

        return webChat;
    } 
    
    function onNewUserMessage(userMessageHandlerCb) {
        webChatSendBtn.addEventListener('click', () => {
            let {message, user} = getMessageData();

            let hasUserEnteredProperData = message.length > 0;
                hasUserEnteredProperData &= user.length > 0;
            if (hasUserEnteredProperData) {
                userMessageHandlerCb(message, user);
                addUsersMessage(message);
                deleteTextFromMessageInput()
            } else {
                return;
            }
        })
    }

    function getMessageData() {
        let message = webChatMsgInput.value;
        let user = webChatUserName.value;

        return {message, user}
    }

    function addUsersMessage(message) {
        let userMsgHtml = `<p class='${WEBCHAT_USER_MSG__CLASS}'>${message}</p>`
        webChatFeed.innerHTML += userMsgHtml;

        if (isNewMsgUnderInputRow()) {
            popOldestMsgFromChatFeed()
        }
    }
    
    function addPartnerMessage(message, partnerName) {
        let partnerMsgHtml = ''
            + `</p><p class="${WEBCHAT_PARTNER_MSG__CLASS}">`
                + `<span>${partnerName}: </span>${message}`
            + '</p>';

        webChatFeed.innerHTML += partnerMsgHtml;

        if (isNewMsgUnderInputRow()) {
            popOldestMsgFromChatFeed()
        }
    }

    function isNewMsgUnderInputRow() {
        let webChatFeedBottomPos = webChatFeed.offsetHeight + webChatFeed.offsetTop;
        let isNewMsgUnderInputRow = (webChatFeedBottomPos + MIN_GUTTER) > inputRow.offsetTop;

        return isNewMsgUnderInputRow;
    }

    function popOldestMsgFromChatFeed() {
        let oldestMessage = webChatFeed.children[0];
        webChatFeed.removeChild(oldestMessage);

        if (isNewMsgUnderInputRow()) {
            popOldestMsgFromChatFeed()
        }
    }

    function deleteTextFromMessageInput() {
        webChatMsgInput.value = '';
    }
});
