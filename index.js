const emailParser = require('./parser');
const readline = require('readline');
const colors = require('colors');

if (process.argv.length !== 3) {
  console.error('Please provide an email to parse.');
  process.exit(1);
}

const emailMap = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

function askProp() {
  rl.question('Variable name: '.blue, mapProp => askValue(mapProp.trim()));
}

function askValue(mapProp) {
  rl.question('Value: '.green, mapValue => {
    emailMap[mapProp] = mapValue.trim();
    askDone();
  });
}

function askDone() {
  rl.question('Done? (y): '.grey, answer => {
    if (!answer || answer.trim().toLowerCase() === 'y') {
      console.log(emailMap);
      process.exit(0);
    } else {
      askProp();
    }
  });
}

function start() {
  console.log(
    [
      '---------------------------------------',
      'email-parser:',
      'please enter a series of variable names',
      'with their associated values',
      '---------------------------------------'
    ].join('\n').grey
  );
  askProp();
}

rl.on('line', cmd => {
  exec(cmd.trim());
}).on('close', () => {
  console.log('goodbye!'.green);
  process.exit(0);
});

process.on('uncaughtException', e => {
  console.log(e.stack.red);
  rl.prompt();
});

start();
