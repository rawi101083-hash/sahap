const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

c = c.replace(
    'value="\\${i.partnerLaundryName || ''}\\${"}', 
    'value="\\${i.partnerLaundryName === \\\'.\\\' ? \\\'\\\' : (i.partnerLaundryName || \\\'\\\')}\\${"}'
);

c = c.replace(
    '<input type="text" id="partner-name-" value="" list="saved-laundries"',
    '<input type="text" id="partner-name-" value="" placeholder="ÇÓã ÇáãÛÓáÉ" list="saved-laundries"'
);

c = c.replace(
    '<input type="number" id="partner-cost-" value="" style="width',
    '<input type="number" id="partner-cost-" value="" placeholder="ÇáãÈáÛ" style="width'
);

c = c.replace(
    '<input type="text" id="partner-hood-" value="" list="saved-neighborhoods"',
    '<input type="text" id="partner-hood-" value="" placeholder="ÇáÍí" list="saved-neighborhoods"'
);

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', c);
console.log('Done');
