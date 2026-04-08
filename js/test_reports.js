const fs = require('fs');

// We will inject a sandbox that tests renderReports
const code = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

// Mock DOM
global.document = {
    getElementById: (id) => {
        return {
            innerHTML: '',
            value: '',
            style: {},
            classList: { add: () => {}, remove: () => {} }
        }
    }
};

global.window = {};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

global.navigator = { onLine: true };
global.localforage = {
    getItem: async (key) => {
        if (key === 'invoices') return { "0": { total: 10, paymentStatus: 'paid' }, "1": { total: 20, paymentStatus: 'unpaid' } };
        if (key === 'expenses') return { "0": { amount: 5, date: '2026-04-08' } };
        if (key === 'archived_z_reports') return { "0": { invoices: [{ total: 50, paymentStatus: 'paid'}], expenses: [] } };
        if (key === 'laundry_balances') return {};
        if (key === 'tax_records') return [];
        return null;
    }
};

global.getLocalYMD = () => '2026-04-08';

try {
    eval(code);
    
    // appLogic is exposed globally usually
    if (typeof appLogic !== 'undefined') {
        appLogic.renderReports().then(() => {
            console.log("RENDER REPORTS COMPLETED SUCCESSFULLY WITHOUT CRASHING.");
        }).catch(e => {
            console.log("RENDER REPORTS CRASHED:", e);
        });
    } else {
        console.log("appLogic is not defined");
    }
} catch (e) {
    console.log("EVAL CRASHED:", e);
}
