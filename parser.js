const fs = require('fs');
const path = require('path');
const htmlparser = require('htmlparser2');

module.exports = (fileName, mapObj, cb) => {
  const filePath = path.join(__dirname, `./src/${fileName}`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    let textStr = '';
    const textArr = [];

    // replace variables with associated value in emailMap
    // variables are denooted w/ '[[' and ']]'
    const re = new RegExp('\\[\\[(' + Object.keys(mapObj).join('|') + ')\\]\\]', 'gi');

    const htmlStr = data.replace(re, (match, group) => (mapObj[group] ? mapObj[group] : match));

    // sanitize html
    const emailParser = new htmlparser.Parser(
      {
        onopentag: (name, attr) => attr.href && textArr.push(attr.href),
        onopentagname: name => (name === 'a' || name === 'br') && textArr.push('\n'),
        ontext: text => text.trim() && text.trim() !== 'Register' && textArr.push(text.trim()),
        onclosetag: name => name === 'a' && textArr.push('\n')
      },
      { decodeEntities: true }
    );

    // write text file
    emailParser.write(htmlStr);
    emailParser.end();

    textStr = textArr.join(' ');

    return cb(textStr, htmlStr);
  });
};
