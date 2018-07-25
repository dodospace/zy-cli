var path = require('path');
var fs = require('fs');

module.epxorts =  function copyTemplate(from, to) {
  console.log('start'.red);
  var filePath = path.join(__dirname, 'templates', from);
  var fileStr = fs.readFileSync(filePath, 'utf-8');
  fs.writeFileSync(to, fileStr);
  console.log('ok'.red)
}