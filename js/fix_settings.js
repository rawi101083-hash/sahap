const fs = require('fs');

let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

// 1. Fix localforage overrides wrapper
const newLocalForage = `const originalSetItem = localforage.setItem;
const originalGetItem = localforage.getItem;
const originalRemoveItem = localforage.removeItem;
window.isDataInitialized = false; // THE MASTER LOCK: App starts in strict READ-ONLY mode
window.__syncingFromFirebase = false;

// 0. STRICT MULTI-TENANCY NAMESPACE ISOLATION
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

function getTenantKey(k) {
    if (!window.currentUID) return k;
    return k + '_' + window.currentUID;
}

// 1. STRICT TENANT ISOLATION FOR IndexedDB
localforage.setItem = async function(key, value) {
    const tKey = getTenantKey(key);
    if (window.__syncingFromFirebase) {
        return await originalSetItem.call(localforage, tKey, value);
    }
    const p = await originalSetItem.call(localforage, tKey, value);
    if (collectionsToSync.includes(key)) {
        manualSyncToCloud(key, value).catch(e => console.error('[Sync]', e));
    }
    return p;
};

localforage.getItem = async function(key) {
    const tKey = getTenantKey(key);
    let val = await originalGetItem.call(localforage, tKey);
    // Legacy migration to prevent data loss on update
    if (val === null && window.currentUID) {
        val = await originalGetItem.call(localforage, key);
        if (val !== null) {
            console.log(\`[Multi-Tenant] Auto-migrating legacy data for \${key}\`);
            await originalSetItem.call(localforage, tKey, val); // save to tenant
            await originalRemoveItem.call(localforage, key); // wipe generic leak
        }
    }
    return val;
};

localforage.removeItem = async function(key) {
    return await originalRemoveItem.call(localforage, getTenantKey(key));
};`;

content = content.replace(/const originalSetItem = localforage\.setItem;[\s\S]*?(?=\/\/ 2\. EXPLICIT SYNC)/, newLocalForage + '\n\n');

// 2. Fix localStorage.getItem('invoiceCity') usage
content = content.replace(/localStorage\.getItem\('invoiceCity'\)/g, "lsGet('invoiceCity')");
content = content.replace(/localStorage\.getItem\('invoiceNeighborhood'\)/g, "lsGet('invoiceNeighborhood')");
content = content.replace(/localStorage\.getItem\('invoiceStreet'\)/g, "lsGet('invoiceStreet')");

// 3. Fix laundry_balances localStorage leakage
content = content.replace(/localStorage\.setItem\('laundry_balances'/g, "lsSet('laundry_balances'");

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
console.log("REPLACEMENTS DONE");
