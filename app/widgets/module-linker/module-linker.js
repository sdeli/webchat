const fs = require('fs');

module.exports = moduleLinker;

function moduleLinker(modulesPath, nodeModulesPath) {
    let modulesFoldersName = modulesPath.match(/[^/]*$/)[0];
    var modulesSymlinkPath = `${nodeModulesPath}/${modulesFoldersName}`;
    
    try {
        fs.mkdirSync(nodeModulesPath)
    } catch (err) {
        if (err.code !== "EEXIST") {
            console.log(err);
        }
    }
    
    try {
        fs.symlinkSync(modulesPath, modulesSymlinkPath);
    } catch (err) {
        if (err.code !== "EEXIST") {
            console.log(err);
            return true
        }
    }
}