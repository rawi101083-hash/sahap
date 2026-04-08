const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const regexToReplace = /const lang = this\.currentLang \|\| 'ar';[\s\S]*?let taxRecords = await localforage\.getItem\('tax_records'\) \|\| \[\];/;

const replacement = `const lang = this.currentLang || 'ar';
        const rawInvs = await localforage.getItem('invoices') || [];
        const rawExps = await localforage.getItem('expenses') || [];
        const rawArchives = await localforage.getItem('archived_z_reports') || [];

        const activeInvs = Array.isArray(rawInvs) ? rawInvs : Object.values(rawInvs);
        const activeExps = Array.isArray(rawExps) ? rawExps : Object.values(rawExps);
        const archives = Array.isArray(rawArchives) ? rawArchives : Object.values(rawArchives);

        let Math_invoices = [...activeInvs];
        let Math_exps = [...activeExps];

        archives.forEach(arc => {
            if (arc.invoices) { Array.prototype.push.apply(Math_invoices, Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices)); }
            if (arc.expenses) { Array.prototype.push.apply(Math_exps, Array.isArray(arc.expenses) ? arc.expenses : Object.values(arc.expenses)); }
        });

        const invoices = Math_invoices;
        const exps = Math_exps;
        let taxRecords = await localforage.getItem('tax_records') || [];`;

if (regexToReplace.test(content)) {
    content = content.replace(regexToReplace, replacement);
    // Also fix the activeInvs.forEach block down below because validActiveInvs is now redundant
    content = content.replace(/let validActiveInvs = Array\.isArray\(activeInvs\) \? activeInvs : Object\.values\(activeInvs\);\s+validActiveInvs\.forEach/g, 'activeInvs.forEach');
    
    fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
    console.log("FIXED REPORTS ARRAYS");
} else {
    console.log("REGEX FAILED");
}
