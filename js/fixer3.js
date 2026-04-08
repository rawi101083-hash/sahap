const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

let newContent = content.replace(
    'let totalUncollected = 0; // NEW TRACKER\n        let totalCollected = 0;   // Collected amounts\n\n        // 1. Process Invoices',
    `let totalUncollected = 0; // NEW TRACKER
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

        // 1. Process Invoices`
);

newContent = newContent.replace(
    `            // Today's sales honors the Z-Report wipe (matchesShift) per user preference
            if (isInRange && matchesShift) {
                salesToday += netAmt; // ✅ Total Sales ALWAYS includes everything (Cash + Card + Pay Later)
                if (isUnpaid) {
                    totalUncollected += netAmt; // ✅ Uncollected (Pay Later)
                } else {
                    totalCollected += netAmt;   // ✅ Collected (Paid)
                }
            }`,
    `            // Today's sales honors the Z-Report wipe (matchesShift) per user preference
            if (isInRange && matchesShift) {
                salesToday += netAmt; // ✅ Total Sales ALWAYS includes everything (Cash + Card + Pay Later)
                if (!isUnpaid) {
                    totalCollected += netAmt;   // ✅ Collected (Paid)
                }
            }`
);

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', newContent, 'utf8');
console.log('UNCOLLECTED LOGIC FIXED');
