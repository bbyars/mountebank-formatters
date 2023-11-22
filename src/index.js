import defaultParse from './default';
import noParse from './noParse';

const formatterFor = options => (options.noParse ? noParse : defaultParse);

/**
 * @typedef FormatterOptions
 * @property {boolean} noParse no parse or use default parser
 * @property {string} configfile config filename
 * @property {string} savefile save filename
 */

/**
 * Load the imposters from a file.
 * @param {FormatterOptions} options - formatter options.
 */
const load = options => {
    return formatterFor(options).load(options);
};

/**
 * Save the imposters to a file.
 * @param {FormatterOptions} options - formatter options.
 * @param {object} imposters - imposters to be saved.
 */
const save = (options, imposters) => {
    return formatterFor(options).save(options, imposters);
};

export default {
    load,
    save,
}
