'use strict';
const fs = require('fs');
const ejs = require('ejs');

const config = require('config');

const VIEWS_FOLDER__PATH = config.pathes.views.self;

function writeOrAppendToFile(filePath, content) {
    let doesFileExist = fs.existsSync(filePath);

    return new Promise((resolve, reject) => {
        if (doesFileExist) {
            fs.appendFile(filePath, content, (err) => {
                if (err) reject(err);
                resolve();
            });
        } else {
            fs.writeFile(filePath, content, (err) => {
                if (err) reject(err);
                resolve();
            });
        }
    });
}

function render(res, templatePath, extendedOpts) {
    templatePath = `${VIEWS_FOLDER__PATH}${templatePath}`;

    ejs.renderFile(templatePath, extendedOpts, (err, html) => {
        if (err) throw err;
    
        res.write(html);
        res.end();
    });
}

function trimmPath(path){
    if (path !== '' && path !== '/') {
        var trimmedPath = path.replace(/^\/+|\/+$/g, '');
        return trimmedPath;
    } else if (path === ''){
        return '/';
    } else if(path === '/'){
        return path;
    }
}

function getCurrFormatedDate() {
    let date = new Date();

    let fullYear = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    var timestamp = `${fullYear}-${month}-${day}`;
    return timestamp;
}

module.exports = {
    writeOrAppendToFile,
    render,
    trimmPath,
    getCurrFormatedDate
}