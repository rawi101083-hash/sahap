const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');
c = c.replace(/const thDate = lang === 'en' \? 'Date' : ' «—ÌŒ «·›« Ê—…';/, 'const thDateL2 = lang === \'en\' ? \'Date\' : \' «—ÌŒ «·›« Ê—…\';');
c = c.replace(/\\\$\{thDate\}/, '\\\');
fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', c);
