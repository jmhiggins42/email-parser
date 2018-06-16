const emailReader = require('./reader');
const emailParser = require('./parser');
const readline = require('readline');
require('colors');

if (process.argv.length !== 3) {
  console.error('Please provide an email to parse.');
  process.exit(1);
}

const emailMap = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askValue = propArr => {
  // take next property in arry, ask for its value, and repeat if necessary
  if (propArr.length) {
    const mapProp = propArr.shift();
    rl.question('Value of '.white + mapProp.green + ': '.white, mapValue => {
      emailMap[mapProp] = mapValue.trim();
      askValue(propArr);
    });
  }
  // write/parse the email after finishing the emailMap
  else {
    emailParser(process.argv[2], emailMap);
    console.log('Done!\n'.blue);
    process.exit(0);
  }
};

emailReader(process.argv[2], propArr => askValue(propArr));

rl.on('close', () => {
  console.log('goodbye!'.green);
  process.exit(0);
});

process.on('uncaughtException', e => {
  console.log(e.stack.red);
  process.exit(1);
});
