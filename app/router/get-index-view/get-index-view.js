'use strict';
const config = require('config');
const {render} = require('widgets/webchat-utils');

const INDEX_VIEW__PATH = config.pathes.views.index,
    INDEX_VIEW__ID = config.templateConf.index.id,
    INDEX_VIEW__TITLE = config.templateConf.index.title;

module.exports = getIndexView;

function getIndexView(res) {
    res.writeHead(200, 'OK', {contentType : 'text/html'});
    
    render(res, INDEX_VIEW__PATH, {
        pageId : INDEX_VIEW__ID,
        pageTitle : INDEX_VIEW__TITLE
    });
}