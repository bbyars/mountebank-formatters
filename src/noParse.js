import fs from 'fs-extra';

function load(options) {
    const json = JSON.parse(fs.readFileSync(options.configfile, 'utf8')),
        imposters = json.imposters || [json]; // [json] Assume they left off the outer imposters array

    return {imposters};
}

function save(options, imposters) {
    fs.writeFileSync(options.savefile, JSON.stringify(imposters, null, 2));
}

const noParse = {
    load,
    save
};

export default noParse;
