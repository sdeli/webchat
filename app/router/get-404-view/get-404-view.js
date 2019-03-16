'use strict';
const config = require('config');
const {render} = require('widgets/webchat-utils');

const FOUR_O_FOUR__PATH = config.pathes.views.error,
    FOUR_O_FOUR__ID = config.templateConf.fourOfour.id,
    FOUR_O_FOUR__TITLE = config.templateConf.fourOfour.title,
    FOUR_O_FOUR__ERR_FLASH = config.flashMessages.fourOfourErr;

module.exports = get404View;

function get404View(res) {
    res.writeHead(404, 'OK', {contentType : 'text/html'});
    
    render(res, FOUR_O_FOUR__PATH, {
        pageId : FOUR_O_FOUR__ID,
        pageTitle : FOUR_O_FOUR__TITLE,
        errMsg : FOUR_O_FOUR__ERR_FLASH
    });
}