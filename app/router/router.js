'use strict';
const url = require('url');
const config = require('config');
const path = require('path');
const fs = require('fs');

const getIndexView = require('./get-index-view/get-index-view.js');
const getDoclerWebchatView = require('./get-dolcer-webchat-view/get-docler-webchat-view.js');
const getOwnWebchatView = require('./get-own-webchat-view/get-own-webchat-view.js');
const get404View = require('./get-404-view/get-404-view.js');
const get501View = require('./get-501-view/get-501-view.js');

const errorHandler = require('widgets/error-handler');

const GET_DOCLER_WEBCHAT_VIEW__EP = config.restEndPoints.doclerWebchatView,
    GET_OWN_WEBCHAT_VIEW__EP = config.restEndPoints.ownWebchatView,
    GET_INDEX_VIEW__EP = config.restEndPoints.indexView,
    ERR_CODE_404__NUM = config.restEndPoints.fourOFourView,
    ERR_CODE_501__NUM = config.restEndPoints.fiveOOneView,
    PUBLIC_FOLDER__PATH = config.pathes.public,
    mimeTypes = config.mimeTypes;

module.exports = ((req, res) => {
    const REQUESTED_EP = url.parse(req.url, true).path
    
    try {
        router(req, res);
    } catch (err) {
        errorHandler(err, req, res);
    }

    function router(req, res) {
        let requestsAFile = path.extname(REQUESTED_EP).length > 0;
        if (requestsAFile) {
            serveFile(req, res)
            return;
        }

        let wasRouted = false;

        let isGetRequest = req.method === 'GET';
        if (isGetRequest) {
            wasRouted = getRouter(res);
        }

        if (!wasRouted) fourOfourRedirect(res);
    }

    function getRouter(res) {
        let requestsHomeWebchatView = REQUESTED_EP === GET_INDEX_VIEW__EP;
        if (requestsHomeWebchatView) {
            getIndexView(res);
            return true;
        }

        let requestsDoclerWebchatView = REQUESTED_EP === GET_DOCLER_WEBCHAT_VIEW__EP;
        if (requestsDoclerWebchatView) {
            getDoclerWebchatView(res);
            return true;
        }

        let requestsOwnWebchatView = REQUESTED_EP === GET_OWN_WEBCHAT_VIEW__EP;
        if (requestsOwnWebchatView) {
            getOwnWebchatView(res);
            return true;
        }

        let requests501View = REQUESTED_EP === ERR_CODE_501__NUM;
        if (requests501View) {
            get501View(res);
            return true;
        }

        let requests404View = REQUESTED_EP === ERR_CODE_404__NUM;
        if (requests404View) {
            get404View(res);
            return true;
        }

        return false;
    }

    function serveFile(req, res) {
        let extname = String(path.extname(REQUESTED_EP)).toLowerCase();
        let contentType = mimeTypes[extname] || 'application/octet-stream';
        let fileName = `${PUBLIC_FOLDER__PATH}${REQUESTED_EP}`;

        fs.readFile(fileName, function(err, content) {
            if (err) {
                if(err.code == 'ENOENT') {
                    get404View(res);
                } else {
                    errorHandler(err, req, res);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }

    function fourOfourRedirect() {
        res.writeHead(307, {'Location': `http://${req.headers['host']}${ERR_CODE_404__NUM}`});
        res.end();
    }
});