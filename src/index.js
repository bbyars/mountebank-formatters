'use strict';

function formatterFor (options) {
    if (options.noParse) {
        return './noParse';
    }
    else {
        return './default';
    }
}

function load (options) {
    return require(formatterFor(options)).load(options);
}

function save (options, imposters) {
    return require(formatterFor(options)).save(options, imposters);
}

module.exports = {
    load,
    save
};
