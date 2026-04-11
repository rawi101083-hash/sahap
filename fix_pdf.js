const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

// 1. Fix triggerInvoiceAction bug
c = c.replace(/this\.generateInvoicePDF\(\);/g, 'this.downloadDigitalPDF(null);');

// 2. Fix the customer undefined bug in downloadDigitalPDF
const oldCustNameRegex = /const _custName = \(\!data\.customer\.name[^)]+\) \? '' : data\.customer\.name;/g;
const newCustName = `const _customer = data.customer || {};
        const _custName = (!_customer.name || _customer.name === 'عميل غير محدد' || _customer.name === 'Unnamed Customer' || _customer.name.includes('Unnamed')) ? '' : _customer.name;`;
c = c.replace(oldCustNameRegex, newCustName);

// 3. Fix data.items to be safely iterable
c = c.replace(/data\.items\.forEach\(/g, '(data.items || []).forEach(');

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', c);
console.log('PDF fixes applied!');
