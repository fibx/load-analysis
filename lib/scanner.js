'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const moduleTypePath = 'node_modules';

function dvCreator(dep) {
    var dv = {};
    for (var d in  dep) {
        dv[d] = {
            'beRequire': dep[d]
        };
    }
    return dv;
};

exports.scanModuleDeps = (dirPath)=> {
    if (!fs.exists(`${dirPath}/package.json`)) {
        return;
    }
    let packageInfo = JSON.parse(fs.readFile(`${dirPath}/package.json`).toString())
        , packageName = packageInfo.name
        , packageDeps = dvCreator(packageInfo.dependencies)
        , packageVersion = packageInfo.version;
    return {
        packageName,
        packageDeps,
        packageVersion
    };
};

exports.scanNativeDeps = (dirPath)=> {

    var nativeDeps = [];

    function search(dirPath) {
        var fsList = fs.readdir(dirPath);
        fsList.forEach(item=> {
            if (item.name === moduleTypePath || item.name === '.' || item.name === '..') {
                return;
            }
            if (item.isDirectory()) {
                search(`${dirPath}/${item.name}`);
            } else {
                var deps = analysis(`${dirPath}/${item.name}`);
                nativeDeps = nativeDeps.concat(deps);
            }
        });
    }

    function analysis(filePath) {
        var queue = [];
        if (path.extname(filePath) === '.js') {
            var code = fs.readFile(filePath);
            if (code) {
                code = code.toString();
            }
            var rs, re = /require\(\'(.*)\'\)/g;
            while (rs = re.exec(code)) {
                var name = rs[1].trim();
                if (utils.isNativeModule(name)) {
                    queue.push(name);
                }
            }
        }
        return queue;
    }

    search(dirPath);
    return utils.unique(nativeDeps);
};

exports.findDepsRise = (dirPath, moduleName)=> {
    while (!fs.exists(`${dirPath}/package.json`)) {
        var route = dirPath.split(moduleTypePath);
        route.pop();
        route.pop();
        dirPath = `${route.join(moduleTypePath)}/${moduleTypePath}/${moduleName}`;
    }
    return dirPath;
};