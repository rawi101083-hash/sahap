const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');
code = code.replace(/prices: \{ iron: ([\d\.]+), wash_iron: ([\d\.]+), wash: ([\d\.]+) \}/g, (m, i, wi, w) => `prices: { iron: ${i}, wash_iron: ${wi}, wash: ${w}, dry_clean: ${i}, steam: ${i} }`);
code = code.replace(/expressFee: \{ iron: ([\d\.]+), wash_iron: ([\d\.]+), wash: ([\d\.]+) \}/g, (m, i, wi, w) => `expressFee: { iron: ${i}, wash_iron: ${wi}, wash: ${w}, dry_clean: ${i}, steam: ${i} }`);
fs.writeFileSync('js/app.js', code, 'utf8');
