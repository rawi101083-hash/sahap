const fs = require('fs');
let code = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

// Replacements
const reps = [
    {
        t: `            invs[idx].paymentStatus = 'paid';
            invs[idx].paymentMethod = method;

            // 🔄 CRITICAL LOGIC: Overwrite the timestamp & date
            invs[idx].timestamp = Date.now();
            invs[idx].date = getLocalYMD();

            await localforage.setItem('invoices', invs);`,
        r: `            invs[idx].paymentStatus = 'paid';
            invs[idx].paymentMethod = method;

            // 🌟 FIXED: Strictly KEEP original timestamp/date. It correctly drops from active unpaid list seamlessly.
            
            await localforage.setItem('invoices', invs);`
    },
    {
        t: `        let invoices = [];
        const activeInvs = await localforage.getItem('invoices') || [];

        if (isLiveShift) {
            invoices = activeInvs;
        } else {
            // Historical View: Retrieve from active (if unclosed) + archives
            const targetDateStr = this.currentViewDate;
            invoices = [].concat(activeInvs);

            const archives = await localforage.getItem('archived_z_reports') || [];
            archives.forEach(arc => {
                if (arc.invoices) { Array.prototype.push.apply(invoices, arc.invoices); }
            });
        }
        // 📅 GLOBAL DATE FILTER: Strictly isolate Live Shift from Archived data
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
        });

        // Search Filter (Secondary)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            invoices = invoices.filter(inv =>`,
        r: `        let invoices = [];
        const activeInvs = await localforage.getItem('invoices') || [];

        // If a search term exists (like from Customer Log), we must fetch everything (archives + active)
        const fetchAll = !!searchTerm;

        invoices = [].concat(activeInvs);

        if (!isLiveShift || fetchAll) {
            // Retrieve archives for History Date or Search Matches
            const archives = await localforage.getItem('archived_z_reports') || [];
            archives.forEach(arc => {
                if (arc.invoices) { Array.prototype.push.apply(invoices, arc.invoices); }
            });
        }

        // 📅 GLOBAL DATE FILTER: Strictly isolate Live Shift from Archived data
        invoices = invoices.filter(inv => {
            if (!inv) return false;

            // If a custom search term is used, bypass timezone/date limits entirely to allow deep searching
            if (searchTerm) return true;

            // If we are looking at the LIVE shift without search, completely hide closed/archived invoices
            if (isLiveShift && inv.isZReported) return false;

            const isUnpaid = inv.paymentStatus === 'unpaid';

            // Normalize dates to KSA Local YYYY-MM-DD for comparison ensuring 100% strict match
            const invDate = getLocalYMD(inv.timestamp || inv.date);
            
            // EXCEPTION: Unpaid invoices MUST ALWAYS show in Live Shift regardless of their creation date
            if (isLiveShift && isUnpaid && !inv.isCancelled) {
                return true;
            }

            return invDate === (this.currentViewDate || todayYMD);
        });

        // Search Filter (Secondary)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            invoices = invoices.filter(inv =>`
    },
    {
        t: `        // Aggregate all lifetime history from archives to ensure customers never disappear
        const validArchives = Array.isArray(archivedData) ? archivedData : Object.values(archivedData);
        validArchives.forEach(arc => {
            if (arc.invoices) {
                const arcInvs = Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices);
                Array.prototype.push.apply(allInvoices, arcInvs);
            }
        });

        const validInvoices = allInvoices.filter(i => i && i.id); // Relaxed filter: include all entries with an ID

        const customersMap = {};`,
        r: `        // Aggregate all lifetime history from archives to ensure customers never disappear
        const validArchives = Array.isArray(archivedData) ? archivedData : Object.values(archivedData);
        validArchives.forEach(arc => {
            if (arc.invoices) {
                const arcInvs = Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices);
                Array.prototype.push.apply(allInvoices, arcInvs);
            }
        });

        // Deduplicate invoices by ID (prioritizing the live/updated version)
        const uniqueInvoicesMap = new Map();
        allInvoices.forEach(i => {
            if (i && i.id) {
                if (!uniqueInvoicesMap.has(i.id) || i.isZReported === false) {
                    uniqueInvoicesMap.set(i.id, i);
                }
            }
        });

        const validInvoices = Array.from(uniqueInvoicesMap.values());

        const customersMap = {};`
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
console.log("REPLACED SUCCESSFULLY ALL!");
