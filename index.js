'use strict';

const process = require('process');
const fs = require('fs');

var {argv} = process;
argv[2] = argv[2] || 'index.js';
const mainPath = `${__dirname}/${argv[2]}`;

const scanner = require('./lib/scanner');
const utils = require('./lib/utils');

const moduleTypePath = 'node_modules';
const currentInfo = JSON.parse(fs.readFile(`${mainPath}/package.json`).toString());

function runModule(dirPath, origin) {

    var deps = scanner.scanModuleDeps(dirPath);
    var nativeDeps = scanner.scanNativeDeps(dirPath);

    if (!deps) {
        return;
    }

    utils.setDepInfo(origin, deps.packageDeps, deps.packageVersion, 'module');
    utils.setDepInfo(origin, nativeDeps, deps.packageVersion);

    for (let m in deps.packageDeps) {
        var path = scanner.findDepsRise(`${dirPath}/${moduleTypePath}/${m}`, m);
        runModule(path, origin['moduleDeps'][m]);
    }
}

runModule(mainPath, utils.getRoot());

switch (argv[3]) {
    case '_all':
        console.log(utils.getRoot());
        break;
    case '_native':
        console.log(require('./lib/total').allNativeMoules());
        break;  
}

