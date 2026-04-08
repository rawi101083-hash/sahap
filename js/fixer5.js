const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const regexToReplace = /activeInvs\.forEach\(i => \{[\s\S]*?if \(i && i\.paymentStatus === 'unpaid' && !i\.isCancelled\) \{[\s\S]*?const amt = parseFloat\(i\.total \|\| i\.grandTotal \|\| 0\);[\s\S]*?const refundAmt = i\.isCancelled \? amt : parseFloat\(i\.refundAmount \|\| 0\);[\s\S]*?totalUncollected \+= \(amt - refundAmt\);[\s\S]*?\}[\s\S]*?\}\);/;

const replacement = `(Array.isArray(activeInvs) ? activeInvs : Object.values(activeInvs)).forEach(i => {
            if (i && i.paymentStatus === 'unpaid' && !i.isCancelled) {
                const amt = parseFloat(i.total || i.grandTotal || 0);
                const refundAmt = i.isCancelled ? amt : parseFloat(i.refundAmount || 0);
                totalUncollected += (amt - refundAmt);
            }
        });`;

if (regexToReplace.test(content)) {
    content = content.replace(regexToReplace, replacement);
    fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
    console.log("FIXED TYPEERROR FOREACH");
} else {
    console.log("REGEX FAILED FOR TYPEERROR");
}
