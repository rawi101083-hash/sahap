const fs = require('fs');

const code = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const targetStr = `            // Today's sales honors the Z-Report wipe (matchesShift) per user preference
            if (isInRange && matchesShift) {
                salesToday += netAmt; // ✅ Total Sales ALWAYS includes everything (Cash + Card + Pay Later)
                if (!isUnpaid) {
                    totalCollected += netAmt;   // ✅ Collected (Paid amounts only)
                }
            }

            // 7/30/365 metrics ignore Z-Report wipe and accumulate ALL historical data in range
            const isBeforeOrOnEnd = (endBound === Infinity || rTime <= endBound);
            if (isBeforeOrOnEnd) {
                if (rTime >= weekAgo) salesWeek += netAmt;
                if (rTime >= monthAgo) salesMonth += netAmt;
                if (rTime >= yearAgo) salesYear += netAmt;
            }

            // 🌟 EXCEPTION: MONTHLY SALES BREAKDOWN
            // DO NOT RESET: Must calculate sum of ALL invoices (historical + active) for calendar reporting
            const d = new Date(i.date || i.timestamp);
            const mIdx = d.getMonth();
            const year = d.getFullYear();
            const key = \`\${year}-\${String(mIdx + 1).padStart(2, '0')}\`;
            const monthName = (this.currentLang === 'en') ? monthsEn[mIdx] : monthsAr[mIdx];
            const label = \`\${monthName} \${year.toString()}\`;
            if (!monthlyMap[key]) monthlyMap[key] = { label, total: 0, sortKey: key };
            monthlyMap[key].total += netAmt;

            // ACTIVE DASHBOARD FILTER (Selected Date)
            if (isInRange && matchesShift) {
                totalAllInvoices += amt;     // Gross Sales (includes Pay Later)
                totalRefunds += refundAmt;   // Gross Refunds

                if (i.isCancelled !== true && !isUnpaid) {
                    // Track Payment Methods for Z-Report Sync (Only for Collected amounts)
                    const pMethod = i.paymentMethod || 'cash';
                    if (pMethod === 'cash') cashTotal += netAmt;
                    else if (pMethod === 'mada' || pMethod === 'network') madaTotal += netAmt;
                    else if (pMethod === 'visa') visaTotal += netAmt;
                    else if (pMethod === 'mastercard') mastercardTotal += netAmt;
                }
            }`;

const newStr = `            // 🌟 BUSINESS LOGIC RULE 1 & 2 REFACTOR 🌟
            // RULE 1: Daily Sales ONLY includes invoices created today (isInRange)
            // RULE 2: Collected Cash INCLUDES old invoices paid today (belongsToDrawer)
            
            // If History: fallback to isInRange since we don't have exact payment timestamps.
            const belongsToDrawer = isLiveShift ? (!i.isZReported && !isUnpaid) : (isInRange && !isUnpaid);

            // 1. GROSS METRICS (Strictly by Creation Date)
            if (isInRange && matchesShift) {
                salesToday += netAmt;        // Today's Net Sales
                totalAllInvoices += amt;     // Gross Sales (includes Pay Later)
                totalRefunds += refundAmt;   // Gross Refunds
            }

            // 2. COLLECTED METRICS (Drawer Cash tracking decoupling)
            if (belongsToDrawer) {
                totalCollected += netAmt;    // ✅ Collected (Paid amounts only)
                
                if (i.isCancelled !== true) {
                    const pMethod = i.paymentMethod || 'cash';
                    if (pMethod === 'cash') cashTotal += netAmt;
                    else if (pMethod === 'mada' || pMethod === 'network') madaTotal += netAmt;
                    else if (pMethod === 'visa') visaTotal += netAmt;
                    else if (pMethod === 'mastercard') mastercardTotal += netAmt;
                }
            }

            // 7/30/365 metrics ignore Z-Report wipe and accumulate ALL historical data in range
            const isBeforeOrOnEnd = (endBound === Infinity || rTime <= endBound);
            if (isBeforeOrOnEnd) {
                if (rTime >= weekAgo) salesWeek += netAmt;
                if (rTime >= monthAgo) salesMonth += netAmt;
                if (rTime >= yearAgo) salesYear += netAmt;
            }

            // 🌟 EXCEPTION: MONTHLY SALES BREAKDOWN
            // DO NOT RESET: Must calculate sum of ALL invoices (historical + active) for calendar reporting
            const d = new Date(i.date || i.timestamp);
            const mIdx = d.getMonth();
            const year = d.getFullYear();
            const key = \`\${year}-\${String(mIdx + 1).padStart(2, '0')}\`;
            const monthName = (this.currentLang === 'en') ? monthsEn[mIdx] : monthsAr[mIdx];
            const label = \`\${monthName} \${year.toString()}\`;
            if (!monthlyMap[key]) monthlyMap[key] = { label, total: 0, sortKey: key };
            monthlyMap[key].total += netAmt;`;

let normalizedCode = code.replace(/\r\n/g, '\n');
let normalizedTarget = targetStr.replace(/\r\n/g, '\n');

if (!normalizedCode.includes(normalizedTarget)) {
    console.error("Target string not found!");
    process.exit(1);
}

const finalCode = normalizedCode.replace(normalizedTarget, newStr);
fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', finalCode, 'utf8');
console.log("REPLACED SUCCESSFULLY!");
