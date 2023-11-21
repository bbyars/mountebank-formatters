'use strict';

function load (options) {
    const fs = require('fs-extra'),
        json = JSON.parse(fs.readFileSync(options.configfile, 'utf8')),
        imposters = json.imposters || [json]; // [json] Assume they left off the outer imposters array

    return { imposters };
}

function save (options, imposters) {
    const fs = require('fs-extra');
    fs.writeFileSync(options.savefile, JSON.stringify(imposters, null, 2));
}

const noParse = {
    load,
    save
};

export default noParse;
