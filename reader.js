const fs = require('fs');
const path = require('path');

module.exports = (fileName, cb) => {
  const filePath = path.join(__dirname, `./src/${fileName}`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    // collect variable names for command prompt
    const re = new RegExp('\\[\\[(\\w+)\\]\\]', 'gi');
    const matches = [];

    let nextMatch;
    do {
      nextMatch = re.exec(data);
      if (nextMatch) {
        matches.push(nextMatch);
      }
    } while (nextMatch !== null);
    console.log(`\n${matches.length} ${matches.length === 1 ? 'match' : 'matches'} found!\n`);

    const groups = matches.map(match => match[1]);

    // remove duplicates from array
    return cb(Array.from(new Set(groups)));
  });
};
