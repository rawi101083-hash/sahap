const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const targetStr = `        const lang = this.currentLang || 'ar';
        const activeInvs = await localforage.getItem('invoices') || [];
        const activeExps = await localforage.getItem('expenses') || [];
        const archives = await localforage.getItem('archived_z_reports') || [];

        let Math_invoices = [].concat(activeInvs);
        let Math_exps = [].concat(activeExps);

        archives.forEach(arc => {
            if (arc.invoices) { Array.prototype.push.apply(Math_invoices, arc.invoices); }
            if (arc.expenses) { Array.prototype.push.apply(Math_exps, arc.expenses); }
        });`;

const replacementStr = `        const lang = this.currentLang || 'ar';
        const rawInvs = await localforage.getItem('invoices') || [];
        const rawExps = await localforage.getItem('expenses') || [];
        const rawArchives = await localforage.getItem('archived_z_reports') || [];

        const activeInvs = Array.isArray(rawInvs) ? rawInvs : Object.values(rawInvs);
        const activeExps = Array.isArray(rawExps) ? rawExps : Object.values(rawExps);
        const archives = Array.isArray(rawArchives) ? rawArchives : Object.values(rawArchives);

        let Math_invoices = [...activeInvs];
        let Math_exps = [...activeExps];

        archives.forEach(arc => {
            if (arc.invoices) { 
                const arcInvs = Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices);
                Array.prototype.push.apply(Math_invoices, arcInvs); 
            }
            if (arc.expenses) { 
                const arcExps = Array.isArray(arc.expenses) ? arc.expenses : Object.values(arc.expenses);
                Array.prototype.push.apply(Math_exps, arcExps); 
            }
        });`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
    console.log("REPORTS RENDERER ARRAYS FIXED SAFELY");
} else {
    console.log("STRING NOT FOUND IN APP.JS");
}
