'use strict';

/**
 The original implementation of --configfile and mb save. It's separated from the
 core mountebank code base, in part, to allow mountebank to update EJS (there were
 breaking changes that would have introduced backwards compatibility problems if
 mountebank accepted them), and in part, to show the pattern for extensibility.
 */

// usage: stringify(includeFile)
// note: Trying to make this backwards compatible. However, the intent is to change
// the signature to just require `includeFile`.
function stringify (filename, includeFile, data) {
    const fs = require('fs-extra'),
        ejs = require('ejs'),
        resolvedPath = makePathInABackwardsCompatibleWay(filename, includeFile),
        contents = fs.readFileSync(resolvedPath, 'utf8'),
        rendered = ejs.render(contents, {
            data: data,
            filename: CONFIG_FILE_PATH,
            stringify: stringify,
            inject: stringify // backwards compatibility
        }),
        jsonString = JSON.stringify(rendered.trim());

    // get rid of the surrounding quotes because it makes the templates more natural to quote them there
    return jsonString.substring(1, jsonString.length - 1);
}

function makePathInABackwardsCompatibleWay (filename, includeFile) {
    var resolvedPath = null;
    if (!includeFile) {
        includeFile = filename;
    }
    const path = require('path');
    resolvedPath = path.join(path.dirname(CONFIG_FILE_PATH), includeFile);
    return resolvedPath;
}

var CONFIG_FILE_PATH = null;
function load (options) {
    CONFIG_FILE_PATH = options.configfile;
    const fs = require('fs-extra'),
        ejs = require('ejs'),
        configContents = fs.readFileSync(options.configfile, 'utf8'),
        renderedContents = options.noParse ? configContents : ejs.render(configContents, {
            filename: options.configfile,
            stringify: stringify,
            inject: stringify // backwards compatibility
        });

    try {
        const json = JSON.parse(renderedContents),
            imposters = json.imposters || [json]; // [json] Assume they left off the outer imposters array

        return { imposters };
    }
    catch (e) {
        console.error('Unable to parse configfile as JSON. Full contents after EJS rendering below:');
        console.error(renderedContents);
        throw e;
    }
}

function save (options, imposters) {
    const fs = require('fs-extra');
    fs.writeFileSync(options.savefile, JSON.stringify(imposters, null, 2));
}

module.exports = {
    load,
    save
};
