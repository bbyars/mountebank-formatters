'use strict';

/**
 The original implementation of --configfile and mb save. It's separated from the
 core mountebank code base, in part, to allow mountebank to update EJS (there were
 breaking changes that would have introduced backwards compatibility problems if
 mountebank accepted them), and in part, to show the pattern for extensibility.
 */

function makeStringify(rootFile) {
    // The filename parameter is deprecated (mountebank used to force users to pass
    // the literal variable name, an awful hack whose intent is long forgotten)
    // This maintains that signature for backwards compatibility
    function stringify(filename, includeFile, data) {
        if (!includeFile) {
            includeFile = filename;
        }
        const fs = require('fs-extra'),
            path = require('path'),
            ejs = require('ejs'),
            resolvedPath = path.join(path.dirname(rootFile), includeFile),
            contents = fs.readFileSync(resolvedPath, 'utf8'),
            rendered = ejs.render(contents, {
                data: data,
                filename: rootFile,
                stringify: stringify,
                inject: stringify // backwards compatibility
            }),
            jsonString = JSON.stringify(rendered.trim());

        // get rid of the surrounding quotes because it makes the templates more natural to quote them there
        return jsonString.substring(1, jsonString.length - 1);
    }

    return stringify;
}

function load(options) {
    const fs = require('fs-extra'),
        ejs = require('ejs'),
        configContents = fs.readFileSync(options.configfile, 'utf8'),
        renderedContents = options.noParse ? configContents : ejs.render(configContents, {
            filename: options.configfile,
            stringify: makeStringify(options.configfile),
            inject: makeStringify(options.configfile) // backwards compatibility, was originally called inject
        });

    try {
        const json = JSON.parse(renderedContents),
            imposters = json.imposters || [json]; // [json] Assume they left off the outer imposters array

        return {imposters};
    } catch (e) {
        console.error('Unable to parse configfile as JSON. Full contents after EJS rendering below:');
        console.error(renderedContents);
        throw e;
    }
}

function save(options, imposters) {
    const fs = require('fs-extra');
    fs.writeFileSync(options.savefile, JSON.stringify(imposters, null, 2));
}

const defaultParse = {
    load,
    save
};

export default defaultParse;

