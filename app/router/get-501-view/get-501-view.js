'use strict';
const config = require('config');
const {render} = require('widgets/webchat-utils');

const FIVE_O_ONE__PATH = config.pathes.views.error,
    FIVE_O_ONE__ID = config.templateConf.fiveOOne.id,
    FIVE_O_ONE__TITLE = config.templateConf.fiveOOne.title,
    GENERAL__ERR_FLASH = config.flashMessages.serverSideErr;

module.exports = get501View;

function get501View(res) {
    res.writeHead(501, 'OK', {contentType : 'text/html'});
    
    render(res, FIVE_O_ONE__PATH, {
        pageId : FIVE_O_ONE__ID,
        pageTitle : FIVE_O_ONE__TITLE,
        errMsg : GENERAL__ERR_FLASH
    });
}