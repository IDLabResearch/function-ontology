
const fs = require('fs');
const path = require('path');
// const assert = require('assert');
// const factory = require('rdf-ext')
// const ParserN3 = require('@rdfjs/parser-n3')
// const SHACLValidator = require('rdf-validate-shacl');
// async function loadDataset (filePath) {
//     const stream = fs.createReadStream(filePath)
//     const parser = new ParserN3({ factory })
//     return factory.dataset().import(parser.import(stream))
//   }

describe('SHACL Validation tests', async function () {

    const dirTestResources = path.join('test', 'resources');
    const validFunctionDescriptions = fs.readdirSync(path.join(dirTestResources, 'valid')).filter(x => x.endsWith('.ttl'));
    const invalidFunctionDescriptions = fs.readdirSync(path.join(dirTestResources, 'invalid')).filter(x => x.endsWith('.ttl'));

    // const shapes = await loadDataset('shape.ttl');

    describe('Valid descriptions', async function () {
        // Iterate over VALID test resources
        validFunctionDescriptions.forEach( (f) => {
            it(`${f} should be valid`, async function() {
                // const shapes = await loadDataset('shape.ttl');
                const stophere = 0;
            })
        });

    });
    describe('Invalid descriptions', async function () {

         // Iterate over INVALID test resources
        invalidFunctionDescriptions.forEach( (f) => {
            console.log('f:', f);
        });
    });



});
