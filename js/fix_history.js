const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

content = content.replace(/localStorage\.getItem\('laundryHistory'\)/g, "lsGet('laundryHistory')");
content = content.replace(/localStorage\.setItem\('laundryHistory'/g, "lsSet('laundryHistory'");

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
console.log('Fixed laundryHistory');
