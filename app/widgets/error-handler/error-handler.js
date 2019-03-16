'use strict';
const config = require('config');

const {writeOrAppendToFile, getCurrFormatedDate} = require('widgets/webchat-utils');

const ERR_LOG_FILE__PATH = config.pathes.logs.error,
    FIVE_O_ONE__EP = config.restEndPoints.fiveOOneView,
    NODE_ENV = process.env.NODE_ENV;

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    let notErrWith404View = !Boolean(err.fourOfourErr);
    
    if (NODE_ENV === 'development' && req && res && notErrWith404View) {
        console.log(err.name);
        console.log(err.stack);
        logErr(req, err);
        sendErrInJson(res);
    } else if (NODE_ENV === 'development' && req  && !res && notErrWith404View) {
        console.log(err.stack);
    } else if (NODE_ENV === 'production' && req) {
        console.log(err.stack);
        logErr(req, err);
    } else {
        logErr(req, err);
        fiveOOneRedirect(req)
    }
}

function sendErrInJson(res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
}

function logErr(req, err) {
    let errText = getErrorText(req, err);
    let errorLogFilePath = `${ERR_LOG_FILE__PATH}/${getCurrFormatedDate()}`;
    
    writeOrAppendToFile(errorLogFilePath, errText);
}

function getErrorText(req, err) {
    let currHeaders = JSON.stringify(req.headers, null, 2);
    let currCookies = JSON.stringify(req.cookies, null, 2);
    let errStackTrace = err.stack;
    let errMessage = err.message;

    let errorLogMsg = `\n\n//////////////// NEW ERROR ////////////////`
    + `\nERROR AT: ${getCurrFormatedDate()}`
    + '\n\n================= ERR MESSAGE =================\n'
    + errMessage
    + '\n\n================= STACK TRACE =================\n'
    + errStackTrace
    + '\n\n================= HEADERS =================\n'
    + currHeaders
    + '\n\n================= REQ BODY =================\n'
    + currCookies
    + '\n\n================= COOKIES =================\n';

    return errorLogMsg;
}

function fiveOOneRedirect(req) {
    res.writeHead(307, {'Location': `http://${req.headers['host']}${FIVE_O_ONE__EP}`});
    res.end();
}