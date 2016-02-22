'use strict';

var utils = require('./utils');

exports.allNativeMoules = ()=> {
    var root = utils.getRoot();
    var queue = [];

    function total(m) {
        queue = queue.concat(m['nativeDeps']);
        for (let dm in m['moduleDeps']) {
            total(m['moduleDeps'][dm]);
        }
    }

    total(root);
    return utils.unique(queue);
};