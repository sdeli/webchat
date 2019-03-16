'use strict';
const config = require('config');
const {render} = require('widgets/webchat-utils');

const OWN_VIEW__PATH = config.pathes.views.webchat,
    OWN_VIEW__ID = config.templateConf.ownWebChat.id,
    OWN_VIEW__TITLE = config.templateConf.ownWebChat.title;

module.exports = getWebchatView;

function getWebchatView(res) {
    res.writeHead(200, 'OK', {contentType : 'text/html'});
    
    render(res, OWN_VIEW__PATH, {
        pageId : OWN_VIEW__ID,
        pageTitle : OWN_VIEW__TITLE
    });
}