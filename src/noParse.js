import { readFileSync, writeFileSync } from 'node:fs';

function load (options) {
    const json = JSON.parse(readFileSync(options.configfile, 'utf8')),
        imposters = json.imposters || [json]; // [json] Assume they left off the outer imposters array

    return { imposters };
}

function save (options, imposters) {
    writeFileSync(options.savefile, JSON.stringify(imposters, null, 2));
}

const noParse = {
    load,
    save
};

export default noParse;
