'use strict';
const config = require('config');
const {render} = require('widgets/webchat-utils');

const WEBCHAT_VIEW__PATH = config.pathes.views.webchat,
    WEBCHAT_VIEW__ID = config.templateConf.doclerWebChat.id,
    WEBCHAT_VIEW__TITLE = config.templateConf.doclerWebChat.title;

module.exports = getWebchatView;

function getWebchatView(res) {
    res.writeHead(200, 'OK', {contentType : 'text/html'});
    
    render(res, WEBCHAT_VIEW__PATH, {
        pageId : WEBCHAT_VIEW__ID,
        pageTitle : WEBCHAT_VIEW__TITLE
    });
}