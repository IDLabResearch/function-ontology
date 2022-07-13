const fs = require('fs');
const path = require('path');
const assert = require('assert');
const SHACLValidator = require("shacl-js");

/**
 * Validator class for SHACL.
 */
class ShaclValidator {
    /**
     * Validates SHACL data using shapes.
     * @param data {string} data in turtle
     * @param shapes {string} shapes in turtle
     * @returns {Promise<Object>} Returns a promise which resolves to a SHACL report.
     */
    static validate(data, shapes) {
        return new Promise((resolve, reject) => {
            new SHACLValidator().validate(
                data,
                "text/turtle",
                shapes,
                "text/turtle",
                (e, report) => {
                    e ? reject(e) : resolve(report);
                }
            );
        });
    }
}

describe('SHACL Validation tests', async function () {

    const dirTestResources = path.join('test', 'resources');
    const dirValidTestResourcs = path.join(dirTestResources, 'valid');
    const dirInvalidTestResources = path.join(dirTestResources, 'invalid');
    const validFunctionDescriptions = fs.readdirSync(dirValidTestResourcs).filter(x => x.endsWith('.ttl')).map( x => path.join(dirValidTestResourcs, x) );
    const invalidFunctionDescriptions = fs.readdirSync(path.join(dirTestResources, 'invalid')).filter(x => x.endsWith('.ttl')).map( x => path.join(dirInvalidTestResources, x) );

    // FnO SHACL shape
    const shapes = fs.readFileSync("./shape.ttl").toString();

    describe('Valid descriptions', async function () {
        // Iterate over VALID test resources
        validFunctionDescriptions.forEach( (f) => {
            it(`${f} should be valid`, async function() {

                const data = fs.readFileSync(f).toString();
                const report = await ShaclValidator.validate(data, shapes);
                assert(report.conforms())
            })
        });

    });

    describe('Invalid descriptions', async function () {
         // Iterate over INVALID test resources
        invalidFunctionDescriptions.forEach( (f) => {
            it(`${f} should not be valid`, async function() {

                const data = fs.readFileSync(f).toString();
                const report = await ShaclValidator.validate(data, shapes);
                assert(!report.conforms())
            })
        });
    });

});
