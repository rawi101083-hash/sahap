const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const helpers = `
function lsSet(key, value) {
    if (!window.currentUID) return;
    localStorage.setItem(key + '_' + window.currentUID, value);
}
function lsGet(key, defaultVal) {
    if (!window.currentUID) return defaultVal !== undefined ? defaultVal : null;
    let val = localStorage.getItem(key + '_' + window.currentUID);
    return val !== null ? val : (defaultVal !== undefined ? defaultVal : null);
}
function lsRemove(key) {
    if (!window.currentUID) return;
    localStorage.removeItem(key + '_' + window.currentUID);
}
`;

if(!content.includes('function lsSet')) {
    content = content.replace('window.__syncingFromFirebase = false;', 'window.__syncingFromFirebase = false;\\n' + helpers);
}

const replacements = [
    [/localStorage\.getItem\('laundryHistory'\)/g, "lsGet('laundryHistory')"],
    [/localStorage\.setItem\('laundryHistory',/g, "lsSet('laundryHistory',"],
    [/localStorage\.removeItem\('laundryHistory'\)/g, "lsRemove('laundryHistory')"],
    
    [/localStorage\.getItem\('laundry_balances'\)/g, "lsGet('laundry_balances')"],
    [/localStorage\.setItem\('laundry_balances',/g, "lsSet('laundry_balances',"],
    [/localStorage\.removeItem\('laundry_balances'\)/g, "lsRemove('laundry_balances')"],
    
    [/localStorage\.getItem\('sahab_invoiceCounter'\)/g, "lsGet('sahab_invoiceCounter')"],
    [/localStorage\.setItem\('sahab_invoiceCounter',/g, "lsSet('sahab_invoiceCounter',"],
    [/localStorage\.removeItem\('sahab_invoiceCounter'\)/g, "lsRemove('sahab_invoiceCounter')"],

    [/localStorage\.getItem\('sahab_active_view'\)/g, "lsGet('sahab_active_view')"],
    [/localStorage\.setItem\('sahab_active_view',/g, "lsSet('sahab_active_view',"],
    [/localStorage\.removeItem\('sahab_active_view'\)/g, "lsRemove('sahab_active_view')"],
    
    [/localStorage\.getItem\('expenses'\)/g, "lsGet('expenses')"],
    [/localStorage\.setItem\('expenses',/g, "lsSet('expenses',"],
    [/localStorage\.removeItem\('expenses'\)/g, "lsRemove('expenses')"],
    
    [/localStorage\.getItem\('invoices'\)/g, "lsGet('invoices')"],
    [/localStorage\.setItem\('invoices',/g, "lsSet('invoices',"],
    [/localStorage\.removeItem\('invoices'\)/g, "lsRemove('invoices')"],

    [/localStorage\.setItem\('sahab_totalSales',/g, "lsSet('sahab_totalSales',"],
    [/localStorage\.setItem\('sahab_uncollectedAmounts',/g, "lsSet('sahab_uncollectedAmounts',"],
    [/localStorage\.setItem\('sahab_cashTotal',/g, "lsSet('sahab_cashTotal',"],
    [/localStorage\.setItem\('sahab_madaTotal',/g, "lsSet('sahab_madaTotal',"],
    [/localStorage\.setItem\('sahab_visaTotal',/g, "lsSet('sahab_visaTotal',"],
    [/localStorage\.setItem\('sahab_mastercardTotal',/g, "lsSet('sahab_mastercardTotal',"]
];

replacements.forEach(([regex, repl]) => {
    content = content.replace(regex, repl);
});

// Restore Collected Amounts
if(!content.includes('let totalCollected')) {
    content = content.replace(
        'let totalUncollected = 0; // NEW TRACKER',
        'let totalUncollected = 0; // NEW TRACKER\\n        let totalCollected = 0;   // Collected amounts'
    );
    content = content.replace(
        'totalUncollected += netAmt;\\n                } else {\\n                    salesToday += netAmt;\\n                }',
        'totalUncollected += netAmt;\\n                } else {\\n                    salesToday += netAmt;\\n                    totalCollected += netAmt;\\n                }'
    );
    content = content.replace(
        'data-mastercard="${mastercardTotal.toFixed(2)}"\\n                 data-uncollected=',
        'data-mastercard="${mastercardTotal.toFixed(2)}"\\n                 data-collected="${totalCollected.toFixed(2)}"\\n                 data-uncollected='
    );

    const targetFind1 = `        const mastercardTotal = parseFloat(syncEl.dataset.mastercard) || 0;
        const uncollected = parseFloat(syncEl.dataset.uncollected) || 0;`;

    const targetRepl1 = `        const mastercardTotal = parseFloat(syncEl.dataset.mastercard) || 0;
        const collected = parseFloat(syncEl.dataset.collected) || 0;
        const uncollected = parseFloat(syncEl.dataset.uncollected) || 0;`;

    content = content.replaceAll(targetFind1, targetRepl1);

    const targetFind2 = `<td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #2e7d32; font-size: 13px;">\${netRev.toFixed(2)} ر.س</td>
                                        </tr>`;

    const targetRepl2 = `<td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #2e7d32; font-size: 13px;">\${netRev.toFixed(2)} ر.س</td>
                                        </tr>
                                        <tr style="background: #e1f5fe; border-bottom: 1px solid #81d4fa;">
                                            <td style="padding: 8px 10px; color: #0288d1; font-weight: 700;">\${this.currentLang === 'en' ? 'Collected Amounts' : 'المبالغ المحصلة (مقبوضات)'}</td>
                                            <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #0288d1; font-size: 13px;">\${collected.toFixed(2)} ر.س</td>
                                        </tr>`;
    content = content.replace(targetFind2, targetRepl2);

    const targetFind3 = `<span class="value" style="color:#4caf50">\${format(netRev)} ر.س</span>
                </div>`;

    const targetRepl3 = `<span class="value" style="color:#4caf50">\${format(netRev)} ر.س</span>
                </div>
                <div class="z-report-item" style="background: rgba(14, 165, 233, 0.1); border-color: rgba(14, 165, 233, 0.3);">
                    <div class="info">
                        <i class="fa-solid fa-hand-holding-dollar" style="color:#0ea5e9; margin-left:10px;"></i>
                        <span class="label" style="color:#0ea5e9">\${lang === 'en' ? 'Collected Amounts' : 'المبالغ المحصلة (مقبوضات)'}</span>
                    </div>
                    <span class="value" style="color:#0ea5e9">\${format(collected)} ر.س</span>
                </div>`;
    content = content.replace(targetFind3, targetRepl3);
}

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
console.log('Update Complete.');
