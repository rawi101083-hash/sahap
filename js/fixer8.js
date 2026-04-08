const fs = require('fs');

let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');
const lines = content.split('\n');

let renderReportsLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('async renderReports() {')) {
        renderReportsLine = i;
        break;
    }
}

if (renderReportsLine === -1) {
    console.log("Could not find renderReports()");
    process.exit(1);
}

// Find where "const archives = await localforage.getItem('archived_z_reports') || [];" is.
let archivesLine = -1;
for (let i = renderReportsLine; i < renderReportsLine + 50; i++) {
    if (lines[i].includes("const archives = await localforage.getItem('archived_z_reports') || [];")) {
        archivesLine = i;
        break;
    }
}

if (archivesLine === -1) {
    console.log("Could not find archives inside renderReports");
    process.exit(1);
}

// Replace precisely around line archivesLine
// activeInvs is expected 2 lines above archivesLine
// The forEach block is several lines below archivesLine

let blockStart = archivesLine - 2;
let blockEnd = archivesLine + 10;

const newBlock = `        const rawInvs = await localforage.getItem('invoices') || [];
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

// Slice and insert
const pre = lines.slice(0, blockStart).join('\n');
const post = lines.slice(blockEnd + 1).join('\n');

const newContent = pre + '\n' + newBlock + '\n' + post;

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', newContent, 'utf8');
console.log("SUCCESSFULLY SCRIPTED BULLETPROOF UI REPAIR");
