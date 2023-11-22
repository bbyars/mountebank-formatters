import defaultParse from './default';
import noParse from './noParse';

const formatterFor = options => (options.noParse ? noParse : defaultParse);

export const load = options => {
    return formatterFor(options).load(options);
};

export const save = (options, imposters) => {
    return formatterFor(options).save(options, imposters);
};
