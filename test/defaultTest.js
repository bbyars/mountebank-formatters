'use strict';

const assert = require('assert'),
    fs = require('fs-extra'),
    formatter = require('../src/default'),
    filename = 'defaultTest.json';

describe('default', function () {
    afterEach(function () {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
        }
    });

    describe('#load', function () {
        it('should load file as is if no EJS directives', function () {
            const config = {
                imposters: [{
                    port: 3000,
                    protocol: 'test',
                    name: 'name'
                }]
            };
            fs.writeFileSync(filename, JSON.stringify(config));

            assert.deepStrictEqual(formatter.load({ configfile: filename }), config);
        });

        it('should add imposters array if it is missing', function () {
            const config = {
                port: 3000,
                protocol: 'test',
                name: 'name'
            };
            fs.writeFileSync(filename, JSON.stringify(config));

            assert.deepStrictEqual(formatter.load({ configfile: filename }), { imposters: [config] });
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
            assert.deepStrictEqual(formatter.load({ configfile: 'test/templates/nested.ejs' }), {
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
            assert.deepStrictEqual(formatter.load({ configfile: 'test/templates/stringify.ejs' }), {
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

            formatter.save({ savefile: filename }, config);

            assert.deepStrictEqual(formatter.load({ configfile: filename }), config);
        });
    });
});
