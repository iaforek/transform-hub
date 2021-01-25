const { Given, When, Then, And } = require("cucumber");
const assert = require("assert").strict
const execSync = require('child_process').execSync;
const fs = require('fs');
const lineByLine = require('n-readlines');
const testPath = "../fromdisk-bdd/";

Given('input file containing names {string}', function (filename) {
  assert.equal(fs.existsSync(`${testPath}${filename}`), true);
});

When('scramjet server porcesses input file as a stream', function () {
  //TODO relative paths will work only when run from /scramjet-server/test/bdd directory consider using cwd or another solution
  // execSync(`cd ../../scramjet-server; npm i;`, { encoding: 'utf-8' })
  const output = execSync(`cd ${testPath}; npm i; node ../../scramjet-server/index --source names.txt`, { encoding: 'utf-8' });
  //console.log('Output was:\n', output);
});

Then('file {string} is generated', async function (filename) {
  assert.equal(fs.existsSync(`${testPath}${filename}`), true);
  //TODO const fsAccess = (...args) => util.promisify(fs.access)(...args)
});

Then('file {string} in each line contains {string} followed by name from file {string}', function (file1, greeting, file2) {
  const input = new lineByLine(`${testPath}${file2}`);
  const output = new lineByLine(`${testPath}${file1}`);

  let line1;
  let line2;

  while ((line1 = input.next()) && (line2 = output.next())) {
    assert.deepEqual(greeting + line1, '' + line2)
  }
});

