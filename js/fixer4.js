const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const regexToReplace = /\/\/ 📅 GLOBAL DATE FILTER: Strictly isolate Live Shift from Archived data[\s\S]*?invoices = invoices\.filter\(inv => \{[\s\S]*?if \(!inv\) return false;[\s\S]*?\/\/ If we are looking at the LIVE shift, completely hide closed\/archived invoices[\s\S]*?if \(isLiveShift && inv\.isZReported\) return false;[\s\S]*?\/\/ Normalize dates to KSA Local YYYY-MM-DD for comparison ensuring 100% strict match[\s\S]*?const invDate = getLocalYMD\(inv\.timestamp \|\| inv\.date\);[\s\S]*?return invDate === \(this\.currentViewDate \|\| todayYMD\);[\s\S]*?\}\);/;

const replacement = `// 📅 GLOBAL DATE FILTER: Strictly isolate Live Shift from Archived data
        invoices = invoices.filter(inv => {
            if (!inv) return false;

            // If we are looking at the LIVE shift, completely hide closed/archived invoices
            if (isLiveShift && inv.isZReported) return false;

            const isUnpaid = inv.paymentStatus === 'unpaid';

            // Normalize dates to KSA Local YYYY-MM-DD for comparison ensuring 100% strict match
            const invDate = getLocalYMD(inv.timestamp || inv.date);
            
            // EXCEPTION: Unpaid invoices MUST ALWAYS show in Live Shift regardless of their creation date
            if (isLiveShift && isUnpaid && !inv.isCancelled) {
                return true;
            }

            return invDate === (this.currentViewDate || todayYMD);
        });`;

const regexToReplaceGhost = /\/\/ Cleanup corrupted ghosts permanently from DB[\s\S]*?if \(validInvoices\.length !== \(Array\.isArray\(invoices\) \? invoices\.length : Object\.keys\(invoices\)\.length\)\) \{[\s\S]*?await localforage\.setItem\('invoices', validInvoices\);[\s\S]*?\}/;

const replacementGhost = `// REMOVED Ghost cleanup that was destroying historical data by overwriting the DB with filtered view data`;

if (regexToReplace.test(content) && regexToReplaceGhost.test(content)) {
    content = content.replace(regexToReplace, replacement);
    content = content.replace(regexToReplaceGhost, replacementGhost);
    fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
    console.log("HISTORY RENDERER AND GHOST OBLITERATOR FIXED SUCCESSFULLY");
} else {
    console.log("HISTORY REGEX FAILED");
    if (!regexToReplace.test(content)) console.log("Failed on regex 1");
    if (!regexToReplaceGhost.test(content)) console.log("Failed on regex 2");
}
