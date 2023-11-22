import assert from 'assert';
import { unlinkSync, writeFileSync } from 'node:fs';
import formatter from '../src/noParse.js';

const filename = 'noParseTest.json';

describe('noParse', function () {
    afterEach(function () {
        unlinkSync(filename);
    });

    describe('#load', function () {
        it('should load file as is', function () {
            const config = {
                imposters: [{
                    port: 3000,
                    protocol: 'test',
                    name: '<% include template.ejs %>'
                }]
            };
            writeFileSync(filename, JSON.stringify(config));

            assert.deepStrictEqual(formatter.load({ configfile: filename }), config);
        });

        it('should add imposters array if it is missing', function () {
            const config = {
                port: 3000,
                protocol: 'test',
                name: '<% include template.ejs %>'
            };
            writeFileSync(filename, JSON.stringify(config));

            assert.deepStrictEqual(formatter.load({ configfile: filename }), { imposters: [config] });
        });
    });

    describe('#save', function () {
        it('should save the file as is', function () {
            const config = {
                imposters: [{
                    port: 3000,
                    protocol: 'test',
                    name: '<% include template.ejs %>'
                }]
            };

            formatter.save({ savefile: filename }, config);

            assert.deepStrictEqual(formatter.load({ configfile: filename }), config);
        });
    });
});
