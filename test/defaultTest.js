import assert from 'assert';
import fs from 'fs-extra';
import formatter from '../src/default.js';

describe('default', function () {
    describe('#load', function () {
        it('should load file as is if no EJS directives', function () {
            const config = {
                imposters: [{
                    port: 3000,
                    protocol: 'test',
                    name: 'name'
                }]
            };
            fs.writeFileSync('defaultTest.json', JSON.stringify(config));

            assert.deepStrictEqual(formatter.load({ configfile: 'defaultTest.json' }), config);
            fs.unlinkSync('defaultTest.json');
        });

        it('should add imposters array if it is missing', function () {
            const config = {
                port: 3000,
                protocol: 'test',
                name: 'name'
            };
            fs.writeFileSync('defaultTest.json', JSON.stringify(config));

            assert.deepStrictEqual(formatter.load({ configfile: 'defaultTest.json' }), { imposters: [config] });
            fs.unlinkSync('defaultTest.json');
        });

        it('should interpret EJS code blocks', function () {
            assert.deepStrictEqual(formatter.load({ configfile: 'test/templates/basic.ejs' }), {
                imposters: [{
                    port: 3000,
                    protocol: 'test',
                    name: 'basic'
                }]
            });
        });

        it('should interpret EJS include blocks', function () {
            assert.deepStrictEqual(formatter.load({ configfile: 'test/templates/include.ejs' }), {
                imposters: [{
                    port: 3000,
                    protocol: 'test',
                    name: 'basic'
                }]
            });
        });

        it('should interpret nested EJS include blocks', function () {
            assert.deepStrictEqual(formatter.load({ configfile: 'test/templates/nested/nested.ejs' }), {
                imposters: [{
                    port: 3000,
                    protocol: 'http',
                    stubs: [{
                        responses: [{
                            is: {
                                body: 'nested body'
                            }
                        }]
                    }]
                }]
            });
        });

        it('should add stringify', function () {
            assert.deepStrictEqual(formatter.load({ configfile: 'test/templates/stringify/stringify.ejs' }), {
                imposters: [{
                    protocol: 'test',
                    port: 3000,
                    stubs: [{
                        is: {
                            field: '{\n  "key": "value"\n}'
                        }
                    }]
                }]
            });
        });

        it('should supported nested stringify', function () {
            assert.deepStrictEqual(formatter.load({ configfile: 'test/templates/complexStringify/imposters.ejs' }), {
                imposters: [{
                    protocol: 'http',
                    port: 4542,
                    stubs: [{
                        responses: [{
                            inject: '(request, state, logger) => {\n  return {\n    headers: {\n      \'Content-Type\': \'application/json\'\n    },\n    body: \'{\\n   \\"success\\": true\\n}\'\n  };\n}'
                        }]
                    }]
                }]
            });
        });
    });

    describe('#save', function () {
        it('should save the file as is', function () {
            const config = {
                imposters: [{
                    port: 3000,
                    protocol: 'test',
                    name: 'name'
                }]
            };

            formatter.save({ savefile: 'defaultTest.json' }, config);

            assert.deepStrictEqual(formatter.load({ configfile: 'defaultTest.json' }), config);
            fs.unlinkSync('defaultTest.json');
        });
    });
});
