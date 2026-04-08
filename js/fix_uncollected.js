const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const regexToReplace = /let totalUncollected = 0;\s*\/\/\s*NEW TRACKER\s*let totalCollected = 0;\s*\/\/\s*Collected amounts\s*\/\/\s*1\.\s*Process Invoices\s*let cashTotal = 0, madaTotal = 0, visaTotal = 0, mastercardTotal = 0;\s*invoices\.forEach\(i => \{[\s\S]*?\/\/ Today's sales honors the Z-Report wipe \(matchesShift\) per user preference\s*if \(isInRange && matchesShift\) \{\s*salesToday \+= netAmt; \/\/ ✅ Total Sales ALWAYS includes everything \(Cash \+ Card \+ Pay Later\)\s*if \(isUnpaid\) \{\s*totalUncollected \+= netAmt; \/\/ ✅ Uncollected \(Pay Later\)\s*\} else \{\s*totalCollected \+= netAmt;   \/\/ ✅ Collected \(Paid\)\s*\}\s*\}/;

const replacement = `let totalUncollected = 0; // GLOBAL UNCOLLECTED
        let totalCollected = 0;   // Collected amounts

        // 🌟 CRITICAL BUG FIX: Compute Global Uncollected Amounts from Active Invoices ONLY
        // Debts MUST survive the daily reset (shiftCutoff) and carry over indefinitely.
        activeInvs.forEach(i => {
            if (i && i.paymentStatus === 'unpaid' && !i.isCancelled) {
                const amt = parseFloat(i.total || i.grandTotal || 0);
                const refundAmt = i.isCancelled ? amt : parseFloat(i.refundAmount || 0);
                totalUncollected += (amt - refundAmt);
            }
        });

        // 1. Process Invoices
        let cashTotal = 0, madaTotal = 0, visaTotal = 0, mastercardTotal = 0;
        invoices.forEach(i => {
            if (!i) return;
            const amt = parseFloat(i.total || i.grandTotal || 0);
            const rTime = new Date(i.date || i.timestamp).getTime();

            // If Live Shift: only show what hasn't been closed AND is newer than the last shift wipe.
            // If History: show everything for that selected date.
            const matchesShift = isLiveShift ? (!i.isZReported && rTime >= shiftCutoff) : true;

            // DYNAMIC ROLLING TOTALS
            const isInRange = (rTime >= startBound && (endBound === Infinity || rTime <= endBound));

            let refundAmt = parseFloat(i.refundAmount || 0);
            if (i.isCancelled) refundAmt = amt; // if fully cancelled previously without refundAmount prop
            const netAmt = amt - refundAmt;
            const isUnpaid = i.paymentStatus === 'unpaid';

            // Today's sales honors the Z-Report wipe (matchesShift) per user preference
            if (isInRange && matchesShift) {
                salesToday += netAmt; // ✅ Total Sales ALWAYS includes everything (Cash + Card + Pay Later)
                if (!isUnpaid) {
                    totalCollected += netAmt;   // ✅ Collected (Paid amounts only)
                }
            }`;

if (regexToReplace.test(content)) {
    content = content.replace(regexToReplace, replacement);
    fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
    console.log("REPLACED UNCOLLECTED LOGIC SUCCESSFULLY");
} else {
    console.log("LOGIC REGEX FAILED");
}
