'use strict';

let depInfo = {};

exports.setDepInfo = (origin, deps, version, type = 'native') => {
    origin[type + 'Deps'] = deps;
    origin['version'] = version;
};

exports.getRoot = () => {
    return depInfo;
};

exports.isNativeModule = (name) => {
    var nativeModules = [
        'assert',
        'buffer',
        'child_process',
        'cluster',
        'console',
        'crypto',
        'dgram',
        'dns',
        'domain',
        'events',
        'fs',
        'http',
        'https',
        'module',
        'net',
        'os',
        'path',
        'punycode',
        'querystring',
        'readline',
        'repl',
        'stream',
        'stringdecoder',
        'timers',
        'tls',
        'tty',
        'url',
        'util',
        'v8',
        'vm',
        'zlib'
    ];

    var name = `${name}`;
    if (nativeModules.indexOf(name) !== -1) {
        return true;
    }
    return false;
};

exports.unique = (array)=> {
    var n = [];
    for (var i = 0; i < array.length; i++) {
        if (n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
}