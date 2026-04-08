try {
  const fs = require('fs');
  const code = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');
  require('vm').createScript(code);
  console.log('NO SYNTAX ERROR!');
} catch (e) {
  console.log('SYNTAX ERROR CAUGHT:');
  console.log(e.stack);
}
