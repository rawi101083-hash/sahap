const fs = require('fs');
let code = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const reps = [
    {
        t: `        const todayYMD = getLocalYMD();
        const isLiveShift = !this.currentViewDate || this.currentViewDate === todayYMD;`,
        r: `        const todayYMD = getLocalYMD();
        const isLiveShift = !this.currentViewDate || this.currentViewDate === todayYMD;

        let shiftCutoff = 0;
        if (isLiveShift) {
            const cutoffStr = localStorage.getItem('shiftCutoff_' + todayYMD);
            if (cutoffStr) shiftCutoff = parseInt(cutoffStr);
        }`
    },
    {
        t: `            // If Live Shift: only show what hasn't been closed AND is newer than the last shift wipe.
            // If History: show everything for that selected date.
            const matchesShift = isLiveShift ? !i.isZReported : true;`,
        r: `            // If Live Shift: only show what hasn't been closed AND is newer than the last shift wipe.
            // If History: show everything for that selected date.
            const matchesShift = isLiveShift ? (!i.isZReported && rTime >= shiftCutoff) : true;`
    },
    {
        t: `        // === مسح الذاكرة المحلية بالقوة ===
        localStorage.setItem('invoices', '[]');
        localStorage.setItem('expenses', '[]');`,
        r: `        // === مسح الذاكرة المحلية بالقوة ===
        localStorage.setItem('invoices', '[]');
        localStorage.setItem('expenses', '[]');
        
        // Save the cutoff time so the active dashboard forcefully zero-outs (clean slate)
        localStorage.setItem('shiftCutoff_' + getLocalYMD(), Date.now().toString());`
    },
    {
        t: `            // Search Filter (Secondary)
        if (searchTerm) {`,
        r: `            // Deduplicate invoices in History Tab by ID to prevent ghost/floating clones
            const uniqueHistoryMap = new Map();
            invoices.forEach(inv => {
                if (inv && inv.id) {
                    if (!uniqueHistoryMap.has(inv.id) || inv.isZReported === false) {
                        uniqueHistoryMap.set(inv.id, inv);
                    }
                }
            });
            invoices = Array.from(uniqueHistoryMap.values());

            // Search Filter (Secondary)
        if (searchTerm) {`
    },
    {
        t: `        archives.forEach(arc => {
            if (arc.invoices) { 
                const arcInvs = Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices);
                Array.prototype.push.apply(Math_invoices, arcInvs); 
            }
            if (arc.expenses) { 
                const arcExps = Array.isArray(arc.expenses) ? arc.expenses : Object.values(arc.expenses);
                Array.prototype.push.apply(Math_exps, arcExps); 
            }
        });
        const invoices = Math_invoices;`,
        r: `        archives.forEach(arc => {
            if (arc.invoices) { 
                const arcInvs = Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices);
                Array.prototype.push.apply(Math_invoices, arcInvs); 
            }
            if (arc.expenses) { 
                const arcExps = Array.isArray(arc.expenses) ? arc.expenses : Object.values(arc.expenses);
                Array.prototype.push.apply(Math_exps, arcExps); 
            }
        });

        // Deduplicate Financial Lists to prevent archived Unpaid clones from stacking Gross Sales indefinitely
        const uInvMap = new Map();
        Math_invoices.forEach(inv => {
            if (inv && inv.id) {
                if (!uInvMap.has(inv.id) || inv.isZReported === false) uInvMap.set(inv.id, inv);
            }
        });
        const invoices = Array.from(uInvMap.values());`
    }
];

let normalizedCode = code.replace(/\\r\\n/g, '\\n');
for (const rep of reps) {
    let nt = rep.t.replace(/\\r\\n/g, '\\n');
    if (!normalizedCode.includes(nt)) {
        console.error("FAILED to find chunk:\\n" + nt.substring(0, 50));
        process.exit(1);
    }
    normalizedCode = normalizedCode.replace(nt, rep.r.replace(/\\r\\n/g, '\\n'));
}

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', normalizedCode, 'utf8');
console.log("REPLACED ZERO FIXES SUCCESSFULLY!");
