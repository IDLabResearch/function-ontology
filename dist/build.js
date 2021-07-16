const util = require('util');
const fs = require('fs/promises');
const exec = util.promisify(require('child_process').exec);

const $rdf = require('rdflib');
const Namespace = $rdf.Namespace;

const DC = Namespace("http://purl.org/dc/elements/1.1/");
const OWL = Namespace("http://www.w3.org/2002/07/owl#");
const RDF = Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const VANN = Namespace("http://purl.org/vocab/vann/");
const VOAF = Namespace("http://purl.org/vocommons/voaf#");

const map = [
  {
    ttlFile: "../fno.ttl",
    outputFolder: "./ontology",
    uri: "https://w3id.org/function/ontology#",
  }, {
    ttlFile: "../fnoi.ttl",
    outputFolder: "./vocabulary/implementation",
    uri: "https://w3id.org/function/vocabulary/implementation#",
  }, {
    ttlFile: "../fnom.ttl",
    outputFolder: "./vocabulary/mapping",
    uri: "https://w3id.org/function/vocabulary/mapping#",
  },
  {
    ttlFile: "../fnoc.ttl",
    outputFolder: "./vocabulary/composition",
    uri: "https://w3id.org/function/vocabulary/composition#",
  },
]

processMap(map);

async function processMap(map) {
  for (const elem of map) {
    const store = await getStore(elem.ttlFile);
    await runWidoco(elem.ttlFile, elem.outputFolder, store);
  }
}

async function runWidoco(ontFile, outFolder, store) {
  const preStuff = 'java -jar ../widoco-1.4.15-jar-with-dependencies.jar';
  const postStuff = '-getOntologyMetadata -oops -rewriteAll -htaccess -webVowl -analytics UA-87734787-2 -excludeIntroduction';
  const voc = store.any(null, RDF('type'), VOAF('Vocabulary'));
  const version = store.any(voc, OWL('versionInfo')).value;
  const uri = store.any(voc, VANN('preferredNamespaceUri')).value;
  const prefix = store.any(voc, VANN('preferredNamespacePrefix')).value;
  const commandVersion = `${preStuff} -ontFile ${ontFile} -outFolder ${outFolder}/${version} ${postStuff}`;
  const {stdout, stderr} = await exec(commandVersion);
  console.log(stdout);
  console.warn(stderr);
  const command = `${preStuff} -ontFile ${ontFile} -outFolder ${outFolder} ${postStuff}`;
  await exec(command);
  const appendData = `<p>The namespace is <b>${uri}</b>, the preferred prefix is <b>${prefix}</b></p>`;
  await fs.appendFile(`${outFolder}/${version}/sections/abstract-en.html`, appendData);
  await fs.appendFile(`${outFolder}/sections/abstract-en.html`, appendData);
  const descriptionPlaceholder = `This is a placeholder text for the description of your ontology. The description should include an explanation and a diagram explaining how the classes are related, examples of usage, etc.`;
  let description = await fs.readFile(`${outFolder}/sections/description-en.html`, 'utf8');
  description = description.replace(descriptionPlaceholder, "Further description and explanation of these classes and properties are given in the Function Ontology Specification at https://w3id.org/function/spec");
  await fs.writeFile(`${outFolder}/${version}/sections/description-en.html`, description);
  await fs.writeFile(`${outFolder}/sections/description-en.html`, description);
}

async function getStore(ontFile) {
  const store = $rdf.graph();
  const body = await fs.readFile(ontFile, 'utf8');
  $rdf.parse(body, store, "http://example.com/#", 'text/turtle');
  return store;
}
