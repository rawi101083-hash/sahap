// Sahab POS - Main Application Logic
(function () {
    // ⚡ FAST GUARD: Prevent Login Flash
    // We check localStorage immediately (before any Firebase calls) to decide which UI to show.
    const sessionUID = localStorage.getItem('sahab_session_uid');
    const loginOverlay = document.getElementById('login-overlay');
    const appEl = document.getElementById('app');

    if (sessionUID) {
        if (appEl) appEl.style.display = 'block';
        if (loginOverlay) loginOverlay.style.display = 'none';
        console.log("[Fast-Guard] Session hint found. Showing App.");

        // --- ⚡ INSTANT TRIAL BANNER INIT (No Flash/Flicker) ---
        const isSubscribedLocal = localStorage.getItem(`sahab_is_subscribed_${sessionUID}`);
        const trialExpiryLocal = localStorage.getItem(`sahab_trial_expiry_${sessionUID}`);
        const banner = document.getElementById('trial-banner');
        const trialDays = document.getElementById('trial-days');

        if (isSubscribedLocal === 'true') {
            if (banner) banner.classList.add('hidden');
        } else if (trialExpiryLocal) {
            const exactDaysLeft = (parseInt(trialExpiryLocal) - Date.now()) / (1000 * 60 * 60 * 24);
            const daysLeft = Math.ceil(exactDaysLeft);
            if (exactDaysLeft > 0) {
                if (trialDays) trialDays.innerText = daysLeft;
                if (banner) banner.classList.remove('hidden');
            } else {
                // Hard visual lock on start if localstorage knows it's expired
                console.warn("[Fast-Guard] Trial Expired.");
                const expiredOverlay = document.getElementById('trial-expired-overlay');
                if (expiredOverlay) {
                    expiredOverlay.classList.remove('hidden');
                    expiredOverlay.style.display = 'flex';
                }
                if (banner) banner.classList.add('hidden');
            }
        }
    } else {
        // No session -> Show Login immediately
        if (appEl) appEl.style.display = 'none';
        if (loginOverlay) loginOverlay.style.display = 'flex';
        console.log("[Fast-Guard] No session. Showing Login.");
    }
})();

// ==========================================
// PWA SMART INSTALLATION & AUTO-UPDATE LOGIC
// ==========================================
let deferredPrompt;

// 1. Listen for the install prompt from the browser
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing automatically
    e.preventDefault();
    // Stash the event so it can be triggered later via our custom button
    deferredPrompt = e;
});

// 2. Hide button if installation completes successfully
window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) installBtn.classList.add('hidden');
    deferredPrompt = null;
    console.log('[PWA] Application was successfully installed.');
});

// 3. Guarantee button is hidden if already running in PWA standalone mode
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

if (isStandalone) {
    window.addEventListener('DOMContentLoaded', () => {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) installBtn.classList.add('hidden');
        console.log('[PWA] Running in Standalone mode.');
    });
} else {
    // 4. iOS Specific Workaround Details
    // iOS Safari does not support beforeinstallprompt. We must show a manual instruction.
    window.addEventListener('DOMContentLoaded', () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            const installBtn = document.getElementById('pwa-install-btn');
            if (installBtn) {
                // Prepare the button as an iOS Hint instead of a native installer
                installBtn.innerHTML = '<i class="fa-brands fa-apple"></i> للتثبيت: اضغط مشاركة 📤 ثم أضف للشاشة';
                installBtn.onclick = (e) => {
                    e.preventDefault();
                    if (typeof appLogic !== 'undefined' && appLogic.showToast) {
                        appLogic.showToast('في متصفح سفاري (Safari): اضغط على أيقونة المشاركة 📤 ثم اختر "إضافة إلى الصفحة الرئيسية"');
                    } else {
                        alert('في متصفح سفاري: اضغط على أيقونة المشاركة 📤 ثم اختر "إضافة إلى الصفحة الرئيسية"');
                    }
                };
            }
        }
    });
}

const ADMIN_PIN = "456333";
const DefaultDeliveryOptions = [

    { id: 'none', name: 'بدون توصيل', amount: 0 },
    { id: 'normal', name: 'توصيل عادي', amount: 10 },
    { id: 'special', name: 'توصيل خاص', amount: 5 }
];

const DefaultServices = [
    { id: 'thobe', cat: 'men', name: 'ثوب', icon: 'fa-user-tie', prices: { iron: 2, wash_iron: 5, wash: 3 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'thobe_cotton', cat: 'men', name: 'ثوب قطن', icon: 'fa-user-tie', prices: { iron: 3, wash_iron: 6, wash: 3 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'thobe_wool', cat: 'men', name: 'ثوب صوف', icon: 'fa-user-tie', prices: { iron: 3, wash_iron: 6, wash: 3 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'shemagh', cat: 'men', name: 'الشماغ', icon: 'fa-hat-cowboy', prices: { iron: 2, wash_iron: 4, wash: 2 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'ghutra', cat: 'men', name: 'غترة', icon: 'fa-hat-cowboy', prices: { iron: 2, wash_iron: 4, wash: 2 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'mishlah', cat: 'men', name: 'مشلح', icon: 'fa-vest', prices: { iron: 11, wash_iron: 22, wash: 11 }, expressFee: { iron: 10, wash_iron: 10, wash: 2 } },
    { id: 'underwear', cat: 'men', name: 'ملابس داخلية', icon: 'fa-shirt', prices: { iron: 2, wash_iron: 4, wash: 2 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'pants_short', cat: 'men', name: 'سروال قصير', icon: 'fa-box', prices: { iron: 1, wash_iron: 2.5, wash: 1.5 }, expressFee: { iron: 0.5, wash_iron: 0.5, wash: 2 } },
    { id: 'pants_long', cat: 'men', name: 'سروال طويل', icon: 'fa-boxes-stacked', prices: { iron: 1.5, wash_iron: 3, wash: 1.5 }, expressFee: { iron: 0.5, wash_iron: 1, wash: 2 } },
    { id: 'undershirt', cat: 'men', name: 'فنيله', icon: 'fa-shirt', prices: { iron: 1, wash_iron: 2.5, wash: 1.5 }, expressFee: { iron: 0.5, wash_iron: 0.5, wash: 2 } },
    { id: 'trousers', cat: 'men', name: 'بنطلون', icon: 'fa-person', prices: { iron: 2, wash_iron: 4, wash: 2 }, expressFee: { iron: 3, wash_iron: 3, wash: 2 } },
    { id: 'shirt', cat: 'men', name: 'قميص', icon: 'fa-shirt', prices: { iron: 2, wash_iron: 4, wash: 2 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'jacket', cat: 'men', name: 'جاكيت', icon: 'fa-user-secret', prices: { iron: 6, wash_iron: 12, wash: 6 }, expressFee: { iron: 4, wash_iron: 4, wash: 2 } },
    { id: 'military_suit', cat: 'men', name: 'بدله عسكرية', icon: 'fa-user-shield', prices: { iron: 3, wash_iron: 7, wash: 4 }, expressFee: { iron: 7, wash_iron: 7, wash: 2 } },
    { id: 'work_suit', cat: 'men', name: 'بدلة عمل', icon: 'fa-user-nurse', prices: { iron: 5, wash_iron: 9, wash: 4 }, expressFee: { iron: 4, wash_iron: 4, wash: 2 } },
    { id: 'overalls', cat: 'men', name: 'فرهول', icon: 'fa-socks', prices: { iron: 4, wash_iron: 9, wash: 5 }, expressFee: { iron: 3, wash_iron: 3, wash: 2 } },
    { id: 'coat', cat: 'men', name: 'بالطو', icon: 'fa-user-doctor', prices: { iron: 2, wash_iron: 5, wash: 3 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'towel', cat: 'misc', name: 'فوطة', icon: 'fa-rug', prices: { iron: 2, wash_iron: 4, wash: 2 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'pajamas', cat: 'men', name: 'بجامه', icon: 'fa-bed', prices: { iron: 3, wash_iron: 6, wash: 3 }, expressFee: { iron: 1, wash_iron: 2, wash: 2 } },
    { id: 'blouse', cat: 'women', name: 'بلوزه', icon: 'fa-shirt', prices: { iron: 2, wash_iron: 5, wash: 3 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'blouse_wool', cat: 'women', name: 'بلوزه صوف', icon: 'fa-shirt', prices: { iron: 3, wash_iron: 8, wash: 5 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'ihram', cat: 'men', name: 'احرام', icon: 'fa-blanket', prices: { iron: 3, wash_iron: 8, wash: 5 }, expressFee: { iron: 4, wash_iron: 4, wash: 2 } },
    { id: 'pakistani_suit', cat: 'men', name: 'بدلة باكستانية', icon: 'fa-user-tie', prices: { iron: 3, wash_iron: 8, wash: 5 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'socks', cat: 'misc', name: 'شراب', icon: 'fa-socks', prices: { iron: 1, wash_iron: 1.5, wash: 0.5 }, expressFee: { iron: 0.5, wash_iron: 0.5, wash: 2 } },
    { id: 'cap', cat: 'misc', name: 'قبوع', icon: 'fa-hat-cowboy', prices: { iron: 0, wash_iron: 3, wash: 3 }, expressFee: { iron: 0, wash_iron: 1, wash: 2 } },
    { id: 'abaya', cat: 'women', name: 'عبايه', icon: 'fa-person-dress', prices: { iron: 5, wash_iron: 11, wash: 6 }, expressFee: { iron: 5, wash_iron: 5, wash: 2 } },
    { id: 'scarf', cat: 'women', name: 'طرحه', icon: 'fa-mitten', prices: { iron: 1, wash_iron: 2, wash: 1 }, expressFee: { iron: 1, wash_iron: 1, wash: 2 } },
    { id: 'women_robe', cat: 'women', name: 'روب نسائي', icon: 'fa-person-dress', prices: { iron: 2, wash_iron: 5, wash: 3 }, expressFee: { iron: 2, wash_iron: 2, wash: 2 } },
    { id: 'dress_normal', cat: 'women', name: 'فستان عادي', icon: 'fa-person-dress', prices: { iron: 11, wash_iron: 22, wash: 11 }, expressFee: { iron: 5, wash_iron: 5, wash: 2 } },
    { id: 'dress_embroidered', cat: 'women', name: 'فستان مطرز', icon: 'fa-person-dress', prices: { iron: 31, wash_iron: 52, wash: 21 }, expressFee: { iron: 10, wash_iron: 10, wash: 2 } },
    { id: 'dress_evening', cat: 'women', name: 'فستان سهرة', icon: 'fa-person-dress', prices: { iron: 21, wash_iron: 42, wash: 21 }, expressFee: { iron: 10, wash_iron: 10, wash: 2 } },
    { id: 'dress_wedding', cat: 'women', name: 'فستان فرح', icon: 'fa-person-dress', prices: { iron: 51, wash_iron: 152, wash: 101 }, expressFee: { iron: 10, wash_iron: 10, wash: 2 } }
];

const AvailableIcons = [
    'fa-shirt', 'fa-user-tie', 'fa-hat-cowboy', 'fa-vest', 'fa-box', 'fa-boxes-stacked',
    'fa-person', 'fa-user-secret', 'fa-user-shield', 'fa-user-nurse', 'fa-socks',
    'fa-user-doctor', 'fa-rug', 'fa-bed', 'fa-person-dress', 'fa-mitten', 'fa-blanket', 'fa-tie'
];

// ZATCA Phase 1 TLV & Base64 Encoder (Standalone function mapping to global scopes)
function generateZatcaBase64(sellerName, vatNumber, timestamp, totalAmount, vatAmount) {
    try {
        const name = (sellerName && sellerName.trim()) ? sellerName.trim() : 'سحاب';
        // Non-existent VAT defaults to empty string rather than crashing validators
        const vat = (vatNumber && vatNumber.trim() && vatNumber !== '000000000000000') ? vatNumber : '';
        const fTotal = parseFloat(totalAmount || 0).toFixed(2);
        const fVat = parseFloat(vatAmount || 0).toFixed(2);

        let isoTime = timestamp;
        try {
            isoTime = new Date(timestamp).toISOString();
        } catch (e) {
            isoTime = new Date().toISOString();
        }

        // Pure JS helpers to assemble strict ZATCA TLV buffers
        const toUTF8Bytes = (str) => new TextEncoder().encode(String(str));

        const buildTLV = (tag, value) => {
            const valBytes = toUTF8Bytes(value || "");
            // Tag (1 byte) | Length (1 byte) | Unicode UTF-8 Bytes
            var arr = [tag, valBytes.length]; for (var i = 0; i < valBytes.length; i++) { arr.push(valBytes[i]); } return new Uint8Array(arr);
        };

        const parts = [
            buildTLV(1, name),
            buildTLV(2, vat),
            buildTLV(3, isoTime),
            buildTLV(4, fTotal),
            buildTLV(5, fVat)
        ];

        // Combine into unified array buffer exactly to standard memory
        const totalLen = parts.reduce((acc, curr) => acc + curr.length, 0);
        const binaryBuffer = new Uint8Array(totalLen);
        let offset = 0;
        parts.forEach(p => {
            binaryBuffer.set(p, offset);
            offset += p.length;
        });

        // Convert byte sequences directly to native base64 without leaking memory
        let payloadStr = '';
        for (let i = 0; i < binaryBuffer.length; i++) {
            payloadStr += String.fromCharCode(binaryBuffer[i]);
        }

        return btoa(payloadStr);

    } catch (err) {
        console.error('ZATCA Standalone Encoding err:', err);
        return unescape(encodeURIComponent('فاتورة ضريبية مبسطة'));
    }
}



// Wafeq-inspired Double-Entry Journal Engine
const accountingEngine = {
    async postTransaction(invoice) {
        const total = invoice.grandTotal;
        // Calculate 15% Inclusive VAT: Subtotal = Total / 1.15, VAT = Total - Subtotal
        const subtotal = total / 1.15;
        const vat = total - subtotal;

        invoice.vatAmount = vat;
        invoice.subtotalNet = subtotal;

        let journals = await localforage.getItem('journal_entries') || [];
        let jEntry = {
            id: `JRN-${Date.now()}`,
            date: invoice.timestamp,
            ref_invoice: invoice.id,
            entries: [
                { account: 'Cash/Receivables', type: 'debit', amount: total },
                { account: 'Sales Revenue', type: 'credit', amount: subtotal },
                { account: 'VAT Payable (15%)', type: 'credit', amount: vat }
            ]
        };
        journals.unshift(jEntry);
        await localforage.setItem('journal_entries', journals);
        await manualSyncToCloud('journal_entries', journals);

        let taxRecords = await localforage.getItem('tax_records') || [];
        taxRecords.unshift({
            id: `TAX-${Date.now()}`,
            date: invoice.timestamp,
            ref_invoice: invoice.id,
            grossTotal: total,
            netTotal: subtotal,
            vatCollected: vat
        });
        await localforage.setItem('tax_records', taxRecords);
        await manualSyncToCloud('tax_records', taxRecords);

        let inventory = await localforage.getItem('inventory') || [];
        // Future-proof: Logic to deduct raw materials if required
        await localforage.setItem('inventory', inventory);
        await manualSyncToCloud('inventory', inventory);

        return invoice;
    }
};

// --- FIREBASE CROSS-DEVICE SYNCHRONIZATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBTE1YodqeIKjG-RBCe8pHbnRM7EQNSemU",
    authDomain: "sahab-3089b.firebaseapp.com",
    databaseURL: "https://sahab-3089b-default-rtdb.firebaseio.com",
    projectId: "sahab-3089b",
    storageBucket: "sahab-3089b.firebasestorage.app",
    messagingSenderId: "236842364975",
    appId: "1:236842364975:web:1ecd34c708e7a9096596da",
    measurementId: "G-H5J0L3JN0J"
};

// Initialize Firebase only if not already initialized
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (err) {
        console.error("Firebase init error:", err);
    }
}

const collectionsToSync = ['customers', 'invoices', 'journal_entries', 'tax_records', 'inventory', 'services', 'expenses', 'delivery_options'];
const originalSetItem = localforage.setItem;
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

// 1. SIMPLE STORAGE: localforage now ONLY handles local database
localforage.setItem = async function (key, value) {
    return await originalSetItem.call(localforage, key, value);
};

// 2. EXPLICIT SYNC: Targeted helper to send specific records or collections to Firebase (UID-scoped)
async function manualSyncToCloud(key, value, recordId = null) {
    if (!window.isDataInitialized) {
        console.warn(`[Sync-Blocked] Cannot save ${key}. System is still initializing.`);
        return;
    }

    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY" && !!firebaseConfig.apiKey) {
        const path = recordId ? `${key}/${recordId}` : key;
        try {
            console.log(`[Manual-Sync] Sending ${path} to cloud...`);
            const safePayload = JSON.parse(JSON.stringify(value, (k, v) => (v === undefined ? null : v)));
            await firebase.database().ref(getDbPath(path)).set(safePayload);
            console.log(`[Manual-Sync] ${path} saved successfully.`);
        } catch (err) {
            console.error(`[Manual-Sync] Error saving ${path}:`, err);
        }
    }
}

// UID-scoped DB path helper
window.tenantSettings = { name: 'المغسلة', phone: '', taxNumber: '' };
function getDbPath(key) {
    if (window.currentUID) return `users/${window.currentUID}/${key}`;
    return key; // fallback
}

// 3. RECOVERY LOGIC: Fetch-Only initialization (UID-scoped)
async function initFirebaseSync() {
    console.log("[Recovery] --- STARTING CLOUD FETCH ---");

    if (typeof firebase === 'undefined' || firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn("[Recovery] Firebase disabled. Using local database.");
        window.isDataInitialized = true;
        return;
    }

    const fourHundredDaysAgo = Date.now() - (400 * 24 * 60 * 60 * 1000);

    const fetchPromises = collectionsToSync.map(key => {
        return new Promise((resolve) => {
            let dbRef = firebase.database().ref(getDbPath(key));

            // OPTIMIZATION: Only fetch last 400 days for heavy transactional collections
            if (key === 'invoices' || key === 'expenses') {
                console.log(`[Recovery] Applying 400-day optimization for ${key}...`);
                dbRef = dbRef.orderByChild('timestamp').startAt(fourHundredDaysAgo);
            }

            console.log(`[Recovery] Requesting ${key} from cloud...`);

            dbRef.once('value', async (snapshot) => {
                let cloudData = snapshot.val();

                if (cloudData !== null) {
                    console.log(`[Recovery] Data found for ${key}. Overwriting local cache.`);
                    if (typeof cloudData === 'object' && !Array.isArray(cloudData)) cloudData = Object.values(cloudData);
                    if (Array.isArray(cloudData)) {
                        cloudData = cloudData.filter(item => item !== null && typeof item === 'object');
                    }
                    window.__syncingFromFirebase = true;
                    await originalSetItem.call(localforage, key, cloudData);
                    window.__syncingFromFirebase = false;
                } else {
                    console.log(`[Multi-Tenant] Cloud is empty for ${key}. Checking local redundancy.`);

                    // REDUNDANCY CHECK: If local storage has data, don't zero it yet!
                    const localBackup = localStorage.getItem(key);
                    if (localBackup && (key === 'expenses' || key === 'invoices')) {
                        try {
                            const parsed = JSON.parse(localBackup);
                            if (parsed && parsed.length > 0) {
                                console.log(`[Recovery] Cloud empty but localStorage has ${key}. Using local data.`);
                                await originalSetItem.call(localforage, key, parsed);
                                resolve();
                                return;
                            }
                        } catch (e) { }
                    }

                    window.__syncingFromFirebase = true;
                    await originalSetItem.call(localforage, key, []); // ZERO STATE PROMISE!
                    window.__syncingFromFirebase = false;
                }
                resolve();
            }, (err) => {
                console.error(`[Recovery] Critical fetch error for ${key}:`, err);
                resolve();
            });

            dbRef.on('value', async (snapshot) => {
                if (!window.isDataInitialized) return;

                let cloudData = snapshot.val();
                let sanitized = [];

                if (cloudData !== null) {
                    if (typeof cloudData === 'object' && !Array.isArray(cloudData)) sanitized = Object.values(cloudData);
                    else if (Array.isArray(cloudData)) sanitized = cloudData;
                    sanitized = sanitized.filter(item => item !== null && typeof item === 'object');
                }

                console.log(`[Realtime-Sync] Update received for ${key}: ${sanitized.length} items.`);

                window.__syncingFromFirebase = true;
                await originalSetItem.call(localforage, key, sanitized);
                window.__syncingFromFirebase = false;

                if (window.appLogic) {
                    if (key === 'services') window.appLogic.services = sanitized;
                    if (key === 'delivery_options') {
                        window.appLogic.deliveryOptions = sanitized;
                        window.appLogic.updateCartUI();
                    }
                    if (window.isDataInitialized) {
                        window.appLogic.refreshActiveView();
                    }
                }
            });
        });
    });

    await Promise.all(fetchPromises);
    window.isDataInitialized = true;
    console.log("[Recovery] --- SYSTEM READY (READ-WRITE ENABLED) ---");
}
// ---------------------------------------------

// Version: 1.0.3 (Firebase Sync Enabled)
// Professional Loading Guard Logic
const hideInitialLoader = () => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            loader.style.display = 'none';
        }, 600); // Matches the 0.6s CSS transition
    }
};

const getLocalYMD = (d) => {
    if (!d) d = new Date();
    if (!(d instanceof Date) || isNaN(d)) d = new Date(d);
    // Hard fallback if the parsed date is STILL invalid (e.g., malformed ghosts)
    if (isNaN(d.getTime())) d = new Date();

    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
};

window.appLogic = {
    currentViewDate: getLocalYMD(), // Defaults to Today (Local KSA Time)

    // ── TIME-TRAVEL: Change date picker → Re-render Dashboard & History ──
    filterReportsByDate(val) {
        const selected = val || getLocalYMD();
        this.currentViewDate = selected;    // Single source of truth
        this.reportFilterDate = (selected !== getLocalYMD()) ? selected : null; // null = Live Shift
        this.renderReports();               // Re-render KPI cards for selected date
        this.renderHistory();               // Re-render invoice table for selected date
        // NOTE: No Z-Report or print window is triggered here — view only.
    },

    resetReportFilter() {
        this.currentViewDate = getLocalYMD();
        this.reportFilterDate = null;       // Return to Live Shift mode
        this.renderReports();
        this.renderHistory();
    },

    toggleLaundryFields() {
        const container = document.getElementById('laundry-fields-container');
        const btn = document.getElementById('laundry-toggle-btn');
        if (!container || !btn) return;

        container.classList.toggle('expanded');

        if (container.classList.contains('expanded')) {
            btn.innerHTML = 'إخفاء بيانات المغسلة ⬆️';
        } else {
            btn.innerHTML = 'إضافة مغسلة شريكة (اختياري) ⬇️';
        }
    },

    toggleMobileCart() {
        const cartSection = document.getElementById('cart-section');
        const icon = document.getElementById('mobile-cart-icon');
        if (!cartSection) return;

        cartSection.classList.toggle('cart-open');

        if (cartSection.classList.contains('cart-open')) {
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        } else {
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        }
    },

    toggleGoldenDrawer() {
        const footer = document.getElementById('cart-footer');
        const icon = document.getElementById('golden-trigger-icon');
        if (!footer) return;

        footer.classList.toggle('drawer-open');

        if (footer.classList.contains('drawer-open')) {
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        } else {
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        }
    },

    _version: '1.0.3',
    paymentMethod: 'cash',
    currentLang: 'ar',
    fastBatchState: { type: 'wash_iron', speed: 'normal' },
    cart: [],
    deliveryFee: 0,
    customer: { phone: '', name: '' },
    modalState: { item: null, type: 'iron', speed: 'normal', qty: 1, price: 0 },
    currentCategory: 'all',
    editingInvoiceId: null,
    services: [],
    deliveryOptions: [],

    // THEME MANAGEMENT (Light/Dark)
    async initTheme() {
        const savedTheme = localStorage.getItem('sahab-theme') || 'dark';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sahab-theme', theme);

        // Update Toggle Icon
        const iconEl = document.getElementById('theme-status-icon');
        if (iconEl) {
            // Sun for light mode, Moon for dark mode
            iconEl.innerHTML = theme === 'light' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        }

        // Update Meta theme-color for mobile browsers
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#FFFFFF');

        console.log(`[Theme] Switched to ${theme}`);
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        this.setTheme(next);

        // Brief toast for feedback
        const msg = next === 'dark' ? 'تم تفعيل المظهر الداكن 🌙' : 'تم تفعيل المظهر الفاتح ☀️';
        this.showToast ? this.showToast(msg) : console.log(msg);
    },

    async init() {
        await this.initTheme();

        const savedLang = localStorage.getItem('sahab-lang') || 'ar';
        this.currentLang = savedLang;
        const langEl = document.getElementById('ui-language');
        if (langEl) langEl.value = savedLang;

        console.log("[App] !!! STARTING CRITICAL INITIALIZATION !!!");
        console.log("[App] Environment:", window.location.protocol);

        localforage.config({ name: 'SahabPOS', storeName: 'pos_data' });

        // Required Log: Verify local storage is accessible
        try {
            await localforage.getItem('test');
            console.log("Local storage loaded");
        } catch (e) {
            console.error("Local storage failed to load:", e);
        }

        console.log("[App] Waiting strictly for Firebase Heartbeat...");

        // 1. BEG FIREBASE: We do not touch local storage until we hear from the cloud.
        // This prevents "Default to empty" from wiping your business data.
        await initFirebaseSync();

        // 2. FETCH FINAL STATE: After Firebase has updated localforage, we pull it into memory.
        let savedServices = await localforage.getItem('services');
        this.services = (savedServices && savedServices.length > 0) ? savedServices : DefaultServices;

        let savedDelivery = await localforage.getItem('delivery_options');
        this.deliveryOptions = (savedDelivery && savedDelivery.length > 0) ? savedDelivery : DefaultDeliveryOptions;

        // Auto-Restore: If we had to use defaults, save them back to ensure they persist and sync
        if (!savedServices || savedServices.length === 0) {
            await localforage.setItem('services', DefaultServices);
            await manualSyncToCloud('services', DefaultServices);
        }
        if (!savedDelivery || savedDelivery.length === 0) {
            await localforage.setItem('delivery_options', DefaultDeliveryOptions);
            await manualSyncToCloud('delivery_options', DefaultDeliveryOptions);
        }

        this.deliveryFee = 0; // Fix 2: Strict 0.00 SAR initialization on load
        console.log("[App] Initialization pulse complete. Data is now protected and loaded.");

        await this.updateLaundryDatalist();
        this.renderItems();

        // i18n auto-apply on load
        this.applyLanguage();
        this.updateCartUI();
        await this.initLaundryBalances(); // Initialize cumulative store
    },

    async initLaundryBalances() {
        // One-time seeding: If laundry_balances doesn't exist, calculate from all unpaid invoices
        const existing = await localforage.getItem('laundry_balances');
        if (existing) return;

        console.log("[Laundry] Seeding cumulative balances from existing history...");
        const invoices = await localforage.getItem('invoices') || [];
        const balances = {};

        invoices.forEach(i => {
            if (!i || !i.partnerLaundryName || i.laundryPaid || i.isCancelled) return;
            const name = i.partnerLaundryName.trim();
            const hood = (i.partnerLaundryNeighborhood || '').trim();
            const key = `${name}|${hood}`;
            const cost = parseFloat(i.laundryCost || i.partnerLaundryCost || 0);
            if (cost > 0) {
                if (!balances[key]) balances[key] = { balance: 0 };
                balances[key].balance += cost;
            }
        });

        await localforage.setItem('laundry_balances', balances);
        localStorage.setItem('laundry_balances', JSON.stringify(balances));
    },

    async updateLaundryDatalist() {
        try {
            // Memory Source 1: localStorage history (Persistent 'laundryHistory')
            const history = JSON.parse(localStorage.getItem('laundryHistory') || '{"names":[], "hoods":[]}');
            const laundries = new Set(history.names);
            const hoods = new Set(history.hoods);

            // Memory Source 2: Dynamic scan (Fallback/Auto-discovery from local DB)
            const invs = await localforage.getItem('invoices') || [];
            invs.forEach(i => {
                if (i && i.partnerLaundryName && i.partnerLaundryName.trim() !== '') {
                    laundries.add(i.partnerLaundryName.trim());
                }
                if (i && i.partnerLaundryNeighborhood && i.partnerLaundryNeighborhood.trim() !== '') {
                    hoods.add(i.partnerLaundryNeighborhood.trim());
                }
            });

            const datalist = document.getElementById('saved-laundries');
            if (datalist) {
                datalist.innerHTML = Array.from(laundries).sort().map(name => `<option value="${name}">`).join('');
            }

            const hoodDatalist = document.getElementById('saved-neighborhoods');
            if (hoodDatalist) {
                hoodDatalist.innerHTML = Array.from(hoods).sort().map(hood => `<option value="${hood}">`).join('');
            }

            // Sync back to history if unique discoveries were found
            localStorage.setItem('laundryHistory', JSON.stringify({
                names: Array.from(laundries),
                hoods: Array.from(hoods)
            }));
        } catch (e) { console.error('Error updating datalists', e); }
    },

    // UI Routing
    toggleMobileCart() {
        const cartSection = document.getElementById('cart-section');
        const icon = document.getElementById('mobile-cart-icon');
        if (cartSection && cartSection.classList.contains('cart-open')) {
            cartSection.classList.remove('cart-open');
            if (icon) icon.className = 'fa-solid fa-chevron-up';
        } else if (cartSection) {
            cartSection.classList.add('cart-open');
            if (icon) icon.className = 'fa-solid fa-chevron-down';
        }
    },
    switchView(viewId) {
        console.log('Switching to view:', viewId);
        try {
            // Remove active from all views and nav buttons
            document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

            // Show target view
            const targetView = document.getElementById('view-' + viewId);
            if (targetView) {
                targetView.classList.add('active');
                console.log('Class "active" added to:', targetView.id, 'Display:', getComputedStyle(targetView).display);
            } else {
                console.error('Target view NOT found:', 'view-' + viewId);
            }

            // Highlight matching nav button
            let matchingBtn = document.querySelector(`.nav-btn[onclick*="switchView('${viewId}')"]`) ||
                document.querySelector(`.nav-btn[onclick*='switchView("${viewId}")']`);
            if (matchingBtn) matchingBtn.classList.add('active');

            // Trigger rendering
            console.log('Rendering content for:', viewId);
            localStorage.setItem('sahab_active_view', viewId); // Persistent state

            if (viewId === 'history') this.renderHistory();
            else if (viewId === 'customers') this.renderCustomers();
            else if (viewId === 'inventory') this.renderInventory();
            else if (viewId === 'reports') this.renderReports();
            else if (viewId === 'expenses') this.renderExpenses();
            else if (viewId === 'admin') this.renderAdmin();

        } catch (err) {
            console.error('Routing Error:', err);
        }
    },
    refreshActiveView() {
        const currentView = document.querySelector('.view-section.active');
        if (!currentView) return;
        const vId = currentView.id.replace('view-', '');
        console.log(`[UI] Refreshing Active View: ${vId}`);
        if (vId === 'history') this.renderHistory();
        else if (vId === 'customers') this.renderCustomers();
        else if (vId === 'inventory') this.renderInventory();
        else if (vId === 'reports') this.renderReports();
        else if (vId === 'expenses') this.renderExpenses();
        else if (vId === 'admin') this.renderAdmin();
    },

    // Filters
    setCategory(cat, btn) {
        document.querySelectorAll('.btn-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = cat;
        this.filterItems();
    },

    filterItems() {
        const term = document.getElementById('item-search').value.toLowerCase();
        let filtered = this.services;

        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(i => i.cat === this.currentCategory);
        }

        if (term) {
            filtered = filtered.filter(i => i.name.includes(term));
        }

        this.renderItems(filtered);
    },

    // POS Items
    renderItems(data) {
        if (!data) data = this.services;
        const grid = document.getElementById('items-grid');
        grid.innerHTML = '';
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `<div class="item-icon"><i class="fa-solid ${item.icon}"></i></div><div class="item-name">${this.translate(item.name)}</div>`;
            card.onclick = () => this.fastAddToCart(item);
            grid.appendChild(card);
        });
    },

    // --- FAST BATCH ENTRY OPERATIONS ---
    setFastBatchType(type, btn) {
        document.querySelectorAll('#fb-type-wash_iron, #fb-type-iron, #fb-type-wash').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.fastBatchState.type = type;
    },

    setFastBatchSpeed(speed, btn) {
        document.querySelectorAll('#fb-speed-normal, #fb-speed-express').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.fastBatchState.speed = speed;
    },

    fastAddToCart(item) {
        const { type, speed } = this.fastBatchState;
        let basePrice = 0;

        if (item.prices) {
            basePrice = parseFloat(item.prices[type]) || 0;
            if (speed === 'express') {
                const fee = item.expressFee;
                if (typeof fee === 'object') {
                    basePrice += (parseFloat(fee[type]) || 0);
                } else {
                    basePrice += (parseFloat(fee) || 0);
                }
            }
        }

        const isVatActive = !!(window.tenantSettings && window.tenantSettings.taxNumber && window.tenantSettings.taxNumber.trim() !== "");
        if (isVatActive) {
            basePrice = basePrice * 1.15;
        }

        if (basePrice <= 0) {
            if (this.showToast) {
                this.showToast('هذه الخدمة غير متوفرة بهذا الخيار');
            } else {
                alert('هذه الخدمة غير متوفرة بهذا الخيار');
            }
            return;
        }

        // Check for exact duplicate in cart
        let existing = this.cart.find(i => i.id === item.id && i.type === type && i.speed === speed);
        if (existing) {
            existing.qty += 1;
        } else {
            this.cart.push({ // Added push() instead of unshift() for chronological order
                id: item.id,
                name: item.name,
                type: type,
                speed: speed,
                qty: 1,
                unitPrice: basePrice
            });
        }

        this.updateCartUI();

        // Optional quick tap feedback:
        if (this.showToast) {
            let tLbl = type === 'iron' ? 'كوي' : (type === 'wash_iron' ? 'غسيل وكوي' : 'غسيل');
            let sLbl = speed === 'normal' ? 'عادي' : 'مستعجل';
            this.showToast(`تمت إضافة: ${item.name} (${tLbl} - ${sLbl})`);
        }
    },

    // Modal Operations
    openModal(item) {
        this.modalState = { item: item, type: 'iron', speed: 'normal', qty: 1, price: 0 };
        document.getElementById('modal-item-name').innerText = item.name;

        // reset buttons visually
        document.querySelectorAll('#item-modal .btn-toggle').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-type-iron').classList.add('active');
        document.getElementById('btn-speed-normal').classList.add('active');
        document.getElementById('qty-input').value = 1;

        this.evalModalPrice();
        document.getElementById('item-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('item-modal').classList.add('hidden');
    },

    setModalType(type, btn) {
        document.querySelectorAll('#btn-type-iron, #btn-type-wash_iron, #btn-type-wash').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.modalState.type = type;
        this.evalModalPrice();
    },

    setModalSpeed(speed, btn) {
        document.getElementById('btn-speed-normal').classList.remove('active');
        document.getElementById('btn-speed-express').classList.remove('active');
        btn.classList.add('active');
        this.modalState.speed = speed;
        this.evalModalPrice();
    },

    changeQty(delta) {
        let newQty = this.modalState.qty + delta;
        if (newQty < 1) newQty = 1;
        this.modalState.qty = newQty;
        document.getElementById('qty-input').value = newQty;
        this.evalModalPrice();
    },

    setQty(val) {
        let newQty = parseInt(val);
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        this.modalState.qty = newQty;
        document.getElementById('qty-input').value = newQty;
        this.evalModalPrice();
    },

    evalModalPrice() {
        const { item, type, speed, qty } = this.modalState;
        let basePrice = 0;

        if (item.prices) {
            basePrice = parseFloat(item.prices[type]) || 0;
            if (speed === 'express') {
                const fee = item.expressFee;
                if (typeof fee === 'object') {
                    basePrice += (parseFloat(fee[type]) || 0);
                } else {
                    basePrice += (parseFloat(fee) || 0);
                }
            }
        }

        const isVatActive = !!(window.tenantSettings && window.tenantSettings.taxNumber && window.tenantSettings.taxNumber.trim() !== "");
        if (isVatActive) {
            basePrice = basePrice * 1.15;
        }

        this.modalState.price = basePrice * qty;
        const btnAdd = document.getElementById('btn-add-to-cart');

        if (basePrice <= 0) {
            document.getElementById('modal-unit-price').innerText = 'غير متوفر';
            document.getElementById('modal-total-price').innerText = '(غير متوفر)';
            btnAdd.disabled = true;
            btnAdd.style.opacity = 0.5;
        } else {
            document.getElementById('modal-unit-price').innerText = basePrice.toFixed(2);
            document.getElementById('modal-total-price').innerText = `(${this.modalState.price.toFixed(2)} ر.س)`;
            btnAdd.disabled = false;
            btnAdd.style.opacity = 1;
        }
    },

    // Cart Operations
    addToCart() {
        if (this.modalState.price <= 0) return alert('هذه الخدمة غير متوفرة.');

        let existing = this.cart.find(i => i.id === this.modalState.item.id && i.type === this.modalState.type && i.speed === this.modalState.speed);
        if (existing) {
            existing.qty += this.modalState.qty;
        } else {
            this.cart.push({ // Added push() instead of unshift() for chronological order
                id: this.modalState.item.id,
                name: this.modalState.item.name,
                type: this.modalState.type,
                speed: this.modalState.speed,
                qty: this.modalState.qty,
                unitPrice: this.modalState.price / this.modalState.qty
            });
        }

        this.updateCartUI();
        this.closeModal();
    },

    removeFromCart(idx) {
        this.cart.splice(idx, 1);
        this.updateCartUI();
    },

    clearCart() {
        if (confirm('إفراغ السلة؟')) {
            this.cart = [];
            this.deliveryFee = 0; // Fix: Reset delivery fee on manual clear
            this.editingInvoiceId = null; // Reset edit mode
            this.updateCartUI();
        }
    },

    setDelivery(amount, btn) {
        document.querySelectorAll('.btn-delivery').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.deliveryFee = amount;
        this.updateCartUI();
    },

    updateCartUI() {
        const container = document.getElementById('cart-items');
        container.innerHTML = '';

        if (this.cart.length === 0) {
            container.innerHTML = `<div class="empty-cart-msg">${this.currentLang === 'en' ? 'Cart is empty, please select items.' : 'السلة فارغة، يرجى اختيار أصناف.'}</div>`;
        } else {
            this.cart.forEach((item, index) => {
                let tLbl = this.currentLang === 'en'
                    ? (item.type === 'iron' ? 'Iron Only' : (item.type === 'wash_iron' ? 'Wash & Iron' : 'Wash Only'))
                    : (item.type === 'iron' ? 'كوي فقط' : (item.type === 'wash_iron' ? 'غسيل وكوي' : 'غسيل فقط'));
                let sLbl = this.currentLang === 'en'
                    ? (item.speed === 'normal' ? 'Normal' : 'Express')
                    : (item.speed === 'normal' ? 'عادي' : 'مستعجل');

                container.innerHTML += `
                    <div class="cart-item">
                        <div class="cart-item-header">
                            <div class="cart-item-main-info">
                                <span class="cart-item-title">${this.translate(item.name)}</span>
                                <span class="cart-item-qty num-en">x${item.qty}</span>
                            </div>
                            <div class="cart-item-price-block">
                                <div class="cart-item-price num-en">${(item.unitPrice * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <button class="btn-remove" onclick="appLogic.removeFromCart(${index})">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="cart-item-meta">${tLbl} - ${sLbl}</div>
                    </div>
                `;
            });
        }

        // Auto-Scroll to Bottom for immediate visibility of new items
        container.scrollTop = container.scrollHeight;

        const subt = this.cart.reduce((s, i) => s + (i.unitPrice * i.qty), 0);

        // Fix 1: Strict Total Logic
        if (this.cart.length === 0) {
            this.deliveryFee = 0;
            const zeroValue = (0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.getElementById('grand-total').innerText = zeroValue;
            if (document.getElementById('mobile-grand-total')) document.getElementById('mobile-grand-total').innerText = zeroValue;
            if (document.getElementById('golden-trigger-total')) document.getElementById('golden-trigger-total').innerText = zeroValue;
        } else {
            const finalValue = (subt + this.deliveryFee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.getElementById('grand-total').innerText = finalValue;
            if (document.getElementById('mobile-grand-total')) document.getElementById('mobile-grand-total').innerText = finalValue;
            if (document.getElementById('golden-trigger-total')) document.getElementById('golden-trigger-total').innerText = finalValue;
        }

        this.renderCheckoutDeliveryButtons();
    },

    syncCustomerData(source) {
        let name, phone;
        if (source === 'sidebar') {
            name = (document.getElementById('sidebar-customer-name') || {}).value || '';
            phone = (document.getElementById('sidebar-customer-phone') || {}).value || '';

            // Sync to modal
            const modalName = document.getElementById('checkout-customer-name');
            const modalPhone = document.getElementById('checkout-customer-phone');
            if (modalName) modalName.value = name;
            if (modalPhone) modalPhone.value = phone;
        } else {
            name = (document.getElementById('checkout-customer-name') || {}).value || '';
            phone = (document.getElementById('checkout-customer-phone') || {}).value || '';

            // Sync back to sidebar
            const sideName = document.getElementById('sidebar-customer-name');
            const sidePhone = document.getElementById('sidebar-customer-phone');
            if (sideName) sideName.value = name;
            if (sidePhone) sidePhone.value = phone;
        }
        this.customer.name = name;
        this.customer.phone = phone;
    },

    closePaymentModal() {
        document.getElementById('payment-method-modal').classList.add('hidden');
        this.settlingInvoiceId = null;
        const payLaterBtn = document.getElementById('method-paylater');
        if (payLaterBtn) {
            payLaterBtn.style.display = 'flex'; // Reset to default visibility
        }
    },

    async finalizeWithPayment(method) {
        if (this.settlingInvoiceId) {
            let invs = await localforage.getItem('invoices') || [];
            const idx = invs.findIndex(i => i && i.id === this.settlingInvoiceId);
            if (idx === -1) {
                this.closePaymentModal();
                return;
            }

            invs[idx].paymentStatus = 'paid';
            invs[idx].paymentMethod = method;

            // 🔄 CRITICAL LOGIC: Overwrite the timestamp & date
            invs[idx].timestamp = Date.now();
            invs[idx].date = getLocalYMD();

            await localforage.setItem('invoices', invs);
            await manualSyncToCloud('invoices', invs);

            const settlementId = this.settlingInvoiceId;
            this.closePaymentModal();

            await this.renderHistory();
            await this.renderReports();

            const translatedMethod = this.translate ? this.translate(method === 'network' ? 'شبكة' : (method === 'cash' ? 'نقدي' : method)) : method;
            this.showToast(`تم سداد الفاتورة ${settlementId} بواسطة [${translatedMethod}] وإدراجها ضمن مبيعات اليوم ✓`);
            return;
        }

        if (!this.pendingInvoice) return;
        this.paymentMethod = method;
        this.pendingInvoice.paymentMethod = method;
        this.pendingInvoice.paymentStatus = (method === 'pay_later') ? 'unpaid' : 'paid';

        // Re-generate thermal HTML with the selected payment method
        document.getElementById('invoice-preview-container').innerHTML = this.generateThermalHTML(this.pendingInvoice, 'preview-qr-render');

        // Re-render QR for preview
        const bizNamePreview = (window.tenantSettings || {}).name || 'سحاب';
        const zatcaQRBase64 = generateZatcaBase64(bizNamePreview, this.pendingInvoice.taxNumber || "000000000000000", this.pendingInvoice.timestamp, this.pendingInvoice.grandTotal, this.pendingInvoice.vatAmount);

        const qrBox = document.getElementById('preview-qr-render');
        if (qrBox) {
            qrBox.innerHTML = '';
            new QRCode(qrBox, {
                text: zatcaQRBase64,
                width: 100, height: 100,
                colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.L
            });
        }

        // WE DELAY THE MODAL CLOSE UNTIL CHECKOUT COMPLETES TO PREVENT UI FLICKER/JUMP
        setTimeout(async () => {
            await this.confirmCheckout(true);
            // Close the modal smoothly only after rendering resolves
            setTimeout(() => {
                this.closePaymentModal();
            }, 300);
        }, 50);
    },

    setPaymentMethod(method) {
        this.paymentMethod = method;
        const cashBtn = document.getElementById('pay-cash');
        const netBtn = document.getElementById('pay-network');
        if (cashBtn) cashBtn.classList.toggle('active', method === 'cash');
        if (netBtn) netBtn.classList.toggle('active', method === 'network');
    },

    renderCheckoutDeliveryButtons() {
        const container = document.getElementById('checkout-delivery-buttons');
        if (!container) return;
        container.innerHTML = '';
        this.deliveryOptions.forEach(opt => {
            const isActive = this.deliveryFee === opt.amount;
            container.innerHTML += `
                <button class="btn-delivery ${isActive ? 'active' : ''}" 
                        onclick="appLogic.setDelivery(${opt.amount}, this);">
                    ${opt.name}${opt.amount > 0 ? ': ' + opt.amount + ' ر.س' : ''}
                </button>
            `;
        });
    },

    updateCheckoutTotal() {
        // Obsolete function, safely bypassed.
    },

    renderDeliveryButtons() {
        const container = document.querySelector('.delivery-buttons');
        if (!container) return;
        container.innerHTML = '';
        this.deliveryOptions.forEach(opt => {
            const isActive = this.deliveryFee === opt.amount;
            container.innerHTML += `
                <button class="btn-delivery ${isActive ? 'active' : ''}" 
                        onclick="appLogic.setDelivery(${opt.amount}, this)">
                    ${opt.name}${opt.amount > 0 ? ': ' + opt.amount + ' ر.س' : ''}
                </button>
            `;
        });
    },

    // Customer
    async handleCustomerPhoneBlur(phone) {
        this.customer.phone = phone.trim();
        if (this.customer.phone) {
            const list = await localforage.getItem('customers') || [];
            const found = list.find(c => c.phone === this.customer.phone);
            if (found) {
                document.getElementById('customer-name').value = found.name;
                this.customer.name = found.name;
            }
        }
    },
    updateCustomerName(name) {
        this.customer.name = name.trim();
    },

    // Checkout & Invoice
    async previewCheckout() {
        console.log('Button Clicked: previewCheckout - Start processing checkout preview');
        if (this.cart.length === 0) return alert('السلة فارغة!');

        const custNameInput = document.getElementById('checkout-customer-name') ? document.getElementById('checkout-customer-name').value.trim() : '';
        const custPhoneInput = document.getElementById('checkout-customer-phone') ? document.getElementById('checkout-customer-phone').value.trim() : '';

        // Phone is optional — but if entered it MUST be a valid Saudi number (10 digits, starts with 05)
        if (custPhoneInput && !/^05\d{8}$/.test(custPhoneInput)) {
            const errEl = document.getElementById('checkout-phone-error');
            if (errEl) { errEl.textContent = 'رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05'; errEl.style.display = 'block'; }
            document.getElementById('checkout-customer-phone').focus();
            return;
        }

        let cName = custNameInput || 'عميل نقدي';
        let cPhone = custPhoneInput || '0000000000';

        // Update current customer object for saving later
        this.customer = { name: cName, phone: cPhone };

        // Generate Invoice Num
        let invoices = await localforage.getItem('invoices') || [];
        let newInvId = this.editingInvoiceId;

        if (!newInvId) {
            let max = 100;
            invoices.forEach(i => {
                if (i && i.id) {
                    let num = parseInt(i.id.replace('INV-', ''));
                    if (num > max) max = num;
                }
            });
            newInvId = String(max + 1).padStart(6, '0');
            localStorage.setItem('sahab_invoiceCounter', max + 1);
        }

        // Prepare Invoice Details (Not Saved Yet)
        let subT = this.cart.reduce((s, i) => s + (i.unitPrice * i.qty), 0);
        let grT = subT + this.deliveryFee;

        let pName = document.getElementById('pos-laundry-name') ? document.getElementById('pos-laundry-name').value.trim() : '';
        let pHood = document.getElementById('pos-laundry-hood') ? document.getElementById('pos-laundry-hood').value.trim() : '';
        let pCostElem = document.getElementById('pos-laundry-cost');
        let pCostStr = pCostElem ? pCostElem.value.trim() : '';
        let pCost = parseFloat(pCostStr) || 0;
        let pPaid = document.getElementById('pos-laundry-paid') ? document.getElementById('pos-laundry-paid').value === 'true' : false;

        // Strict Mandatory Validation
        if (pName || pHood || pCostStr !== '') {
            if (!pName || !pHood || pCostStr === '') {
                alert('الرجاء إكمال كافة بيانات المغسلة (الاسم، الحي، والتكلفة) للمتابعة');
                return;
            }
        }

        let invoiceData = {
            id: newInvId, timestamp: Date.now(), customer: { phone: cPhone, name: cName },
            items: [].concat(this.cart),
            deliveryFee: parseFloat(this.deliveryFee) || 0,
            total: parseFloat(grT) || 0,
            grandTotal: parseFloat(grT) || 0,
            laundryCost: pCost,
            partnerLaundryCost: pCost,
            partnerLaundryName: pName,
            partnerLaundryNeighborhood: pHood,
            laundryPaid: pPaid,
            status: 'completed',
            paymentMethod: this.paymentMethod || 'cash',
            taxNumber: (window.tenantSettings || {}).taxNumber || ''
        };

        const _total = parseFloat(grT) || 0;
        const _hasValTax = !!((window.tenantSettings || {}).taxNumber && (window.tenantSettings || {}).taxNumber.trim() !== '');
        const _subtotalNet = _hasValTax ? (_total / 1.15) : _total;
        const _vatAmount = _total - _subtotalNet;

        invoiceData.subtotalNet = _subtotalNet;
        invoiceData.vatAmount = _vatAmount;

        this.pendingInvoice = invoiceData;

        // Fix 5: Open Payment Method Modal directly
        const payLaterBtn = document.getElementById('method-paylater');
        if (payLaterBtn) {
            payLaterBtn.style.display = 'flex';
        }
        document.getElementById('payment-method-modal').classList.remove('hidden');
    },

    async confirmCheckout() {
        console.log('Button Clicked: confirmCheckout - Start confirming invoice');
        if (!this.pendingInvoice) return;

        // Save Customer intelligently
        if (this.customer.phone && this.customer.phone !== '0000000000') {
            let customers = await localforage.getItem('customers') || [];
            let cIdx = customers.findIndex(c => c.phone === this.customer.phone);
            let cData = { phone: this.customer.phone, name: this.customer.name || '', timestamp: Date.now() };
            if (cIdx >= 0) customers[cIdx] = cData; else customers.push(cData);
            await localforage.setItem('customers', customers);
            await manualSyncToCloud('customers', customers);
        }

        // Pass to Wafeq Accounting Engine
        this.pendingInvoice = await accountingEngine.postTransaction(this.pendingInvoice);

        // Save Invoice to DB
        let invoices = await localforage.getItem('invoices') || [];

        if (this.editingInvoiceId) {
            let idx = invoices.findIndex(i => i.id === this.editingInvoiceId);
            if (idx >= 0) invoices[idx] = this.pendingInvoice;
            else invoices.unshift(this.pendingInvoice);
            this.editingInvoiceId = null; // Reset after use
        } else {
            invoices.unshift(this.pendingInvoice);
        }

        await localforage.setItem('invoices', invoices);
        await manualSyncToCloud('invoices', invoices);

        this.currentInvoice = this.pendingInvoice;
        this.pendingInvoice = null;

        // Instant Auto-Print
        if (this.currentInvoice) {
            this.printInvoice(this.currentInvoice);
        }

        // WhatsApp sharing
        const _waBtnEl = document.getElementById('btn-whatsapp-share');
        if (_waBtnEl) _waBtnEl.style.display = 'block';

        this.updateCartUI();
        await this.updateLaundryDatalist();

        // Final hard reset for next checkout cycle
        this.deliveryFee = 0;
        this.cart = [];

        // Reset Fast Checkout UI Inputs
        const cNameInp = document.getElementById('checkout-customer-name');
        const cPhoneInp = document.getElementById('checkout-customer-phone');
        if (cNameInp) cNameInp.value = '';
        if (cPhoneInp) cPhoneInp.value = '';

        this.updateCartUI();
    },
    closeInvoicePreview() {
        document.getElementById('invoice-preview-modal').classList.add('hidden');

        // 🔄 COMPLETE POS STATE RESET FOR NEXT INVOICE
        this.currentInvoice = null;
        this.pendingInvoice = null;
        this.paymentMethod = 'cash';

        // Reset Modal actions state for the next time it opens
        const previewActions = document.getElementById('modal-actions-preview');
        const successActions = document.getElementById('modal-actions-success');
        if (previewActions) previewActions.classList.remove('hidden');
        if (successActions) successActions.classList.add('hidden');
    },

    // Live Saudi phone validator — called oninput on the phone field
    validateSaudiPhone(input) {
        // Strip any non-digit characters typed by accident
        input.value = input.value.replace(/\D/g, '').slice(0, 10);

        const errEl = document.getElementById('phone-error');
        if (!errEl) return;

        const v = input.value;
        if (v.length === 0) {
            // Empty is fine (field is optional)
            errEl.style.display = 'none';
            errEl.textContent = '';
            input.style.borderColor = '';
        } else if (!/^05/.test(v)) {
            errEl.textContent = 'رقم الجوال يجب أن يبدأ بـ 05';
            errEl.style.display = 'block';
            input.style.borderColor = '#ef4444';
        } else if (v.length < 10) {
            errEl.textContent = `أدخل ${10 - v.length} أرقام إضافية`;
            errEl.style.display = 'block';
            input.style.borderColor = '#f59e0b';
        } else {
            // Valid!
            errEl.style.display = 'none';
            errEl.textContent = '';
            input.style.borderColor = '#22c55e';
        }
    },

    async connectBluetoothPrinter() {
        try {
            var device = await navigator.bluetooth.requestDevice({
                filters: [
                    { namePrefix: 'Inner' },
                    { namePrefix: 'InnerPrinter' },
                    { namePrefix: 'BlueTooth Printer' },
                    { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }
                ],
                optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '49535343-fe7d-4ae5-8fa9-9fafd205e455', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2', '00001101-0000-1000-8000-00805f9b34fb']
            }).catch(function () {
                return navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '49535343-fe7d-4ae5-8fa9-9fafd205e455', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2', '00001101-0000-1000-8000-00805f9b34fb']
                });
            });

            var server = await device.gatt.connect();
            var services = await server.getPrimaryServices();
            var printerChar = null;
            for (var i = 0; i < services.length; i++) {
                var chars = await services[i].getCharacteristics();
                for (var j = 0; j < chars.length; j++) {
                    if (chars[j].properties.write || chars[j].properties.writeWithoutResponse) {
                        printerChar = chars[j];
                        break;
                    }
                }
                if (printerChar) break;
            }

            if (!printerChar) throw new Error('لا توجد خدمة طباعة متاحة في هذا الجهاز');

            window.bluetoothCharacteristic = printerChar;
            window.connectedBluetoothPrinter = device;

            var btnText = document.getElementById('bt-printer-status');
            if (btnText) btnText.innerText = 'متصل: ' + device.name;

            alert('تم الاتصال بالطابعة بنجاح!');
        } catch (err) {
            alert('لم يتم التوصيل: ' + err.message);
        }
    },

    async printThermalReceipt() {
        if (!this.currentInvoice) return;
        await this.printInvoice(this.currentInvoice);
    },


    shareInvoiceWhatsApp() {
        const inv = this.currentInvoice;
        if (!inv) return alert('لا توجد فاتورة حالية للمشاركة.');

        // Determine target number (optional)
        const rawPhone = (inv.customer && inv.customer.phone) || '';
        let waTarget = '';

        if (rawPhone && rawPhone !== '0000000000') {
            let digits = rawPhone.replace(/\D/g, '');
            if (!digits.startsWith('966')) {
                digits = digits.startsWith('0') ? '966' + digits.slice(1) : '966' + digits;
            }
            waTarget = digits;
        }

        // Build pre-filled message
        const storeName = (window.tenantSettings || {}).name || 'المغسلة';
        const invId = inv.id || '';
        const total = (inv.grandTotal || inv.total || 0).toFixed(2);
        const msg = encodeURIComponent(
            `مرحباً ${inv.customer.name || 'عزيزي العميل'}،\n` +
            `شكراً لتعاملكم مع ${storeName}.\n` +
            `فاتورتكم رقم ${invId} بمبلغ ${total} ر.س جاهزة.\n` +
            `نسعد بخدمتكم دائماً 😊\n` +
            `— نظام سحاب | Sahab POS`
        );

        const url = `https://wa.me/${waTarget}?text=${msg}`;
        window.open(url, '_blank');
    },

    async downloadDigitalPDF(event) {
        console.log('Button Clicked: downloadDigitalPDF - Generating ERP Invoice');
        if (!this.currentInvoice) return;

        const data = this.currentInvoice;
        const dObj = new Date(data.timestamp);
        const dStr = dObj.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

        const _vatAmt = parseFloat(data.vatAmount || 0);
        const _delivery = parseFloat(data.deliveryFee || 0);
        const _grand = parseFloat(data.grandTotal || data.total || 0);
        const _subtotal = _grand - _vatAmt;
        const _invId = (data.id || '').toString().replace(/^INV-/, '');
        const _custName = (!data.customer.name || data.customer.name === 'عميل نقدي' || data.customer.name === 'عميل دون اسم') ? '' : data.customer.name;
        const _storeTax = (data.taxNumber && data.taxNumber.trim() !== '')
            ? `<p style="margin:2px 0; font-size:14px; color:#444;">الرقم الضريبي: &nbsp;&nbsp; <strong style="direction:ltr; display:inline-block;">${data.taxNumber}</strong></p>` : '';
        const _storeWA = (window.tenantSettings || {}).phone
            ? `<p style="margin:2px 0; font-size:14px; color:#444;">رقم جوال النشاط: &nbsp;&nbsp; <strong style="direction:ltr; display:inline-block;">${window.tenantSettings.phone}</strong></p>` : '';
        const _iCity = (window.tenantSettings || {}).addressCity || localStorage.getItem('invoiceCity') || '';
        const _iHood = (window.tenantSettings || {}).addressNeighborhood || localStorage.getItem('invoiceNeighborhood') || '';
        const _iStreet = (window.tenantSettings || {}).addressStreet || localStorage.getItem('invoiceStreet') || '';
        const _addrParts = [];
        if (_iCity) _addrParts.push(_iCity);
        if (_iHood) _addrParts.push(_iHood);
        if (_iStreet) _addrParts.push(_iStreet);
        const _addressText = _addrParts.length > 0 ? _addrParts.join(' - ') : '';

        const _storeAddress = _addressText
            ? `<p style="margin:2px 0; font-size:14px; color:#444;">العنوان: &nbsp;&nbsp; <strong style="direction:rtl; display:inline-block;">${_addressText}</strong></p>`
            : '';
        const _hasValTax = !!(data.taxNumber && data.taxNumber.trim() !== '');
        const _invType = _hasValTax ? 'فاتورة ضريبية مبسطة' : 'فاتورة مبيعات';

        let _itemRows = '', _rn = 1;
        data.items.forEach(it => {
            if (!it) return;
            let tLbl = it.type === 'iron' ? 'كوي' : (it.type === 'wash_iron' ? 'غسيل وكوي' : 'غسيل فقط');
            let sLbl = it.speed === 'normal' ? 'عادي' : 'سريع';
            _itemRows += `<tr style="border-bottom:1px solid #eee;">
                <td style="padding:9px 0; text-align:center; color:#555;">${_rn++}</td>
                <td style="padding:9px 0;"><strong>${it.name}</strong> <span style="font-size:11px; color:#666;"> &nbsp;-&nbsp; ${tLbl} &nbsp;-&nbsp; ${sLbl}</span></td>
                <td style="padding:9px 0; text-align:center;">${it.qty}</td>
                <td style="padding:9px 0; text-align:center;">${it.unitPrice.toFixed(2)}</td>
                <td style="padding:9px 0; text-align:center; font-weight:bold;">${(it.unitPrice * it.qty).toFixed(2)}</td>
            </tr>`;
        });
        if (_delivery > 0) {
            _itemRows += `<tr style="border-bottom:1px solid #eee;">
                <td style="padding:9px 0; text-align:center; color:#555;">${_rn++}</td>
                <td style="padding:9px 0;"><strong>رسوم التوصيل</strong></td>
                <td style="padding:9px 0; text-align:center;">1</td>
                <td style="padding:9px 0; text-align:center;">${_delivery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style="padding:9px 0; text-align:center; font-weight:bold;">${_delivery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>`;
        }

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '210mm'; // Fixed A4 width
        container.style.background = '#fff';

        container.innerHTML = `
        <div style="width:210mm; margin:0 auto; padding:45px; box-sizing:border-box; font-family:'Tajawal',sans-serif; direction:rtl; color:#000; line-height:1.7; background:#fff;">

            <!-- Header: Store Name → VAT Number → Phone -->
            <div style="text-align:center; margin-bottom:30px; padding-bottom:20px; border-bottom:2px solid #000;">
                ${(window.tenantSettings || {}).logo ? `<img src="${window.tenantSettings.logo}" style="width: 100%; max-width: 80px; height: auto; display: block; margin: 0 auto 15px auto; border-radius: 6px;">` : ''}
                <div style="font-size:32px; font-weight:900; color:#000; margin-top:6px; margin-bottom:14px;">${(window.tenantSettings || {}).name || ''}</div>
                ${_storeAddress}
                ${_storeTax}
                ${_storeWA}
                <div style="margin-top:14px; font-size:16px; font-weight:bold; color:#000;">${_invType}</div>
            </div>

            <!-- Invoice & Customer Info — RTL table with colon on the correct left side -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:14px; direction:rtl;">
                <tr>
                    <td style="padding:5px 0; color:#555; white-space:nowrap; width:120px; unicode-bidi:plaintext; direction:rtl;">&#x202B;رقم الفاتورة:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000;">${_invId}</td>
                    <td style="padding:5px 0; color:#555; white-space:nowrap; width:80px; unicode-bidi:plaintext; direction:rtl;">&#x202B;التاريخ:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000; direction:ltr; text-align:right;">${dStr}</td>
                </tr>
                <tr>
                    <td style="padding:5px 0; color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;العميل:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000;">${_custName}</td>
                    <td style="padding:5px 0; color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;رقم الجوال:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000; direction:ltr; text-align:right;">${data.customer.phone || '-'}</td>
                </tr>
                <tr>
                    <td style="padding:5px 0; color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;وقت الطباعة:&#x200F;</td>
                    <td colspan="3" style="padding:5px 10px; color:#333; direction:ltr; text-align:right;">${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                </tr>
            </table>

            <!-- Items Table — thin lines, pure white, strict RTL -->
            <table dir="rtl" style="width:100%; border-collapse:collapse; margin-bottom:25px;">
                <thead>
                    <tr style="border-top:1px solid #000; border-bottom:1px solid #000;">
                        <th style="padding:10px 0; text-align:center; width:5%; color:#000;">#</th>
                        <th style="padding:10px 0; text-align:right; color:#000;">الصنف</th>
                        <th style="padding:10px 0; text-align:center; width:12%; color:#000;">الكمية</th>
                        <th style="padding:10px 0; text-align:center; width:14%; color:#000;">السعر</th>
                        <th style="padding:10px 0; text-align:center; width:14%; color:#000;">الإجمالي</th>
                    </tr>
                </thead>
                <tbody>${_itemRows}</tbody>
            </table>

            <div style="display:flex; justify-content:flex-end; margin-bottom:35px;">
                <table dir="rtl" style="border-collapse:collapse; font-size:14px; min-width:310px;">
                    ${_hasValTax ? `
                    <tr>
                        <td style="padding:6px 0; color:#555;">المجموع بدون ضريبة</td>
                        <td style="padding:6px 0; padding-right:20px; font-weight:bold; direction:ltr; text-align:left;">${_subtotal.toFixed(2)} ر.س</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#555;">ضريبة القيمة المضافة 15٪</td>
                        <td style="padding:6px 0; padding-right:20px; font-weight:bold; direction:ltr; text-align:left;">${_vatAmt.toFixed(2)} ر.س</td>
                    </tr>` : ''}
                    <tr>
                        <td style="padding:6px 0; color:#555;">طريقة الدفع</td>
                        <td style="padding:6px 0; padding-right:20px; font-weight:bold; direction:ltr; text-align:left;">${{ 'cash': 'نقدي', 'mada': 'مدى', 'visa': 'فيزا', 'mastercard': 'ماستركارد', 'network': 'شبكة' }[data.paymentMethod] || data.paymentMethod}</td>
                    </tr>
                    <tr style="border-top:1px solid #000;">
                        <td style="padding:10px 0; font-size:16px; font-weight:900; color:#000;">${_hasValTax ? 'الإجمالي الشامل' : 'الإجمالي'}</td>
                        <td style="padding:10px 0; padding-right:20px; font-size:18px; font-weight:900; color:#000; direction:ltr; text-align:left;">${_grand.toFixed(2)} ر.س</td>
                    </tr>
                </table>
            </div>

            <!-- ZATCA QR centered at bottom -->
            <div style="text-align:center; border-top:1px solid #ccc; padding-top:25px;">
                <div id="pdf-qr-container" style="display:inline-block; margin-bottom:10px;"></div>
                <div style="font-size:13px; color:#555;">شكراً لتعاملكم معنا - نظام سحاب | Sahab POS</div>
            </div>

        </div>
        `;

        document.body.appendChild(container);

        // Standard ZATCA QR (Updated with Real Tax)
        const bizName = (window.tenantSettings || {}).name || 'سحاب';
        const zatcaQRBase64 = generateZatcaBase64(bizName, data.taxNumber || "000000000000000", data.timestamp, data.grandTotal, data.vatAmount);
        new QRCode(container.querySelector('#pdf-qr-container'), {
            text: zatcaQRBase64,
            width: 140, height: 140,
            colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M
        });

        const opt = {
            margin: 0,
            filename: `Invoice_${_invId}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                width: 794, // ~210mm in pixels at 96dpi
                windowWidth: 794,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        let originalBtn = null;
        let originalText = '';
        if (event && event.currentTarget) {
            originalBtn = event.currentTarget;
            originalText = originalBtn.innerHTML;
            originalBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التجهيز...';
            originalBtn.disabled = true;
        }

        try {
            // Force wait for images/fonts if any
            await new Promise(r => setTimeout(r, 600));

            await html2pdf().set(opt).from(container.firstElementChild).save();

            document.body.removeChild(container);
            if (originalBtn) {
                originalBtn.innerHTML = originalText;
                originalBtn.disabled = false;
            }
            this.showToast(`تم إصدار الفاتورة رقم ${data.id} بنجاح`);
        } catch (err) {
            console.error('PDF Error:', err);
            if (container.parentNode) document.body.removeChild(container);
            if (originalBtn) {
                originalBtn.innerHTML = originalText;
                originalBtn.disabled = false;
            }
            alert('خطأ في إصدار PDF: ' + err.message);
        }
    },

    // Toast Message Fix
    showToast(msg) {
        const lang = this.currentLang || 'ar';
        if (lang === 'en') {
            if (msg.includes('تم حذف خيار التوصيل بنجاح')) msg = 'Delivery option deleted successfully';
            else if (msg.includes('تم حفظ رسوم التوصيل')) msg = 'Delivery fees saved successfully';
            else if (msg.includes('تم حفظ بيانات المغسلة')) msg = 'Partner laundry data saved';
            else if (msg.includes('تم تحديث حالة دفع المغسلة')) msg = 'Partner payment status updated';
            else if (msg.includes('تم تصفير رصيد')) msg = msg.replace("تم تصفير رصيد '", "Balance cleared manually for '").replace("' يدوياً", "'");
            else if (msg.includes('تم تسديد مستحقات')) msg = msg.replace("تم تسديد مستحقات '", "Dues fully settled for '").replace("' بالكامل وتحديث الموقف المالي", "'");
            else if (msg.includes('تم حذف الخدمة بنجاح')) msg = 'Service deleted successfully';
            else if (msg.includes('تم حفظ بيانات الخدمة بنجاح')) msg = 'Service data saved successfully';
            else if (msg.includes('تم حفظ الصنف بنجاح')) msg = 'Item saved successfully';
            else if (msg.includes('تم حذف المادة بنجاح')) msg = 'Consumable deleted successfully';
            else if (msg.includes('تم إصدار الفاتورة رقم')) msg = msg.replace('تم إصدار الفاتورة رقم ', 'Invoice #').replace(' بنجاح', ' issued successfully');
            else if (msg.includes('تمت إضافة:')) msg = msg.replace('تمت إضافة:', 'Added:');
            else if (msg.includes('هذه الخدمة غير متوفرة بهذا الخيار')) msg = 'This service is not available for this option';
            else if (msg.includes('تم تصفير جميع المصروفات التشغيلية')) msg = 'All operational expenses cleared';
            else if (msg.includes('تم تقييد المصروف بنجاح')) msg = 'Expense recorded successfully';
            else if (msg.includes('تم إلغاء الفاتورة') && msg.includes('وتسجيلها كمرتجع ✓')) msg = msg.replace('تم إلغاء الفاتورة ', 'Invoice ').replace(' وتسجيلها كمرتجع ✓', ' has been cancelled ✓').replace('وتسجيلها كمرتجع ✓', 'has been cancelled ✓');
            else if (msg.includes('✅ تم إغلاق اليومية بنجاح')) msg = '✅ Daily shift closed and records cleared.';
            else if (msg.includes('تم تفعيل المظهر الداكن')) msg = 'Dark mode activated 🌙';
            else if (msg.includes('تم تفعيل المظهر الفاتح')) msg = 'Light mode activated ☀️';
            else if (msg.includes('تمفظ إعدادات المغسلة') || msg.includes('تم حفظ إعدادات المغسلة')) msg = 'Store settings saved successfully ✓';
        }

        let t = document.getElementById('toast-msg');
        if (!t) {
            t = document.createElement('div');
            t.id = 'toast-msg';
            t.classList.add('no-print');
            t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#4CAF50;color:#fff;padding:15px 30px;border-radius:30px;font-weight:bold;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,0.5);opacity:0;transition:opacity 0.3s; pointer-events:none; font-family:"Tajawal",sans-serif; text-align:center; min-width:300px;';
            document.body.appendChild(t);
        }
        t.innerText = msg;
        t.style.opacity = '1';
        setTimeout(() => t.style.opacity = '0', 4000);
    },

    // HTML Generator for Thermal Receipt (Zero Ink — white background, RTL Arabic)
    generateThermalHTML(data, qrContainerId) {
        const _hasValTax = !!(data.taxNumber && data.taxNumber.trim() !== '');
        const dObj = new Date(data.timestamp);
        const dStr = dObj.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        const _invId = (data.id || '').toString().replace(/^INV-/, '');
        const vatAmount = parseFloat(data.vatAmount || 0);
        const deliveryFee = parseFloat(data.deliveryFee || 0);
        const grandTotal = parseFloat(data.grandTotal || data.total || 0);
        const combinedSum = grandTotal - vatAmount; // subtotal before VAT

        const _custName = (data.customer && data.customer.name && data.customer.name !== 'عميل نقدي') ? data.customer.name : '';

        const displayLocale = 'en-US';
        const displayOpts = { minimumFractionDigits: 2, maximumFractionDigits: 2 };


        let itemsHtml = '';
        data.items.forEach(item => {
            if (!item) return;
            let tLbl = item.type === 'iron' ? 'كوي' : (item.type === 'wash_iron' ? 'غسيل وكوي' : 'غسيل');
            let sLbl = item.speed === 'normal' ? 'عادي' : 'سريع';
            itemsHtml += `
            <tr>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:right;">${item.name} <span style="font-size:10px;"> &nbsp;-&nbsp; ${tLbl} &nbsp;-&nbsp; ${sLbl}</span></td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:center;">${item.qty}</td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:left; direction:ltr;">${(item.unitPrice * item.qty).toLocaleString(displayLocale, displayOpts)}</td>
            </tr>`;
        });
        if (deliveryFee > 0) {
            itemsHtml += `
            <tr>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:right;">رسوم التوصيل</td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:center;">1</td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:left; direction:ltr;">${deliveryFee.toLocaleString(displayLocale, displayOpts)}</td>
            </tr>`;
        }

        const storePhone = (window.tenantSettings || {}).phone
            ? `<p style="margin:0;"><span class="label">رقم جوال النشاط:</span> <span class="number">${window.tenantSettings.phone}</span></p>` : '';
        const storeTax = (data.taxNumber && data.taxNumber.trim() !== '')
            ? `<p style="margin:0;"><span class="label">الرقم الضريبي:</span> <span class="number">${data.taxNumber}</span></p>` : '';
        const _iCity = (window.tenantSettings || {}).addressCity || localStorage.getItem('invoiceCity') || '';
        const _iHood = (window.tenantSettings || {}).addressNeighborhood || localStorage.getItem('invoiceNeighborhood') || '';
        const _iStreet = (window.tenantSettings || {}).addressStreet || localStorage.getItem('invoiceStreet') || '';
        const _addrParts = [];
        if (_iCity) _addrParts.push(_iCity);
        if (_iHood) _addrParts.push(_iHood);
        if (_iStreet) _addrParts.push(_iStreet);
        const _addressText = _addrParts.length > 0 ? _addrParts.join(' - ') : '';

        const storeAddress = _addressText ? `<p style="margin:0;"><span class="label">العنوان:</span> <span class="number" style="direction:rtl; display:inline-block;">${_addressText}</span></p>` : '';

        return `
        <style>
            .receipt-header { text-align:center; border-bottom:1px solid #000; padding-bottom:8px; margin-bottom:10px; }
            .receipt-header p { margin: 1px 0; font-size:11px; color:#000; }
            .receipt-header .label { display: inline-block; }
            .receipt-header .number { direction: ltr; display: inline-block; font-weight: bold; }
        </style>
        <div style="width:80mm; margin:0 auto; font-family:'Tajawal',Arial,sans-serif; direction:rtl; background:#fff; color:#000; padding:8px; box-sizing:border-box;">

            <!-- Header: Store Name → VAT Number → Phone -->
            <div class="receipt-header">
                ${(window.tenantSettings || {}).logo ? `<img src="${window.tenantSettings.logo}" style="width: 100%; max-width: 60px; height: auto; display: block; margin: 0 auto 10px auto;">` : ''}
                <div style="font-size:18px; font-weight:900; margin-bottom:4px;">${(window.tenantSettings || {}).name || ''}</div>
                <div style="font-size:13px; font-weight:bold; margin-bottom:4px;">${_hasValTax ? 'فاتورة ضريبية مبسطة' : 'فاتورة مبيعات'}</div>
                ${storeAddress}
                ${storeTax}
                ${storePhone}
            </div>

            <!-- Meta info — colon pinned to left of each label via unicode-bidi -->
            <table style="width:100%; font-size:12px; margin-bottom:8px; border-collapse:collapse; direction:rtl;">
                <tr style="border-bottom:1px solid #eee;">
                    <td style="color:#555; text-align:right;">رقم الفاتورة:</td>
                    <td style="font-weight:bold; text-align:left; direction:ltr;">${_invId}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="color:#555; text-align:right;">التاريخ:</td>
                    <td style="text-align:left; direction:ltr;">${dStr}</td>
                </tr>
                ${_custName ? `<tr style="border-bottom:1px solid #eee;"><td style="color:#555; text-align:right;">العميل:</td><td style="font-weight:bold; text-align:right;">${_custName}</td></tr>` : ''}
                ${data.customer.phone && data.customer.phone !== '0000000000' ? `<tr style="border-bottom:1px solid #eee;"><td style="color:#555; text-align:right;">رقم الجوال:</td><td style="direction:ltr; text-align:left; font-weight:bold;">${data.customer.phone}</td></tr>` : ''}
                <tr>
                    <td style="color:#555; text-align:right; font-size: 11px;">وقت الطباعة:</td>
                    <td style="text-align:left; direction:ltr; font-size: 11px; color:#333;">${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                </tr>
            </table>

            <!-- Items Table -->
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
                <thead>
                    <tr style="border-top:1px solid #000; border-bottom:1px solid #000;">
                        <th style="padding:3px 0; text-align:right;">الصنف</th>
                        <th style="padding:3px 0; text-align:center; width:25px;">م</th>
                        <th style="padding:3px 0; text-align:left;">إجمالي</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>

            <table style="width:100%; font-size:12px; margin-top:8px; border-collapse:collapse;">
                ${_hasValTax ? `
                <tr>
                    <td style="padding:3px 0; color:#555;">المجموع بدون ضريبة</td>
                    <td style="text-align:left; font-weight:bold; direction:ltr;">${combinedSum.toLocaleString(displayLocale, displayOpts)} ر.س</td>
                </tr>
                <tr>
                    <td style="padding:3px 0; color:#555;">ضريبة القيمة المضافة 15٪</td>
                    <td style="text-align:left; font-weight:bold; direction:ltr;">${vatAmount.toLocaleString(displayLocale, displayOpts)} ر.س</td>
                </tr>` : ''}
                <tr>
                    <td style="padding:3px 0; color:#555;">طريقة الدفع</td>
                    <td style="text-align:left; font-weight:bold;">${{ 'cash': 'نقدي', 'mada': 'مدى', 'visa': 'فيزا', 'mastercard': 'ماستركارد', 'network': 'شبكة' }[data.paymentMethod] || data.paymentMethod}</td>
                </tr>
                <tr style="border-top:1px solid #000;">
                    <td style="padding:5px 0; font-size:14px; font-weight:900;">${_hasValTax ? 'الإجمالي الشامل' : 'الإجمالي'}</td>
                    <td style="text-align:left; font-size:14px; font-weight:900; direction:ltr;">${grandTotal.toLocaleString(displayLocale, displayOpts)} ر.س</td>
                </tr>
            </table>

            <!-- ZATCA QR + Footer -->
            <div style="text-align:center; margin-top:12px; border-top:1px solid #ccc; padding-top:10px;">
                <div id="${qrContainerId}" style="display:inline-block; margin-bottom:6px;"></div>
                <div style="font-size:11px; color:#555;">Thank you for choosing Sahab POS</div>
            </div>

        </div>`;
    },

    // 80mm Thermal Receipt Layout
    async printInvoice(data) {
        if (!data) return;
        try {
            var originalBtn = document.querySelector('button[onclick="appLogic.printThermalReceipt()"]');
            var origHTML = originalBtn ? originalBtn.innerHTML : '';
            if (originalBtn) originalBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الطباعة...';

            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = this.generateThermalHTML(data, 'temp-qr-render');
            
            const bizName = (window.tenantSettings || {}).name || 'سحاب POS';
            const zatcaQRBase64 = generateZatcaBase64(bizName, (window.tenantSettings || {}).taxNumber || "000000000000000", data.timestamp, data.grandTotal, data.vatAmount);
            
            new QRCode(tempContainer.querySelector('#temp-qr-render'), {
                text: zatcaQRBase64, width: 220, height: 220, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.L
            });

            const iframe = document.createElement('iframe');
            iframe.style.width = '576px';
            iframe.style.height = '3000px'; 
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
            <html dir="rtl"><head><style>
            /* STRICTLY SYSTEM FONTS ONLY - NO EXTERNAL IMPORTS TO PREVENT CORS CRASH */
            body { margin: 0; padding: 0; background: white; color: black; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
            * { color: black !important; }
            
            #rtl-wrapper { width: 576px !important; padding: 15px 20px; box-sizing: border-box; background: white; }
            
            table { width: 100% !important; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
            td, th { font-size: 26px !important; font-weight: bold !important; padding: 10px 0 !important; border-bottom: 2px dashed #000; }
            
            th:nth-child(1), td:nth-child(1) { text-align: right; width: 55%; padding-right: 5px; }
            th:nth-child(2), td:nth-child(2) { text-align: center; width: 15%; }
            th:nth-child(3), td:nth-child(3) { text-align: left; width: 30%; padding-left: 5px; }
            
            .receipt-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 15px; margin-bottom: 20px; width: 100%; }
            .receipt-header div:nth-child(2) { font-size: 42px !important; font-weight: bold !important; margin-bottom: 10px !important; }
            .receipt-header p, .receipt-header div { font-size: 24px !important; font-weight: bold !important; line-height: 1.5; }
            
            .totals-row { display: flex; justify-content: space-between; width: 100%; font-size: 26px !important; font-weight: bold !important; margin-bottom: 8px; }
            .grand-total { font-size: 34px !important; font-weight: bold !important; border-top: 2px solid #000; padding-top: 15px; margin-top: 15px; }
            
            #temp-qr-render { margin-top: 30px; display: flex; justify-content: center; width: 100%; padding-bottom: 30px; }
            #temp-qr-render img { width: 220px !important; height: 220px !important; display: block; margin: 0 auto; }
            </style></head><body>
            <div id="rtl-wrapper">${tempContainer.innerHTML}</div>
            </body></html>
            `);
            doc.close();

            // Quick wait (no external fonts to download anymore)
            await new Promise(r => setTimeout(r, 400));

            const wrapperElement = doc.getElementById('rtl-wrapper');
            const exactHeight = wrapperElement.scrollHeight;

            const canvas = await html2canvas(wrapperElement, { 
                width: 576, 
                height: exactHeight,
                windowWidth: 576, 
                windowHeight: exactHeight,
                scale: 1, 
                useCORS: true, 
                allowTaint: true,
                logging: false 
            });
            
            document.body.removeChild(iframe);

            const base64ImageString = canvas.toDataURL('image/png');
            window.location.href = "intent:" + base64ImageString + "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";
            
            if (originalBtn) originalBtn.innerHTML = origHTML;
        } catch (err) {
            console.error('Print Error:', err);
            alert('حدث خطأ أثناء الطباعة: ' + err.message);
            if (originalBtn) originalBtn.innerHTML = '<i class="fa-solid fa-print"></i> <span>طباعة</span>';
        }
    },

    // History & Invoice Management
    async filterHistory() {
        const term = document.getElementById('history-search').value.toLowerCase();
        this.renderHistory(term);
    },

    async renderHistory(searchTerm = '') {
        const historyContent = document.getElementById('history-content');
        if (!historyContent) return;

        const todayYMD = getLocalYMD();
        const isLiveShift = !this.currentViewDate || this.currentViewDate === todayYMD;

        let invoices = [];
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

            // Normalize dates to KSA Local YYYY-MM-DD for comparison ensuring 100% strict match
            const invDate = getLocalYMD(inv.timestamp || inv.date);
            return invDate === (this.currentViewDate || todayYMD);
        });

        // Search Filter (Secondary)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            invoices = invoices.filter(inv =>
                (inv.id && inv.id.toString().toLowerCase().includes(term)) ||
                (inv.customer && inv.customer.name && inv.customer.name.toLowerCase().includes(term)) ||
                (inv.customer && inv.customer.phone && inv.customer.phone.includes(term))
            );
        }

        invoices.sort((a, b) => b.timestamp - a.timestamp);

        try {
            // STRICT VALIDATION: Filter out undefined/empty invoices to kill ghosts
            let filteredInvoices = Array.isArray(invoices) ? invoices : Object.values(invoices);
            let validInvoices = filteredInvoices.filter(i => i && i.id && typeof i.grandTotal !== 'undefined');

            // Cleanup corrupted ghosts permanently from DB
            if (validInvoices.length !== (Array.isArray(invoices) ? invoices.length : Object.keys(invoices).length)) {
                await localforage.setItem('invoices', validInvoices);
            }

            let html = '';
            const lang = this.currentLang || 'ar';
            const thId = lang === 'en' ? 'Invoice ID' : 'رقم الفاتورة';
            const thCust = lang === 'en' ? 'Customer' : 'العميل';
            const thAmt = lang === 'en' ? 'Amount' : 'المبلغ';
            const thDate = lang === 'en' ? 'Date' : 'التاريخ';
            const thAct = lang === 'en' ? 'Actions' : 'إجراءات';

            const generateTableHTML = (sectionInvoices, title, isUnpaidSection) => {
                let sectionHtml = `<h3 style="color:var(--primary); font-size:18px; margin-top:30px; margin-bottom:15px;"><i class="fa-solid ${isUnpaidSection ? 'fa-clock' : 'fa-check'}"></i> ${title}</h3>`;
                sectionHtml += '<table onclick="appLogic.handleHistoryAction(event)" style="width:100%; border-collapse:collapse; background:var(--bg-surface); border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.5); margin-bottom:20px;">';
                sectionHtml += `<thead><tr style="background:#111; color:var(--primary)"><th style="padding:15px; text-align:right;">${thId}</th><th style="padding:15px; text-align:right;">${thCust}</th><th style="padding:15px; text-align:right;">${thAmt}</th><th style="padding:15px; text-align:right;">${thDate}</th><th style="padding:15px; text-align:center;">${thAct}</th></tr></thead><tbody>`;

                if (sectionInvoices.length === 0) {
                    const noInv = lang === 'en' ? 'No invoices match your search.' : 'لا توجد فواتير مطابقة للبحث.';
                    sectionHtml += `<tr><td colspan="5" style="padding:20px; text-align:center;">${noInv}</td></tr>`;
                } else {
                    const dFormatter = new Intl.DateTimeFormat('en-US', {
                        year: 'numeric', month: 'numeric', day: 'numeric',
                        hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
                    });

                    const displayInvoices = [].concat(sectionInvoices).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 500);

                    displayInvoices.forEach(i => {
                        if (!i) return;
                        const isCancelled = i.isCancelled === true;
                        let customerName = (i.customer && i.customer.name) ? i.customer.name : '';
                        let customerPhone = (i.customer && i.customer.phone) ? i.customer.phone : '0000000000';
                        let cellPhone = (customerPhone !== '0000000000') ? `<br><small style="color:var(--text-muted); direction:ltr; display:inline-block">${customerPhone}</small>` : '';
                        let total = i.grandTotal || 0;
                        let dateStr = i.timestamp ? dFormatter.format(new Date(i.timestamp)) : '-';

                        const rsLabel = lang === 'en' ? 'SAR' : 'ر.س';
                        const paidL = lang === 'en' ? 'Paid' : 'مدفوع';
                        const unpaidL = lang === 'en' ? 'Unpaid' : 'غير مدفوع';
                        const lName = lang === 'en' ? 'Laundry:' : 'مغسلة:';
                        const cancelL = lang === 'en' ? 'Cancelled' : 'ملغاة';
                        const actCancelTitle = lang === 'en' ? 'Cancel Invoice' : 'إلغاء الفاتورة';

                        let partnerBadge = i.partnerLaundryName ? `<br><span onclick="appLogic.toggleLaundryPaid('${i.id}')" style="cursor:pointer; display:inline-block; margin-top:5px; font-size:11px; padding:3px 8px; border-radius:12px; background:${i.laundryPaid ? '#4CAF50' : '#f44336'}; color:#fff;"><i class="fa-solid ${i.laundryPaid ? 'fa-check' : 'fa-times'}"></i> ${lName} ${i.partnerLaundryName} (${i.laundryPaid ? paidL : unpaidL})</span>` : '';

                        const rowStyle = isCancelled
                            ? 'border-bottom:1px solid var(--border); opacity:0.55; background:rgba(255,70,70,0.06);'
                            : 'border-bottom:1px solid var(--border);';

                        let refundBadge = '';
                        if (i.status === 'مسترجع بالكامل' || i.status === 'مسترجع جزئياً') {
                            refundBadge = `<span style="display:inline-block; background:#ef4444; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:12px; margin-right:6px;">${i.status}</span>`;
                        }

                        const totalDisplay = isCancelled
                            ? `<span style="text-decoration:line-through; color:#f44336">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${rsLabel}</span> <span style="display:inline-block; background:#c62828; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:12px; margin-right:6px;">${cancelL}</span>`
                            : `${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${rsLabel} ${refundBadge} ${partnerBadge}`;

                        const cancelBtn = isCancelled
                            ? ''
                            : `<button class="btn-action-icon btn-action-delete" type="button" data-action="cancel_inv" data-id="${i.id}" title="${actCancelTitle}"><i class="fa-solid fa-ban" style="pointer-events:none;"></i></button>`;

                        const markPaidBtn = (isUnpaidSection && !isCancelled)
                            ? `<button class="btn-action-icon" type="button" data-action="mark_paid" data-id="${i.id}" style="color: #fff; background: #22c55e; border: none; padding: 10px 25px; min-width: 100px; border-radius: 8px; font-weight: 900; font-size: 14px; box-shadow: 0 4px 10px rgba(34,197,94,0.4);" title="${lang === 'en' ? 'Mark as Paid' : 'تسديد الفاتورة'}"><i class="fa-solid fa-check" style="pointer-events:none; margin-left:6px;"></i> ${lang === 'en' ? 'Pay' : 'تسديد'}</button>`
                            : '';

                        sectionHtml += `<tr style="${rowStyle}">
                            <td style="padding:15px; font-weight:bold;">${i.id || 'N/A'} ${isUnpaidSection ? `<br><span style="background:#f59e0b; color:#000; font-size:10px; padding:2px 6px; border-radius:8px; font-weight:bold;">${lang === 'en' ? 'Unpaid' : 'دفع لاحقاً'}</span>` : ''}</td>
                            <td style="padding:15px;">${customerName}${cellPhone}</td>
                            <td style="padding:15px; font-weight:bold; color:${isCancelled ? '#f44336' : (isUnpaidSection ? '#f59e0b' : 'var(--primary)')}">${totalDisplay}</td>
                            <td style="padding:15px;">${dateStr}</td>
                            <td style="padding:15px; text-align:center;">
                                ${markPaidBtn}
                                ${isCancelled ? '' : `<button class="btn-action-icon btn-action-info" type="button" data-action="partner_info" data-id="${i.id}" title="${lang === 'en' ? 'Partner Laundry Details' : 'تفاصيل المغسلة الشريكة'}"><i class="fa-solid fa-truck-ramp-box" style="pointer-events:none;"></i></button>`}
                                <button class="btn-action-icon btn-action-print" type="button" data-action="print_inv" data-id="${i.id}" title="${lang === 'en' ? 'Preview & Reprint' : 'معاينة وإعادة طباعة'}"><i class="fa-solid fa-print" style="pointer-events:none;"></i></button>
                                ${isCancelled ? '' : `<button class="btn-action-icon btn-action-edit" type="button" data-action="refund_inv" data-id="${i.id}" title="${lang === 'en' ? 'Refund' : 'إرجاع'}"><i class="fa-solid fa-rotate-left" style="pointer-events:none; color:#ef4444;"></i></button>`}
                                ${cancelBtn}
                            </td>
                        </tr>
                        ${isCancelled ? '' : `<tr id="partner-info-${i.id}" class="hidden" style="background:rgba(253,184,19,0.03); border-bottom:2px solid var(--primary);">
                            <td colspan="5" style="padding:20px;">
                                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:15px; align-items:end;">
                                    <div>
                                        <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:5px;">${lang === 'en' ? 'Laundry Name' : 'اسم المغسلة'}</label>
                                        <input type="text" id="partner-name-${i.id}" value="${i.partnerLaundryName || ''}" list="saved-laundries" style="width:100%; background:#000; color:#fff; border:1px solid var(--border); padding:8px; border-radius:4px;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:5px;">${lang === 'en' ? 'Cost (SAR)' : 'حساب المغاسل (ر.س)'}</label>
                                        <input type="number" id="partner-cost-${i.id}" value="${i.laundryCost || i.partnerLaundryCost || 0}" style="width:100%; background:#000; color:#fff; border:1px solid var(--border); padding:8px; border-radius:4px;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:5px;">${lang === 'en' ? 'Neighborhood' : 'الحي'}</label>
                                        <input type="text" id="partner-hood-${i.id}" value="${i.partnerLaundryNeighborhood || ''}" list="saved-neighborhoods" style="width:100%; background:#000; color:#fff; border:1px solid var(--border); padding:8px; border-radius:4px;">
                                    </div>
                                    <div>
                                        <button class="btn btn-primary" style="width:100%; padding:9px;" onclick="appLogic.savePartnerInfo('${i.id}')">${lang === 'en' ? 'Save Details' : 'حفظ التفاصيل'}</button>
                                    </div>
                                </div>
                            </td>
                        </tr>`}`;
                    });
                }
                sectionHtml += '</tbody></table>';
                return sectionHtml;
            };

            let paidInvoices = validInvoices.filter(i => i.paymentStatus !== 'unpaid');
            let unpaidInvoices = validInvoices.filter(i => i.paymentStatus === 'unpaid');

            html += generateTableHTML(unpaidInvoices, lang === 'en' ? 'Unpaid Invoices (Pay Later)' : 'الفواتير غير المسددة (دفع لاحقاً)', true);
            html += generateTableHTML(paidInvoices, lang === 'en' ? 'Paid Invoices' : 'الفواتير المسددة', false);

            const container = document.getElementById('history-content');
            if (container) container.innerHTML = html;
        } catch (err) {
            console.error('Render History Error:', err);
            const lang = this.currentLang || 'ar';
            const container = document.getElementById('history-content');
            if (container) container.innerHTML = `<p style="color:red; text-align:center; padding:20px;">${lang === 'en' ? 'Error loading invoice history: ' : 'خطأ في تحميل سجل الفواتير: '}${err.message}</p>`;
        }

        // Render delivery settings table which conceptually lives on the History screen
        this.renderDeliveryManager();
    },

    handleHistoryAction(event) {
        const btn = event.target.closest('.btn-action-icon');
        if (!btn) return;

        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');
        if (!action || !id) return;

        if (action === 'cancel_inv') {
            this.cancelInvoice(id);
        } else if (action === 'partner_info') {
            this.togglePartnerInfo(id);
        } else if (action === 'print_inv') {
            this.reprintInvoice(id);
        } else if (action === 'refund_inv') {
            this.openRefundModal(id);
        } else if (action === 'mark_paid') {
            this.markInvoiceAsPaid(id);
        }
    },

    async markInvoiceAsPaid(id) {
        this.settlingInvoiceId = id;
        const payLaterBtn = document.getElementById('method-paylater');
        if (payLaterBtn) {
            payLaterBtn.style.display = 'none'; // Hide when settling unpaid invoice
        }
        document.getElementById('payment-method-modal').classList.remove('hidden');
    },

    togglePartnerInfo(id) {
        const el = document.getElementById(`partner-info-${id}`);
        if (el) el.classList.toggle('hidden');
    },

    async toggleLaundryPaid(id) {
        let invs = await localforage.getItem('invoices') || [];
        const idx = invs.findIndex(i => i.id === id);
        if (idx === -1) return;

        invs[idx].laundryPaid = !invs[idx].laundryPaid;
        await localforage.setItem('invoices', invs);
        await manualSyncToCloud('invoices', invs);

        this.renderHistory();
        this.renderReports();
        this.showToast('تم تحديث حالة دفع المغسلة الشريكة');
    },

    async savePartnerInfo(id) {
        const name = document.getElementById(`partner-name-${id}`).value.trim();
        const hood = document.getElementById(`partner-hood-${id}`).value.trim();
        const costStr = document.getElementById(`partner-cost-${id}`).value.trim();
        const cost = parseFloat(costStr) || 0;

        // Mandatory Validation
        if (name || hood || costStr !== '') {
            if (!name || !hood || costStr === '') {
                alert('الرجاء إكمال كافة بيانات المغسلة (الاسم، الحي، والتكلفة) للمتابعة');
                return;
            }
        }

        let invs = await localforage.getItem('invoices') || [];
        const idx = invs.findIndex(i => i.id === id);
        if (idx === -1) {
            console.error(`Invoice ${id} not found for partner update.`);
            return;
        }

        invs[idx].partnerLaundryName = name;
        invs[idx].partnerLaundryNeighborhood = hood;
        invs[idx].laundryCost = cost;
        invs[idx].partnerLaundryCost = cost; // Mirror for safety/back-compat

        await localforage.setItem('invoices', invs);
        await manualSyncToCloud('invoices', invs);

        // Update Cumulative Balance Store
        let balances = await localforage.getItem('laundry_balances') || {};
        const key = `${name}|${hood}`;
        if (!balances[key]) balances[key] = { balance: 0 };
        // We only add to the balance if it's not already paid (it's new/updated)
        // Note: For simplicity in this non-refactor fix, we assume this adds to the running total.
        balances[key].balance += cost;
        await localforage.setItem('laundry_balances', balances);
        localStorage.setItem('laundry_balances', JSON.stringify(balances));

        this.showToast('تم حفظ بيانات المغسلة وتحديث الرصيد التراكمي');

        // Update Persistent History (Smart Autocomplete Memory)
        const history = JSON.parse(localStorage.getItem('laundryHistory') || '{"names":[], "hoods":[]}');
        if (name && !history.names.includes(name)) history.names.push(name);
        if (hood && !history.hoods.includes(hood)) history.hoods.push(hood);
        localStorage.setItem('laundryHistory', JSON.stringify(history));

        // Refresh UI to keep it consistent
        this.updateLaundryDatalist();
        this.renderHistory();
        this.renderReports();
        if (this.renderLaundryAccounts) this.renderLaundryAccounts(); // Ensure explicit recalculation
    },

    async reprintInvoice(id) {
        const invs = await localforage.getItem('invoices') || [];
        const invoiceData = invs.find(i => i.id === id);
        if (!invoiceData) return;

        this.currentInvoice = invoiceData;
        document.getElementById('invoice-preview-container').innerHTML = this.generateThermalHTML(invoiceData, 'preview-qr-render');

        const zatcaQRBase64 = generateZatcaBase64((window.tenantSettings || {}).name || "Sahab POS", invoiceData.taxNumber || "000000000000000", invoiceData.timestamp, invoiceData.grandTotal, invoiceData.vatAmount || 0);
        new QRCode(document.getElementById('preview-qr-render'), {
            text: zatcaQRBase64,
            width: 100, height: 100,
            colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.L
        });

        document.getElementById('modal-actions-preview').classList.add('hidden');
        document.getElementById('modal-actions-success').classList.remove('hidden');

        document.getElementById('preview-invoice-id').innerText = invoiceData.id;
        document.getElementById('success-invoice-ref').innerText = invoiceData.id + " (نسخة مطابقة)";

        // Ensure WhatsApp button is visible even for old/reprinted invoices
        const _waBtnEl = document.getElementById('btn-whatsapp-share');
        if (_waBtnEl) _waBtnEl.style.display = 'block';

        document.getElementById('invoice-preview-modal').classList.remove('hidden');
    },

    async cancelInvoice(id) {
        if (!confirm(`هل أنت متأكد من إلغاء هذه الفاتورة كمرتجع؟\nالفاتورة: ${id}\nسيتم تسجيلها كملغاة ولن تُحذف من السجلات.`)) return;

        let invs = await localforage.getItem('invoices') || [];
        const idx = invs.findIndex(i => i && i.id === id);
        if (idx === -1) return;

        invs[idx].isCancelled = true;
        invs[idx].cancelledAt = Date.now();
        invs[idx].status = 'cancelled';

        await localforage.setItem('invoices', invs);
        await manualSyncToCloud('invoices', invs);

        await this.renderHistory();
        await this.renderReports();

        this.showToast(`تم إلغاء الفاتورة ${id} وتسجيلها كمرتجع ✓`);
    },

    async openRefundModal(id) {
        let invs = await localforage.getItem('invoices') || [];
        const invoice = invs.find(i => i.id == id);

        if (!invoice) {
            alert('الفاتورة غير موجودة.');
            return;
        }

        if (invoice.isCancelled) {
            alert('هذه الفاتورة ملغاة بالكامل مسبقاً.');
            return;
        }

        document.getElementById('refund-target-id').value = id;
        document.getElementById('refund-invoice-id').innerText = id;

        const container = document.getElementById('refund-items-container');
        container.innerHTML = '';

        // Render items to refund
        (invoice.items || []).forEach((item, index) => {
            let alreadyRefunded = item.refundedQty || 0;
            let maxRef = item.qty - alreadyRefunded;

            if (maxRef <= 0) return; // skip fully refunded items

            let unitPrice = parseFloat(item.unitPrice || item.price || item.cost || 0);
            // Express fee inclusion safely
            if (item.speed === 'express') {
                const svcs = JSON.parse(localStorage.getItem('sahab_services')) || [];
                const s = svcs.find(x => x.name === item.name);
                if (s && s.pricing && s.pricing.expressFee) unitPrice += s.pricing.expressFee;
            }

            let row = document.createElement('div');
            row.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid var(--border);";
            row.innerHTML = `
                 <div style="flex:2">
                     <strong style="color:var(--primary);">${item.name}</strong>
                     <div style="color:var(--text-muted); font-size:12px;">سعر الوحدة: ${unitPrice.toFixed(2)} ر.س | متوفر للإرجاع: ${maxRef}</div>
                 </div>
                 <div style="flex:1; display:flex; justify-content:flex-end; align-items:center; gap:10px;">
                     <input type="number" class="refund-qty-input" data-index="${index}" data-price="${unitPrice}" data-max="${maxRef}" min="0" max="${maxRef}" value="" placeholder="0" onchange="appLogic.calculateRefundTotal()" style="width:70px; padding:8px; text-align:center; background:#000; border:1px solid var(--border); color:#fff; border-radius:4px; font-family: system-ui, sans-serif; direction: ltr;">
                 </div>
             `;
            container.appendChild(row);
        });

        if (container.innerHTML === '') {
            container.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted);">تم إرجاع جميع أصناف هذه الفاتورة مسبقاً.</div>';
            document.querySelector('#refund-invoice-modal .btn-danger').style.display = 'none';
        } else {
            document.querySelector('#refund-invoice-modal .btn-danger').style.display = 'block';
        }

        document.getElementById('refund-grand-total').innerText = '0.00 ر.س';
        document.getElementById('refund-invoice-modal').classList.remove('hidden');
    },

    calculateRefundTotal() {
        let total = 0;
        document.querySelectorAll('.refund-qty-input').forEach(input => {
            let qty = parseInt(input.value) || 0;
            let price = parseFloat(input.getAttribute('data-price')) || 0;
            let max = parseInt(input.getAttribute('data-max')) || 0;
            if (qty > max) { qty = max; input.value = max; }
            if (qty < 0) { qty = 0; input.value = 0; }
            total += (qty * price);
        });
        document.getElementById('refund-grand-total').innerText = total.toFixed(2) + ' ر.س';
        return total;
    },

    async processRefund() {
        const id = document.getElementById('refund-target-id').value;
        const totalRefund = this.calculateRefundTotal();

        if (totalRefund <= 0) {
            alert('الرجاء تحديد كميات لإرجاعها.');
            return;
        }

        if (!confirm(`هل أنت متأكد من إرجاع مبلغ بقيمة ${totalRefund.toFixed(2)} ر.س من الفاتورة ${id}؟\n(سيتم خصم هذا المبلغ من يومية الكاشير)`)) return;

        let invs = await localforage.getItem('invoices') || [];
        const idx = invs.findIndex(i => i.id == id);

        if (idx === -1) return;

        let invoice = invs[idx];

        let fullyRefunded = true;
        document.querySelectorAll('.refund-qty-input').forEach(input => {
            let qty = parseInt(input.value) || 0;
            let index = parseInt(input.getAttribute('data-index'));
            if (qty > 0) {
                if (!invoice.items[index].refundedQty) invoice.items[index].refundedQty = 0;
                invoice.items[index].refundedQty += qty;
            }

            let totalRefundedForItem = invoice.items[index].refundedQty || 0;
            if (totalRefundedForItem < invoice.items[index].qty) {
                fullyRefunded = false;
            }
        });

        invoice.refundAmount = (invoice.refundAmount || 0) + totalRefund;
        invoice.status = fullyRefunded ? 'مسترجع بالكامل' : 'مسترجع جزئياً';

        invs[idx] = invoice;
        await localforage.setItem('invoices', invs);
        await manualSyncToCloud('invoices', invs);

        this.closeRefundModal();
        this.renderHistory();
        this.renderReports();
        this.showToast(`تم إرجاع المبلغ (${totalRefund.toFixed(2)} ر.س) بنجاح وإغلاق الفاتورة.`);
    },

    closeRefundModal() {
        document.getElementById('refund-invoice-modal').classList.add('hidden');
    },

    // Helper: Aggregates customer data from all non-cancelled invoices
    async _getAggregatedCustomers() {
        const invs = await localforage.getItem('invoices') || [];
        const validInvoices = (Array.isArray(invs) ? invs : Object.values(invs))
            .filter(i => i && i.id); // Relaxed filter: include all entries with an ID

        const customersMap = {};

        validInvoices.forEach(inv => {
            const isCancelled = inv.isCancelled === true || inv.status === 'cancelled';
            const name = (inv.customer && inv.customer.name) ? inv.customer.name.trim() : '';
            const phone = (inv.customer && inv.customer.phone) ? inv.customer.phone.trim() : '';

            let key = '';
            let isWalkIn = false;

            // Fix 5: DE-AGGREGATE WALK-INS. Each anonymous invoice is its own row.
            if ((!phone || phone === '0000000000') && (!name || name === 'عميل نقدي' || name === 'عميل دون اسم')) {
                key = `WALK_IN_${inv.id}`; // Unique key per invoice for anonymous customers
                isWalkIn = true;
            } else if (phone && phone !== '0000000000') {
                key = phone;
            } else {
                key = name || `UNKNOWN_${inv.id}`;
            }

            if (!customersMap[key]) {
                customersMap[key] = {
                    name: isWalkIn ? 'عميل نقدي' : (name || 'عميل دون اسم'),
                    phone: isWalkIn ? '0000000000' : (phone === '0000000000' ? '' : phone),
                    orderCount: 0,
                    totalSpent: 0,
                    latestTimestamp: inv.timestamp,
                    isWalkIn: isWalkIn,
                    invoiceId: inv.id // Store the specific invoice ID for walk-ins
                };
            }

            // For identified customers, update latest name/timestamp
            if (!isWalkIn && inv.timestamp > customersMap[key].latestTimestamp) {
                customersMap[key].name = name || customersMap[key].name;
                customersMap[key].latestTimestamp = inv.timestamp;
            }

            // Aggregate counts (for walk-ins, it will be 1 order per row)
            if (!isCancelled) {
                customersMap[key].orderCount += 1;
                customersMap[key].totalSpent += parseFloat(inv.grandTotal || inv.total || 0);
            }
        });

        return Object.values(customersMap).sort((a, b) => b.latestTimestamp - a.latestTimestamp);
    },

    async renderCustomers() {
        try {
            const aggregated = await this._getAggregatedCustomers();
            this.renderCustomersList(aggregated);
        } catch (err) {
            console.error('Render Customers Error:', err);
        }
    },

    async filterCustomers() {
        try {
            const input = document.getElementById('customer-search');
            let term = input ? input.value.toLowerCase() : '';

            let aggregated = await this._getAggregatedCustomers();

            if (term) {
                aggregated = aggregated.filter(c => {
                    return (c.name && c.name.toLowerCase().includes(term)) ||
                        (c.phone && c.phone.includes(term));
                });
            }

            this.renderCustomersList(aggregated);
        } catch (err) {
            console.error('Filter Customers Error:', err);
        }
    },

    renderCustomersList(customersArray) {
        try {
            const lang = this.currentLang || 'ar';
            const thCust = lang === 'en' ? 'Customer' : 'العميل';
            const thContact = lang === 'en' ? 'Contact Info' : 'بيانات التواصل';
            const thOrders = lang === 'en' ? 'Orders Count' : 'عدد الطلبات';
            const thSpent = lang === 'en' ? 'Total Spent' : 'إجمالي المشتريات';
            const thAct = lang === 'en' ? 'Actions' : 'إجراءات';

            let html = '<table style="width:100%; border-collapse:collapse; margin-top:20px; background:var(--bg-surface); border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.5)">';
            html += `<thead>
                <tr style="background:#111; color:var(--primary)">
                    <th style="padding:15px; text-align:right;">${thCust}</th>
                    <th style="padding:15px; text-align:right;">${thContact}</th>
                    <th style="padding:15px; text-align:right;">${thOrders}</th>
                    <th style="padding:15px; text-align:right;">${thSpent}</th>
                    <th style="padding:15px; text-align:center;">${thAct}</th>
                </tr>
            </thead><tbody>`;
            if (customersArray.length === 0) {
                const emptyMsg = lang === 'en' ? 'No customer data available yet.' : 'لا توجد بيانات للعملاء حتى الآن.';
                html += `<tr><td colspan="5" style="padding:20px; text-align:center;">${emptyMsg}</td></tr>`;
            } else {
                // Sort by latest activity (newest first)
                const displayCustomers = [].concat(customersArray).sort((a, b) => b.latestTimestamp - a.latestTimestamp);

                displayCustomers.forEach(c => {
                    if (!c) return;
                    const fallbackName = lang === 'en' ? 'Unnamed Customer' : 'عميل دون اسم';
                    const unregStr = lang === 'en' ? 'Unregistered' : 'غير مسجل';
                    let n = c.name || fallbackName;
                    let p = (c.phone && c.phone !== '0000000000') ? c.phone : `<span style="color:var(--text-muted); font-size:12px;">${unregStr}</span>`;
                    let count = c.orderCount || 0;
                    let spent = c.totalSpent || 0;
                    let isWalkIn = c.isWalkIn;
                    const ordersSuffix = lang === 'en' ? 'Orders' : 'طلب';
                    const viewOrdersTxt = lang === 'en' ? 'View Orders' : 'عرض الفواتير';

                    // Passing invoiceId for walk-ins so logic can filter history by that specific ID
                    const actionParam = isWalkIn ? c.invoiceId : (c.phone || c.name);

                    html += `<tr style="border-bottom:1px solid var(--border); ${isWalkIn ? 'background:rgba(253,184,19,0.03);' : ''}">
                        <td style="padding:15px; font-weight:bold; color:${isWalkIn ? 'var(--primary)' : 'inherit'}">${n}</td>
                        <td style="padding:15px; font-weight:bold; direction:ltr; text-align:right;">${p}</td>
                        <td style="padding:15px; font-weight:bold; color:var(--text-muted);">${count} ${ordersSuffix}</td>
                        <td style="padding:15px; font-weight:bold; color:var(--primary); direction:ltr; text-align:right;">${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })} SAR</td>
                        <td style="padding:15px; text-align:center;">
                            <button class="btn btn-sm" style="background:var(--primary); color:#000; padding:5px 12px; border-radius:4px; font-weight:bold;" onclick="appLogic.viewCustomerOrders('${actionParam}')">
                                <i class="fa-solid fa-list-ul"></i> ${viewOrdersTxt}
                            </button>
                        </td>
                    </tr>`;
                });
            }
            html += '</tbody></table>';
            const container = document.getElementById('customers-content');
            if (container) container.innerHTML = html;
        } catch (err) {
            console.error('Render Customers List Error:', err);
        }
    },

    viewCustomerOrders(identifier) {
        // Switch to the history view first
        this.switchView('history');

        // Ensure the search input exists and is set to the correct customer info
        const searchInput = document.getElementById('history-search');
        if (searchInput) {
            // Remove any 'INV-' prefix if the identifier is an ID to help the history filter find it
            const displayValue = identifier.toString().replace(/^INV-/, '');
            searchInput.value = displayValue;

            // Trigger the history filtering logic programmatically
            this.filterHistory();

            // Scroll the history view to the top to ensure visibility
            const historyView = document.getElementById('view-history');
            if (historyView) historyView.scrollTop = 0;
        }
    },

    // Wafeq UI: Inventory
    openAddInventoryModal() {
        document.getElementById('inv-id').value = '';
        document.getElementById('inv-name').value = '';
        document.getElementById('inv-sku').value = '';
        document.getElementById('inv-qty').value = 0;
        document.getElementById('inv-cost').value = '0.00';
        document.querySelector('#add-inventory-modal h3').innerHTML = '<i class="fa-solid fa-box-open"></i> إضافة صنف استهلاكي';
        document.getElementById('add-inventory-modal').classList.remove('hidden');
    },
    closeInventoryModal() { document.getElementById('add-inventory-modal').classList.add('hidden'); },
    async editConsumable(id) {
        let inv = await localforage.getItem('inventory') || [];
        let item = inv.find(i => String(i.id) === String(id));
        if (!item) return;

        document.getElementById('inv-id').value = item.id;
        document.getElementById('inv-name').value = item.name;
        document.getElementById('inv-sku').value = item.sku;
        document.getElementById('inv-qty').value = item.qty;
        document.getElementById('inv-cost').value = item.cost;

        document.querySelector('#add-inventory-modal h3').innerHTML = '<i class="fa-solid fa-edit"></i> تعديل صنف استهلاكي';
        document.getElementById('add-inventory-modal').classList.remove('hidden');
    },
    async deleteConsumable(id) {
        if (!confirm("هل أنت متأكد من حذف هذه المادة؟")) return;
        let inv = await localforage.getItem('inventory') || [];
        inv = inv.filter(i => String(i.id) !== String(id));

        await localforage.setItem('inventory', inv);
        await manualSyncToCloud('inventory', inv);

        this.renderInventory();
        this.showToast('تم حذف المادة بنجاح');
    },
    async saveInventoryItem() {
        let id = document.getElementById('inv-id').value;
        let name = document.getElementById('inv-name').value;
        let sku = document.getElementById('inv-sku').value;
        let qty = parseFloat(document.getElementById('inv-qty').value);
        let cost = parseFloat(document.getElementById('inv-cost').value);
        if (!name || !sku) { alert('يرجى تعبئة الحقول الأساسية!'); return; }

        let inv = await localforage.getItem('inventory') || [];

        if (id) {
            // Edit Mode
            let idx = inv.findIndex(i => String(i.id) === String(id));
            if (idx >= 0) {
                inv[idx] = { id, name, sku, qty, cost };
            }
        } else {
            // Add Mode (Original Logic with SKU collision check)
            let itemIdx = inv.findIndex(i => i.sku === sku);
            if (itemIdx >= 0) {
                inv[itemIdx].qty += qty;
                inv[itemIdx].cost = cost;
                inv[itemIdx].name = name; // Sync name just in case
            } else {
                inv.push({ id: Date.now(), name, sku, qty, cost });
            }
        }

        await localforage.setItem('inventory', inv);
        await manualSyncToCloud('inventory', inv);

        this.closeInventoryModal();
        this.renderInventory();
        this.showToast('تم حفظ الصنف بنجاح');
    },

    async renderInventory() {
        const container = document.getElementById('inventory-content');
        if (!container) return;

        // Immediate Feedback
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--primary);"><i class="fa-solid fa-spinner fa-spin"></i> جاري تحميل البيانات...</div>';

        try {
            console.log('[UI] Starting renderInventory...');

            // Load tracked inventory (consumables)
            let trackedInv = [];
            try {
                trackedInv = await localforage.getItem('inventory');
                if (!Array.isArray(trackedInv)) trackedInv = [];
            } catch (e) {
                console.error('[UI] Error loading consumables:', e);
            }

            const lang = this.currentLang || 'ar';
            let html = '';

            // Consumables Section
            html += `
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; margin-bottom:20px;">
                <h3 style="margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">${lang === 'en' ? 'Consumables' : 'المواد الاستهلاكية (Consumables)'}</h3>
                ${trackedInv.length === 0 ? `<p style="color:var(--text-muted); text-align:center;">${lang === 'en' ? 'No consumables added currently.' : 'لا توجد مواد استهلاكية مضافة حالياً. أضف الجِير، الأكياس، الشماعات ليتم خصمها آلياً يدوياً.'}</p>` : ''}
            `;

            if (trackedInv.length > 0) {
                html += `<table style="width:100%; border-collapse:collapse; text-align:right; margin-bottom:20px;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--border); color:var(--text-muted);">
                            <th style="padding:10px;">${lang === 'en' ? 'SKU' : 'SKU'}</th>
                            <th style="padding:10px;">${lang === 'en' ? 'Name' : 'الاسم'}</th>
                            <th style="padding:10px;">${lang === 'en' ? 'Cost' : 'التكلفة'}</th>
                            <th style="padding:10px;">${lang === 'en' ? 'Available Qty' : 'الرصيد المتاح (Qty)'}</th>
                            <th style="padding:10px;">${lang === 'en' ? 'Total Value' : 'إجمالي القيمة'}</th>
                            <th style="padding:10px; text-align:center;">${lang === 'en' ? 'Actions' : 'إجراءات'}</th>
                        </tr>
                    </thead>
                    <tbody>`;
                trackedInv.forEach(item => {
                    if (!item) return;
                    html += `
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:12px; font-family:monospace; color:var(--primary);">${item.sku || 'N/A'}</td>
                        <td style="padding:12px; font-weight:bold;">${item.name || 'Unlabeled'}</td>
                        <td style="padding:12px; direction:ltr;">${(parseFloat(item.cost) || 0).toFixed(2)} SAR</td>
                        <td style="padding:12px; font-weight:bold; color:${(item.qty || 0) < 5 ? '#e91e63' : '#4CAF50'}">${item.qty || 0}</td>
                        <td style="padding:12px; font-weight:bold; direction:ltr;">${((item.qty || 0) * (item.cost || 0)).toFixed(2)} SAR</td>
                        <td style="padding:12px; text-align:center;">
                            <button class="btn-edit-svc" onclick="appLogic.editConsumable('${item.id}')">
                                <i class="fa-solid fa-edit"></i> ${lang === 'en' ? 'Edit' : 'تعديل'}
                            </button>
                            <button class="btn-delete-svc" onclick="appLogic.deleteConsumable('${item.id}')" style="margin-right: 5px;">
                                <i class="fa-solid fa-trash"></i> ${lang === 'en' ? 'Delete' : 'حذف'}
                            </button>
                        </td>
                    </tr>`;
                });
                html += `</tbody></table>`;
            }
            html += `</div>`;

            // Laundry Services Section
            html += `
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
                <h3 style="margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">${lang === 'en' ? 'Laundry Services & Prices' : 'خدمات المغسلة وأسعارها (Laundry Services)'}</h3>
                <div style="overflow-x: auto;">
                    <table class="inventory-table">
                        <thead>
                            <tr>
                                <th>${lang === 'en' ? 'Icon' : 'الأيقونة'}</th>
                                <th>${lang === 'en' ? 'Service Name' : 'اسم الخدمة'}</th>
                                <th>${lang === 'en' ? 'Category' : 'الفئة'}</th>
                                <th>${lang === 'en' ? 'Iron' : 'كوي'}</th>
                                <th>${lang === 'en' ? 'Wash+Iron' : 'غسيل+كوي'}</th>
                                <th>${lang === 'en' ? 'Wash' : 'غسيل'}</th>
                                <th>${lang === 'en' ? 'Express Fee' : 'رسم السريع'}</th>
                                <th style="text-align:center;">${lang === 'en' ? 'Actions' : 'إجراءات'}</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

            const services = window.appLogic.services || [];
            if (Array.isArray(services)) {
                services.forEach(item => {
                    if (!item) return;
                    const isVatActive = !!(window.tenantSettings && window.tenantSettings.taxNumber && window.tenantSettings.taxNumber.trim() !== "");
                    const p = item.prices || {};
                    let iron = parseFloat(p.iron) || 0;
                    let washIron = parseFloat(p.wash_iron) || 0;
                    let wash = parseFloat(p.wash) || 0;

                    if (isVatActive) {
                        iron *= 1.15;
                        washIron *= 1.15;
                        wash *= 1.15;
                    }

                    let expLbl = '0.00';
                    if (item.expressFee) {
                        if (typeof item.expressFee === 'object') expLbl = 'متغير';
                        else expLbl = `+${(parseFloat(item.expressFee) * (isVatActive ? 1.15 : 1)).toFixed(2)}`;
                    }

                    html += `
                        <tr style="border-bottom:1px solid var(--border);">
                            <td style="padding:12px;"><i class="fa-solid ${item.icon || 'fa-shirt'}" style="font-size:20px; color:var(--primary);"></i></td>
                            <td style="padding:12px; font-weight:bold;">${item.name || 'N/A'}</td>
                            <td style="padding:12px;">${item.cat === 'men' ? (lang === 'en' ? 'Men' : 'رجالي') : (item.cat === 'women' ? (lang === 'en' ? 'Women' : 'نسائي') : (lang === 'en' ? 'Misc' : 'أخرى'))}</td>
                            <td style="padding:12px; color:var(--primary); font-weight:bold;">${iron.toFixed(2)}</td>
                            <td style="padding:12px; color:var(--primary); font-weight:bold;">${washIron.toFixed(2)}</td>
                            <td style="padding:12px; color:var(--primary); font-weight:bold;">${wash.toFixed(2)}</td>
                            <td style="padding:12px; color:#4CAF50; font-weight:bold;">${expLbl}</td>
                            <td style="padding:12px; text-align:center;">
                                <button class="btn-edit-svc" onclick="appLogic.openEditServiceModal('${item.id}')">
                                <i class="fa-solid fa-edit"></i> ${lang === 'en' ? 'Edit' : 'تعديل'}
                                </button>
                                <button class="btn-delete-svc" onclick="appLogic.deleteService('${item.id}')" style="margin-right: 5px;">
                                <i class="fa-solid fa-trash"></i> ${lang === 'en' ? 'Delete' : 'حذف'}
                                </button>
                            </td>
                        </tr>`;
                });
            }
            html += `</tbody></table></div></div>`;

            container.innerHTML = html;
            console.log('[UI] renderInventory completed successfully.');
        } catch (err) {
            console.error('[UI] Critical failure in renderInventory:', err);
            container.innerHTML = `<div style="color:red; padding:20px;">خطأ في تحميل الجدول: ${err.message}</div>`;
        }
    },

    // Service Management Logic
    openAddServiceModal() {
        this.resetServiceForm();
        document.getElementById('service-modal-title').innerHTML = '<i class="fa-solid fa-plus"></i> إضافة خدمة جديدة';
        document.getElementById('service-id').value = '';
        this.renderIconPicker();
        document.getElementById('service-modal').classList.remove('hidden');
    },

    openEditServiceModal(id) {
        this.resetServiceForm();
        const service = this.services.find(s => s.id === id);
        if (!service) return;

        document.getElementById('service-modal-title').innerHTML = '<i class="fa-solid fa-edit"></i> تعديل الخدمة';
        document.getElementById('service-id').value = service.id;
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-cat').value = service.cat;
        document.getElementById('service-icon').value = service.icon;
        document.getElementById('price-iron').value = service.prices.iron;
        document.getElementById('price-wash-iron').value = service.prices.wash_iron;
        document.getElementById('price-wash').value = service.prices.wash;
        document.getElementById('price-express-fee').value = service.expressFee;

        this.renderIconPicker(service.icon);
        document.getElementById('service-modal').classList.remove('hidden');
    },

    closeServiceModal() {
        document.getElementById('service-modal').classList.add('hidden');
    },

    resetServiceForm() {
        document.getElementById('service-name').value = '';
        document.getElementById('service-cat').value = 'men';
        document.getElementById('service-icon').value = 'fa-shirt';
        document.getElementById('price-iron').value = '0.00';
        document.getElementById('price-wash-iron').value = '0.00';
        document.getElementById('price-wash').value = '0.00';
        document.getElementById('price-express-fee').value = '0.00';
    },

    renderIconPicker(selectedIcon = 'fa-shirt') {
        const grid = document.getElementById('icon-picker-grid');
        grid.innerHTML = '';
        AvailableIcons.forEach(icon => {
            const btn = document.createElement('div');
            btn.className = `icon-picker-item ${icon === selectedIcon ? 'active' : ''}`;
            btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
            btn.onclick = () => {
                document.getElementById('service-icon').value = icon;
                this.renderIconPicker(icon);
            };
            grid.appendChild(btn);
        });
    },

    async saveService() {
        const id = document.getElementById('service-id').value;
        const name = document.getElementById('service-name').value;
        const cat = document.getElementById('service-cat').value;
        const icon = document.getElementById('service-icon').value;
        const pIron = parseFloat(document.getElementById('price-iron').value);
        const pWashIron = parseFloat(document.getElementById('price-wash-iron').value);
        const pWash = parseFloat(document.getElementById('price-wash').value);
        const pExpFee = parseFloat(document.getElementById('price-express-fee').value);

        if (!name) { alert('يرجى إدخال اسم الخدمة'); return; }

        let newService = {
            id: id || `SRV-${Date.now()}`,
            name, cat, icon,
            prices: { iron: pIron, wash_iron: pWashIron, wash: pWash },
            expressFee: pExpFee
        };

        if (id) {
            const idx = this.services.findIndex(s => s.id === id);
            if (idx !== -1) this.services[idx] = newService;
        } else {
            this.services.unshift(newService);
        }

        await localforage.setItem('services', this.services);
        await manualSyncToCloud('services', this.services);
        this.closeServiceModal();
        this.renderInventory();
        this.renderItems(); // Refresh POS grid
        this.showToast('تم حفظ بيانات الخدمة بنجاح');
    },

    async deleteService(id) {
        if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

        const idx = this.services.findIndex(s => s.id === id);
        if (idx === -1) return;

        console.log(`[Admin] Deleting service: ${id}`);
        this.services.splice(idx, 1);

        // 1. Persist to local storage
        await localforage.setItem('services', this.services);

        // 2. Explicit manual sync to cloud (Senior Data Architect Rule)
        await manualSyncToCloud('services', this.services);

        // 3. UI Refresh
        this.renderInventory();
        this.renderItems();
        this.showToast('تم حذف الخدمة بنجاح');
    },

    renderDeliveryManager() {
        try {
            const container = document.getElementById('delivery-manager-content');
            if (!container) return;
            const lang = this.currentLang || 'ar';
            const thName = lang === 'en' ? 'Option Name' : 'اسم الخيار';
            const thAmt = lang === 'en' ? 'Amount (SAR)' : 'المبلغ (ر.س)';
            const thAct = lang === 'en' ? 'Actions' : 'إجراءات';

            let html = `
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th style="padding:12px; text-align:right;">${thName}</th>
                            <th style="padding:12px; text-align:right;">${thAmt}</th>
                            <th style="padding:12px; text-align:center;">${thAct}</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            const deliveryArray = Array.isArray(this.deliveryOptions) ? this.deliveryOptions : [];
            deliveryArray.forEach(opt => {
                if (!opt) return;
                const amt = parseFloat(opt.amount) || 0;
                html += `
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:12px; font-weight:bold;">${opt.name || 'Unknown'}</td>
                        <td style="padding:12px; direction:ltr; text-align:right;">${amt.toFixed(2)} SAR</td>
                        <td style="padding:12px; text-align:center;">
                            <button class="btn-action-icon btn-action-edit" onclick="appLogic.openAddDeliveryModal('${opt.id}')"><i class="fa-solid fa-edit"></i></button>
                            <button class="btn-action-icon btn-action-delete" onclick="appLogic.deleteDeliveryOption('${opt.id}')"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });

            if (deliveryArray.length === 0) {
                const emptyMsg = lang === 'en' ? 'No delivery options currently.' : 'لا يوجد خيارات توصيل حالياً.';
                html += `<tr><td colspan="3" style="text-align:center; padding:20px;">${emptyMsg}</td></tr>`;
            }

            html += '</tbody></table>';
            container.innerHTML = html;
        } catch (err) {
            console.error('[UI] Crash in renderDeliveryManager:', err);
        }
    },

    openAddDeliveryModal(id = null) {
        const idField = document.getElementById('delivery-id');
        const nameField = document.getElementById('delivery-name');
        const amountField = document.getElementById('delivery-amount');
        const title = document.getElementById('delivery-modal-title');

        if (id) {
            const opt = this.deliveryOptions.find(o => o.id === id);
            idField.value = id;
            nameField.value = opt.name;
            amountField.value = opt.amount;
            title.innerText = "تعديل خيار توصيل";
        } else {
            idField.value = "";
            nameField.value = "";
            amountField.value = "";
            title.innerText = "إضافة خيار توصيل";
        }
        document.getElementById('delivery-modal').classList.remove('hidden');
    },

    closeDeliveryModal() {
        document.getElementById('delivery-modal').classList.add('hidden');
    },

    async saveDeliveryOption() {
        const id = document.getElementById('delivery-id').value;
        const name = document.getElementById('delivery-name').value;
        const amt = parseFloat(document.getElementById('delivery-amount').value);

        if (!name || isNaN(amt)) {
            alert('يرجى كتابة الاسم والمبلغ');
            return;
        }

        if (id) {
            const idx = this.deliveryOptions.findIndex(o => o.id === id);
            if (idx !== -1) {
                this.deliveryOptions[idx] = Object.assign({}, this.deliveryOptions[idx], { name: name, amount: amt });
            }
        } else {
            this.deliveryOptions.push({
                id: 'del_' + Date.now(),
                name: name,
                amount: amt
            });
        }

        await localforage.setItem('delivery_options', this.deliveryOptions);

        // Non-blocking background sync
        manualSyncToCloud('delivery_options', this.deliveryOptions);

        this.closeDeliveryModal();
        this.renderDeliveryManager(); // Update local table directly
        this.renderCheckoutDeliveryButtons(); // Ensures POS checkout updates
        this.updateCartUI();
        this.showToast('تم حفظ رسوم التوصيل');
    },

    async deleteDeliveryOption(id) {
        if (!confirm('هل أنت متأكد من حذف خيار التوصيل؟')) return;

        this.deliveryOptions = this.deliveryOptions.filter(o => o.id !== id);

        await localforage.setItem('delivery_options', this.deliveryOptions);

        // Non-blocking background sync
        manualSyncToCloud('delivery_options', this.deliveryOptions);

        this.renderDeliveryManager(); // Render table immediately
        this.renderCheckoutDeliveryButtons(); // Render POS immediately 
        this.showToast('تم حذف خيار التوصيل بنجاح');
    },

    // Consolidated Operating Expenses (Transplanted Table UI)
    // Consolidated Operating Expenses (Dual-Table Layout)
    async renderExpenses() {
        try {
            const container = document.getElementById('expenses-content');
            if (!container) return;

            const exps = await localforage.getItem('expenses') || [];
            const laundryBalances = await localforage.getItem('laundry_balances') || {};
            const invoices = await localforage.getItem('invoices') || [];

            let html = '';

            const lang = this.currentLang || 'ar';
            const expTitle = lang === 'en' ? 'General Expenses' : 'المصروفات العامة (General Expenses)';
            const noExp = lang === 'en' ? 'No manual expenses recorded' : 'لا توجد مصروفات يدوية مسجلة';
            const thDate = lang === 'en' ? 'Date' : 'التاريخ';
            const thCat = lang === 'en' ? 'Category' : 'التصنيف';
            const thDesc = lang === 'en' ? 'Description' : 'البيان';
            const thAmt = lang === 'en' ? 'Amount (SAR)' : 'المبلغ (SAR)';

            // --- TABLE 1: GENERAL EXPENSES (Manual Entries) ---
            html += `
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; margin-bottom:30px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:15px;">
                    <h3 style="color:var(--primary); font-size:16px;"><i class="fa-solid fa-receipt"></i> ${expTitle}</h3>
                </div>
                ${exps.length === 0 ? `<p style="color:var(--text-muted); text-align:center; padding:10px;">${noExp}</p>` : `
                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse:collapse; text-align:right;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border); color:var(--text-muted); font-size:12px;">
                                <th style="padding:10px;">${thDate}</th>
                                <th style="padding:10px;">${thCat}</th>
                                <th style="padding:10px;">${thDesc}</th>
                                <th style="padding:10px; text-align:left;">${thAmt}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${exps.sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => `
                                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                                    <td style="padding:10px; color:#ccc; font-size:13px;">${e.date}</td>
                                    <td style="padding:10px;"><span style="background:rgba(130, 109, 234, 0.2); color:#826dea; padding:3px 8px; border-radius:4px; font-size:11px;">${e.category}</span></td>
                                    <td style="padding:10px; color:#fff; font-size:13px;">${e.desc}</td>
                                    <td style="padding:10px; color:#ff4538; font-weight:bold; direction:ltr; text-align:left;">- ${parseFloat(e.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `}
            </div>
            `;

            // --- TABLE 2: PARTNER ACCOUNTS (Laundries) ---
            const laundryMap = {};
            Object.keys(laundryBalances).forEach(key => {
                const [name, hood] = key.split('|');
                laundryMap[key] = { name, hood, dues: laundryBalances[key].balance || 0, paid: 0 };
            });

            invoices.forEach(i => {
                if (!i || !i.partnerLaundryName || i.partnerLaundryName.trim() === '') return;
                const name = i.partnerLaundryName.trim();
                const hood = (i.partnerLaundryNeighborhood || '').trim();
                const compKey = `${name}|${hood}`;
                const cost = parseFloat(i.laundryCost || i.partnerLaundryCost || 0);
                if (cost <= 0) return;
                if (!laundryMap[compKey]) laundryMap[compKey] = { name, hood, dues: 0, paid: 0 };
                if (i.laundryPaid === true) laundryMap[compKey].paid += cost;
            });

            const keys = Object.keys(laundryMap).sort();

            // Calculate column totals
            let totalDues = 0;
            let totalPaid = 0;
            keys.forEach(k => {
                totalDues += (laundryMap[k].dues || 0);
                totalPaid += (laundryMap[k].paid || 0);
            });

            const partnerTitle = lang === 'en' ? 'Partner Laundry Accounts' : 'حسابات المغاسل المتعاونة';
            const noPartners = lang === 'en' ? 'No partner accounts registered' : 'لا توجد حسابات شركاء مسجلة';
            const thName = lang === 'en' ? 'Laundry / Neighborhood' : 'اسم المغسلة / الحي';
            const thDues = lang === 'en' ? 'Dues (Owed)' : 'المستحقات (ذمة)';
            const thPaid = lang === 'en' ? 'Previous Payments (Paid)' : 'المدفوعات السابقة (Paid)';
            const thActions = lang === 'en' ? 'Actions' : 'إجراءات (Actions)';
            const settleBtn = lang === 'en' ? 'Settle' : 'تسديد';
            const settledLbl = lang === 'en' ? 'Fully Settled' : 'مُسددة بالكامل';
            const grandTotalLbl = lang === 'en' ? 'Grand Total' : 'المجموع الإجمالي';

            html += `
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:15px;">
                    <h3 style="color:var(--primary); font-size:16px;"><i class="fa-solid fa-handshake"></i> ${partnerTitle}</h3>
                </div>
                ${keys.length === 0 ? `<p style="color:var(--text-muted); text-align:center; padding:10px;">${noPartners}</p>` : `
                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse:collapse; background:var(--bg-body); border-radius:8px; overflow:hidden;">
                        <thead>
                            <tr style="background:#111; color:var(--primary); font-size:12px;">
                                <th style="padding:12px; text-align:right;">${thName}</th>
                                <th style="padding:12px; text-align:right;">${thDues}</th>
                                <th style="padding:12px; text-align:right;">${thPaid}</th>
                                <th style="padding:12px; text-align:center;">${thActions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${keys.map(key => {
                const data = laundryMap[key];
                const displayName = data.hood ? `${data.name} <small style="color:#888;">(${data.hood})</small>` : data.name;
                const safeKey = key.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                return `
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:15px; font-weight:bold; color:#fff;">${displayName}</td>
                                    <td style="padding:15px; font-weight:bold; color:${data.dues > 0 ? '#ff4538' : '#fff'}; direction:ltr; text-align:right;">${data.dues.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</td>
                                    <td style="padding:15px; font-weight:bold; color:#4CAF50; direction:ltr; text-align:right;">${data.paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</td>
                                    <td style="padding:15px; text-align:center;">
                                        ${data.dues > 0 ? `<button class="btn" style="background:var(--primary); color:#000; padding:8px 16px; font-weight:900; border:none; border-radius:6px; font-size:13px; cursor:pointer;" onclick="appLogic.settleAllLaundryDues('${safeKey}')"><i class="fa-solid fa-money-check-dollar"></i> ${settleBtn}</button>` : `<span style="color:#4CAF50; font-size:12px; font-weight:bold;">${settledLbl} <i class="fa-solid fa-circle-check"></i></span>`}
                                    </td>
                                </tr>
                                `;
            }).join('')}
                            <tr style="background:#111; border-top:2px solid var(--border); font-weight:900;">
                                <td style="padding:15px; color:var(--primary);">${grandTotalLbl}</td>
                                <td style="padding:15px; color:#ff4538; direction:ltr; text-align:right;">${totalDues.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</td>
                                <td style="padding:15px; color:#4CAF50; direction:ltr; text-align:right;">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</td>
                                <td style="padding:15px;">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `}
            </div>
            `;

            container.innerHTML = html;
        } catch (err) { console.error('Error rendering consolidated expenses:', err); }
    },

    // Wafeq UI: Expenses
    openAddExpenseModal() {
        document.getElementById('add-expense-modal').classList.remove('hidden');
        document.getElementById('expense-date').value = getLocalYMD();
    },
    closeExpenseModal() { document.getElementById('add-expense-modal').classList.add('hidden'); },
    async saveExpense() {
        let cat = document.getElementById('exp-category').value;
        let amount = parseFloat(document.getElementById('exp-amount').value);
        let desc = document.getElementById('exp-desc').value;
        let date = document.getElementById('expense-date').value;

        if (!amount || !desc || !date) { alert('يرجى تعبئة كافة الحقول لحفظ التقييد المحاسبي!'); return; }

        let exps = await localforage.getItem('expenses') || [];
        const newExpense = {
            id: Date.now(),
            timestamp: Date.now(),
            category: cat,
            amount: amount,
            desc: desc,
            date: date
        };

        exps.push(newExpense);

        await localforage.setItem('expenses', exps);
        localStorage.setItem('expenses', JSON.stringify(exps));
        await manualSyncToCloud('expenses', exps);

        this.closeExpenseModal();
        this.renderExpenses();
        this.renderReports();
        this.showToast('تم تقييد المصروف بنجاح وتسجيله بالدفتر');

        // Reset fields
        document.getElementById('exp-amount').value = 0;
        document.getElementById('exp-desc').value = '';
        document.getElementById('expense-date').value = '';
    },

    async clearExpenses() {
        if (!confirm('هل أنت متأكد من مسح جميع المصروفات التشغيلية نهائياً؟')) return;

        await localforage.setItem('expenses', []);
        localStorage.removeItem('expenses'); // Clear redundant backup
        await manualSyncToCloud('expenses', []);

        this.renderExpenses();
        this.renderReports();
        this.showToast('تم تصفير جميع المصروفات التشغيلية');
    },

    async renderReports() {
        const lang = this.currentLang || 'ar';
        const activeInvs = await localforage.getItem('invoices') || [];
        const activeExps = await localforage.getItem('expenses') || [];
        const archives = await localforage.getItem('archived_z_reports') || [];

        let Math_invoices = [].concat(activeInvs);
        let Math_exps = [].concat(activeExps);

        archives.forEach(arc => {
            if (arc.invoices) { Array.prototype.push.apply(Math_invoices, arc.invoices); }
            if (arc.expenses) { Array.prototype.push.apply(Math_exps, arc.expenses); }
        });

        const invoices = Math_invoices;
        const exps = Math_exps;
        let taxRecords = await localforage.getItem('tax_records') || [];
        // ---------------------------------------------------------
        // 🗓️ DATE FILTER LOGIC — Reads from single source: currentViewDate
        // ---------------------------------------------------------
        const todayYMD = getLocalYMD();
        const isLiveShift = !this.currentViewDate || this.currentViewDate === todayYMD;

        // Sync reportFilterDate with currentViewDate for backward compatibility
        this.reportFilterDate = isLiveShift ? null : this.currentViewDate;

        // Use a local constant — never modify state inside render to prevent loops
        const currentTargetDate = this.currentViewDate || todayYMD;

        let filterLabel = isLiveShift ? `اليوم ${todayYMD} (Live Shift)` : `📅 عرض تاريخ: ${currentTargetDate}`;
        let startBound, endBound;

        if (!isLiveShift) {
            // Historical view: selected date midnight → 23:59:59
            const parts = currentTargetDate.split('-');
            const y = parseInt(parts[0]), m = parseInt(parts[1]) - 1, d = parseInt(parts[2]);
            startBound = new Date(y, m, d, 0, 0, 0, 0).getTime();
            endBound = new Date(y, m, d, 23, 59, 59, 999).getTime();
        } else {
            // Live Shift: today's boundaries in local time
            const now = new Date();
            const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
            startBound = new Date(y, m, d, 0, 0, 0, 0).getTime();
            endBound = new Date(y, m, d, 23, 59, 59, 999).getTime();
        }

        const weekAgo = startBound - (7 * 24 * 60 * 60 * 1000);
        const monthAgo = startBound - (30 * 24 * 60 * 60 * 1000);
        const yearAgo = startBound - (365 * 24 * 60 * 60 * 1000);

        let salesToday = 0, salesWeek = 0, salesMonth = 0, salesYear = 0;
        const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthlyMap = {};

        // Active Dashboard Totals (Filtered by Selected Date)
        let totalAllInvoices = 0;
        let totalRefunds = 0;
        let totalOperatingExpenses = 0;
        let totalLaundryDebt = 0;
        let totalUncollected = 0; // NEW TRACKER
        let totalCollected = 0;   // Collected amounts

        // 1. Process Invoices
        let cashTotal = 0, madaTotal = 0, visaTotal = 0, mastercardTotal = 0;
        invoices.forEach(i => {
            if (!i) return;
            const amt = parseFloat(i.total || i.grandTotal || 0);
            const rTime = new Date(i.date || i.timestamp).getTime();

            // If Live Shift: only show what hasn't been closed.
            // If History: show everything for that selected date.
            const matchesShift = isLiveShift ? !i.isZReported : true;

            // DYNAMIC ROLLING TOTALS
            const isInRange = (rTime >= startBound && (endBound === Infinity || rTime <= endBound));

            let refundAmt = parseFloat(i.refundAmount || 0);
            if (i.isCancelled) refundAmt = amt; // if fully cancelled previously without refundAmount prop
            const netAmt = amt - refundAmt;
            const isUnpaid = i.paymentStatus === 'unpaid';

            // Today's sales honors the Z-Report wipe (matchesShift) per user preference
            if (isInRange && matchesShift) {
                salesToday += netAmt; // ✅ Total Sales ALWAYS includes everything (Cash + Card + Pay Later)
                if (isUnpaid) {
                    totalUncollected += netAmt; // ✅ Uncollected (Pay Later)
                } else {
                    totalCollected += netAmt;   // ✅ Collected (Paid)
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
            const key = `${year}-${String(mIdx + 1).padStart(2, '0')}`;
            const monthName = (this.currentLang === 'en') ? monthsEn[mIdx] : monthsAr[mIdx];
            const label = `${monthName} ${year.toString()}`;
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
            }
        });

        // 2. Process Expenses (STRICT UI-BOUND MATCH)
        let opExpsAudit = [];
        exps.forEach(e => {
            if (!e) return;
            // Strict YYYY-MM-DD match prevents yesterday's items from "bleeding" via timestamps
            const matchesShift = isLiveShift ? !e.isZReported : true;
            if (e.date === currentTargetDate && matchesShift) {
                const amt = parseFloat(e.amount) || 0;
                totalOperatingExpenses += amt;
                opExpsAudit.push({ category: e.category, desc: e.desc, amount: amt, date: e.date });
            }
        });
        console.log(`[Operating Expenses Breakdown for ${currentTargetDate}]:`, opExpsAudit);

        // 3. Laundry Debt (Handled independently as a Cumulative Balance)
        // Note: For historical reports, we might want the point-in-time debt, 
        // but as per current logic, the box shows the current cumulative balance.
        const laundryBalances = await localforage.getItem('laundry_balances') || {};
        Object.values(laundryBalances).forEach(b => {
            totalLaundryDebt += parseFloat(b.balance || 0);
        });

        // FINAL COMPREHENSIVE FINANCIAL MATH (Gross - Refunds - Operating Expenses)
        let totalNetRevenue = totalAllInvoices - totalRefunds;
        let netProfit = totalNetRevenue - totalOperatingExpenses;

        let html = `
        ${!isLiveShift ? `
        <div style="background: rgba(253,184,19,0.1); border:1px solid var(--primary); border-radius:var(--radius-md); padding:12px 18px; margin-bottom:18px; display:flex; align-items:center; gap:12px;">
            <i class="fa-solid fa-clock-rotate-left" style="color:var(--primary); font-size:20px;"></i>
            <div>
                <div style="font-size:14px; font-weight:800; color:var(--primary);">${lang === 'en' ? 'Historical View Mode' : 'وضع الاستعراض التاريخي'}</div>
                <div style="font-size:12px; color:var(--text-muted);">${lang === 'en' ? `Showing data for ${currentTargetDate} only. Daily closure is disabled in this mode.` : `تعرض الأرقام بيانات يوم ${currentTargetDate} فقط. لا يمكن إغلاق اليومية في هذا الوضع.`}</div>
            </div>
            <button class="btn" onclick="appLogic.resetReportFilter()" style="margin-right:auto; background:var(--primary); color:#000; padding:8px 16px; font-size:12px; font-weight:800; border:none; border-radius:8px; cursor:pointer;">
                <i class="fa-solid fa-rotate-left"></i> ${lang === 'en' ? 'Back to Today' : 'العودة لليوم الحالي'}
            </button>
        </div>` : ''}
        <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:15px; margin-bottom:25px; display:flex; justify-content:space-between; align-items:center; box-shadow:var(--shadow-sm);">
            <div>
                <h2 style="font-size:18px; color:var(--primary); margin-bottom:3px;"><i class="fa-solid fa-calendar-check"></i> ${lang === 'en' ? 'Financial Data for Date:' : 'عرض البيانات المالية لـ:'} ${currentTargetDate}</h2>
                <p style="font-size:12px; color:var(--text-muted); margin:0;">${lang === 'en' ? 'Select a date to review past financial operations and performance.' : 'اختر تاريخاً لمراجعة الأداء والعمليات المالية السابقة.'}</p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="date" lang="en" dir="ltr" value="${currentTargetDate}" onchange="appLogic.filterReportsByDate(this.value)" style="color-scheme: dark; cursor: pointer; background:#000; color:#fff; border:1px solid var(--border); padding:10px; border-radius:8px; font-size:14px; outline:none; text-align:center; font-family: system-ui, -apple-system, Arial, sans-serif !important; font-variant-numeric: tabular-nums;">
                <button class="btn" style="background:rgba(253,184,19,0.1); color:var(--primary); padding:10px 15px; font-size:12px; font-weight:bold; border:1px solid var(--primary); border-radius:8px;" onclick="appLogic.resetReportFilter()">${lang === 'en' ? 'Today' : 'اليوم'} <i class="fa-solid fa-rotate-left"></i></button>
            </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-bottom:40px;">
            
            <!-- 1. Gross Sales -->
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">${lang === 'en' ? 'Gross Sales' : 'إجمالي المبيعات (Gross Sales)'}</h3>
                <div id="db-gross-sales" style="font-size:24px; font-weight:800; direction:ltr; color:var(--text-main);">${totalAllInvoices.toFixed(2)} ر.س</div>
            </div>

            <!-- 2. Refunds -->
            <div style="background:var(--bg-surface); border:1px solid rgba(255, 69, 58, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">${lang === 'en' ? 'Refunds' : 'إجمالي المرتجعات (Refunds)'}</h3>
                <div id="db-refunds" style="font-size:24px; font-weight:800; direction:ltr; color:#ff453a;">- ${totalRefunds.toFixed(2)} ر.س</div>
            </div>

            <!-- 3. Net Revenue -->
            <div style="background:var(--bg-surface); border:1px solid rgba(76, 175, 80, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">${lang === 'en' ? 'Net Revenue' : 'صافي الإيرادات (Net Revenue)'}</h3>
                <div id="db-net-revenue" style="font-size:24px; font-weight:800; direction:ltr; color:#4CAF50;">${totalNetRevenue.toFixed(2)} ر.س</div>
            </div>

            <!-- 4. Operating Expenses (NEW BOX) -->
            <div style="background:var(--bg-surface); border:1px solid rgba(255, 69, 58, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">${lang === 'en' ? 'Total Operating Expenses' : 'إجمالي المصاريف التشغيلية'}</h3>
                <div id="db-op-expenses-display" style="font-size:24px; font-weight:800; direction:ltr; color:#ff453a;">- ${totalOperatingExpenses.toFixed(2)} ر.س</div>
            </div>

            <!-- Collected Amounts (Paid Invoices) -->
            <div style="background:var(--bg-surface); border:1px solid rgba(14, 165, 233, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">${lang === 'en' ? 'Collected Amounts' : 'المبالغ المحصلة (مقبوضات)'}</h3>
                <div id="db-collected-display" style="font-size:24px; font-weight:800; direction:ltr; color:#0ea5e9;">${totalCollected.toFixed(2)} ر.س</div>
            </div>

            <!-- Uncollected Amounts (Pay Later) -->
            <div style="background:var(--bg-surface); border:1px solid rgba(245, 158, 11, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">${lang === 'en' ? 'Uncollected Amounts (Rolling Balance)' : 'مبالغ غير محصلة (رصيد تراكمي)'}</h3>
                <div id="db-uncollected-display" style="font-size:24px; font-weight:800; direction:ltr; color:#f59e0b;">${totalUncollected.toFixed(2)} ر.س</div>
            </div>

            <!-- 6. FINAL NET PROFIT OVERLAY (Full Width) -->
            <div style="grid-column: 1 / -1; background:var(--bg-elevated); border:2px solid var(--primary); border-radius:var(--radius-md); padding:25px; text-align:center; box-shadow:var(--shadow-lg);">
                <h3 style="color:var(--text-muted); font-size:15px; margin-bottom:10px;">${lang === 'en' ? 'Net Profit' : 'صافي الربح النهائي (Net Profit)'}</h3>
                <div id="db-net-profit" style="font-size:42px; font-weight:900; color:${netProfit >= 0 ? 'var(--primary)' : '#ff453a'}; direction:ltr; text-shadow:0 0 20px rgba(253,184,19,0.1);">
                    ${netProfit.toFixed(2)} <span style="font-size:20px;"> ر.س</span>
                </div>
                <p style="margin-top:10px; font-size:12px; color:var(--text-muted); opacity:0.8;">${lang === 'en' ? '[Net Revenue] - [Total Expenses]' : '[صافي الإيراد] - [إجمالي المصروفات والسداد]'}</p>
            </div>
            
            <!-- Hidden Sync Data (For 100% Reliable Z-Report Scrape) -->
            <div id="db-sync-data" style="display:none;" 
                 data-gross="${totalAllInvoices.toFixed(2)}"
                 data-refunds="${totalRefunds.toFixed(2)}"
                 data-net-rev="${totalNetRevenue.toFixed(2)}"
                 data-profit="${netProfit.toFixed(2)}"
                 data-opex="${totalOperatingExpenses.toFixed(2)}"
                 data-cash="${cashTotal.toFixed(2)}"
                 data-mada="${madaTotal.toFixed(2)}"
                 data-visa="${visaTotal.toFixed(2)}"
                 data-mastercard="${mastercardTotal.toFixed(2)}"
                 data-collected="${totalCollected.toFixed(2)}"
                 data-uncollected="${totalUncollected.toFixed(2)}">
            </div>
        </div>

        <!-- End of Day Closure Button -->
        <div style="text-align: center; margin-bottom: 40px; background: rgba(87, 67, 177, 0.05); padding: 30px; border-radius: var(--radius-md); border: 2px dashed var(--primary);">
            <h3 style="color: var(--text-main); margin-bottom: 10px;">${lang === 'en' ? 'Close Accounting Day' : 'إغلاق اليومية (Close Accounting Day)'}</h3>
            <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">${lang === 'en' ? 'A Z-Report will be issued and operations archived to start a new day.' : 'سيتم إصدار تقرير Z-Report وأرشفة العمليات الحالية لبدء يوم جديد.'}</p>
            <button class="btn btn-primary" onclick="appLogic.showZReportPreview()" style="padding: 16px 50px; font-size: 18px; font-weight: 900; background: var(--primary); color: #000; box-shadow: 0 4px 15px rgba(253, 184, 19, 0.3);">
                <i class="fa-solid fa-lock" style="margin-left: 10px;"></i> ${lang === 'en' ? 'Close Day (Review Figures)' : 'إغلاق اليومية (مراجعة الأرقام)'}
            </button>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; margin-bottom: 30px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:15px; margin-bottom:20px;">
                <div>
                    <h3 style="margin-bottom:5px; color:var(--text-main); font-size: 18px;"><i class="fa-solid fa-calendar-days" style="color:var(--primary); margin-left:8px;"></i> ${lang === 'en' ? 'Monthly Sales Breakdown' : 'مبيعات الأشهر (Monthly Sales Breakdown)'}</h3>
                    <p style="color:var(--text-muted); font-size:13px;">${lang === 'en' ? 'Detailed revenue breakdown grouped by month.' : 'تفصيل المبيعات الإيرادية مجمعة حسب الشهر والميلادي.'}</p>
                </div>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width:100%; border-collapse:collapse; text-align:right;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--border); color:var(--text-muted); font-size: 14px;">
                            <th style="padding:12px;">${lang === 'en' ? 'Period (Month / Year)' : 'الشهر / السنة (Period)'}</th>
                            <th style="padding:12px;">${lang === 'en' ? 'Total Revenue' : 'إجمالي المبيعات (Total Revenue)'}</th>
                            <th style="padding:12px; text-align:center;">${lang === 'en' ? 'Status' : 'الحالة (Status)'}</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        const sortedMonths = Object.values(monthlyMap).sort((a, b) => b.sortKey.localeCompare(a.sortKey));

        if (sortedMonths.length === 0) {
            html += `<tr><td colspan="3" style="padding:20px; text-align:center; color:var(--text-muted);">${lang === 'en' ? 'No sales recorded yet' : 'لا توجد مبيعات مسجلة حتى الآن'}</td></tr>`;
        } else {
            sortedMonths.forEach(m => {
                html += `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:14px; font-weight:700; color:#fff;">${m.label}</td>
                    <td style="padding:14px; font-weight:900; color:var(--primary); direction:ltr;">${m.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</td>
                    <td style="padding:14px; text-align:center;">
                        <span style="background:rgba(76, 175, 80, 0.15); color:#4CAF50; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:bold;">${lang === 'en' ? 'Archived' : 'محقق'}</span>
                    </td>
                </tr>`;
            });
        }

        html += `
                    </tbody>
                </table>
            </div>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:15px; margin-bottom:20px;">
                <div>
                    <h3 style="margin-bottom:5px; color:var(--text-main); font-size: 18px;"><i class="fa-solid fa-chart-bar" style="color:var(--primary); margin-left:8px;"></i> ${lang === 'en' ? 'Sales Analytics' : 'ملخص المبيعات (Sales Analytics)'}</h3>
                    <p style="color:var(--text-muted); font-size:13px;">${lang === 'en' ? 'Quick comparison of sales performance over time.' : 'مقارنة سريعة لأداء المبيعات خلال فترات زمنية للنشاط.'}</p>
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                <div style="background:linear-gradient(135deg, rgba(253,184,19,0.1), rgba(253,184,19,0.02)); border:1px solid rgba(253,184,19,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">${lang === 'en' ? 'Today\'s Sales' : 'مبيعات اليوم'}</div>
                    <div style="font-size:24px; font-weight:800; color:var(--primary); direction:ltr;">${salesToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(76,175,80,0.1), rgba(76,175,80,0.02)); border:1px solid rgba(76,175,80,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">${lang === 'en' ? 'Last 7 Days' : 'آخر 7 أيام'}</div>
                    <div style="font-size:24px; font-weight:800; color:#4CAF50; direction:ltr;">${salesWeek.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(33,150,243,0.1), rgba(33,150,243,0.02)); border:1px solid rgba(33,150,243,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">${lang === 'en' ? 'Last 30 Days' : 'آخر 30 يوم'}</div>
                    <div style="font-size:24px; font-weight:800; color:#2196F3; direction:ltr;">${salesMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(156,39,176,0.1), rgba(156,39,176,0.02)); border:1px solid rgba(156,39,176,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">${lang === 'en' ? 'Last 365 Days' : 'آخر 365 يوم'}</div>
                    <div style="font-size:24px; font-weight:800; color:#9c27b0; direction:ltr;">${salesYear.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR</div>
                </div>
            </div>
            </div>
        </div>
        `;

        // 💾 OFFLINE SYNC: BIND METRICS STRICTLY TO LOCALSTORAGE OUTSIDE INDEXEDDB
        localStorage.setItem('sahab_totalSales', totalAllInvoices);
        localStorage.setItem('sahab_uncollectedAmounts', totalUncollected);
        localStorage.setItem('sahab_cashTotal', cashTotal);
        localStorage.setItem('sahab_madaTotal', madaTotal);
        localStorage.setItem('sahab_visaTotal', visaTotal);
        localStorage.setItem('sahab_mastercardTotal', mastercardTotal);

        document.getElementById('reports-content').innerHTML = html;
    },

    // Consolidated Expenses (Moved to renderExpenses)
    async renderLaundryAccounts() {
        return this.renderExpenses();
    },

    async settleAllLaundryDues(compKey) {
        let [targetName, targetHood = ''] = compKey.split('|');
        let displayName = targetHood ? `${targetName} (${targetHood})` : targetName;

        // REPAIR GUARD: Ensure we have clean strings for comparison
        const cleanTargetName = targetName.trim().toLowerCase();
        const cleanTargetHood = targetHood.trim().toLowerCase();

        if (!confirm(`هل أنت متأكد من تسديد جميع المستحقات للمغسلة '${displayName}'?\n(سيتم تحويل حالة جميع الفواتير لهذه المغسلة إلى 'مدفوعة نقداً')`)) return;

        try {
            let invs = await localforage.getItem('invoices') || [];
            let updated = false;

            invs.forEach(i => {
                const pName = (i.partnerLaundryName || '').trim().toLowerCase();
                const pHood = (i.partnerLaundryNeighborhood || '').trim().toLowerCase();

                // Match with robust trim/case comparison
                if (pName === cleanTargetName && pHood === cleanTargetHood && !i.laundryPaid && parseFloat(i.laundryCost || i.partnerLaundryCost || 0) > 0) {
                    i.laundryPaid = true;
                    updated = true;
                }
            });

            if (updated) {
                // 1. Reset Cumulative Balance
                let balances = await localforage.getItem('laundry_balances') || {};
                const currentDue = (balances[compKey] && balances[compKey].balance) ? balances[compKey].balance : 0;

                if (balances[compKey]) {
                    balances[compKey].balance = 0;
                } else {
                    // Create if missing (e.g. for stuck entries)
                    balances[compKey] = { balance: 0 };
                }

                await localforage.setItem('laundry_balances', balances);
                localStorage.setItem('laundry_balances', JSON.stringify(balances));

                // 2. Record Settlement as Expense (Payout)
                if (currentDue > 0) {
                    let exps = await localforage.getItem('expenses') || [];
                    const settlementExpense = {
                        id: Date.now(),
                        timestamp: Date.now(),
                        category: 'تسديد مغاسل',
                        amount: currentDue,
                        desc: `تسديد مستحقات بالكامل: ${displayName}`,
                        date: getLocalYMD()
                    };
                    exps.push(settlementExpense);
                    await localforage.setItem('expenses', exps);
                    localStorage.setItem('expenses', JSON.stringify(exps));
                    await manualSyncToCloud('expenses', exps);
                }

                await localforage.setItem('invoices', invs);
                localStorage.setItem('invoices', JSON.stringify(invs)); // Force immediate update
                await manualSyncToCloud('invoices', invs);

                this.renderHistory();
                this.renderExpenses();
                this.renderReports();
                this.showToast(`تم تسديد مستحقات '${displayName}' بالكامل وتحديث الموقف المالي`);
            } else {
                // FORCE REPAIR for stuck entries (even if no invoices found, we zero the balance if user clicked settle)
                let balances = await localforage.getItem('laundry_balances') || {};
                if (balances[compKey]) balances[compKey].balance = 0;
                await localforage.setItem('laundry_balances', balances);
                localStorage.setItem('laundry_balances', JSON.stringify(balances));

                this.renderExpenses();
                this.showToast(`تم تصفير رصيد '${displayName}' يدوياً`);
            }
        } catch (err) {
            console.error('Error settling laundry dues:', err);
        }
    },

    // =====================================================
    // SAAS ADMIN DASHBOARD LOGIC
    // =====================================================
    async renderAdmin() {
        const container = document.getElementById('admin-stores-content');
        if (!container) return;
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--primary);"><i class="fa-solid fa-spinner fa-spin"></i> جاري تحميل بيانات المنصة...</div>';

        try {
            const snap = await firebase.database().ref('admin/stores').once('value');
            const stores = snap.val() || {};

            let html = `
                <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; box-shadow:var(--shadow-sm);">
                    <h3 style="margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px; color:var(--primary);">قائمة المشتركين النشطة (${Object.keys(stores).length} مغسلة)</h3>
                    <div style="overflow-x: auto;">
                        <table style="width:100%; border-collapse:collapse; text-align:right;">
                            <thead>
                                <tr style="border-bottom:2px solid var(--border); color:var(--text-muted); font-size:13px;">
                                    <th style="padding:12px;">تاريخ الإنشاء</th>
                                    <th style="padding:12px;">اسم المغسلة</th>
                                    <th style="padding:12px;">رقم الجوال</th>
                                    <th style="padding:12px;">الحالة</th>
                                    <th style="padding:12px; color:var(--primary);">الرمز PIN</th>
                                    <th style="padding:12px; text-align:center;">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            const sortedPins = Object.keys(stores).sort((a, b) => (stores[b].timestamp || 0) - (stores[a].timestamp || 0));

            if (sortedPins.length === 0) {
                html += '<tr><td colspan="6" style="padding:30px; text-align:center; color:var(--text-muted);">لا يوجد مغاسل مسجلة حالياً. استخدم النموذج أعلاه للبدء.</td></tr>';
            } else {
                sortedPins.forEach(pin => {
                    const s = stores[pin];
                    const date = s.timestamp ? new Date(s.timestamp).toLocaleDateString('en-US') : '-';
                    html += `
                        <tr style="border-bottom:1px solid var(--border);">
                            <td style="padding:14px; font-size:12px; color:var(--text-muted);">${date}</td>
                            <td style="padding:14px; font-weight:700; color:#fff;">${s.name}</td>
                            <td style="padding:14px; color:#fff;">${s.phone || '-'}</td>
                            <td style="padding:14px; text-align:right;">
                                <span style="background:${s.status !== 'expired' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}; 
                                             color:${s.status !== 'expired' ? '#22c55e' : '#ef4444'}; 
                                             padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; border:1px solid ${s.status !== 'expired' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};">
                                    ${s.status !== 'expired' ? 'نشط' : 'معطل'}
                                </span>
                            </td>
                            <td style="padding:14px; font-weight:900; color:var(--primary); font-size:18px; letter-spacing:2px;">
                                ${s.pin || s.password || (pin.length <= 6 ? pin : 'غير محدد')}
                            </td>
                            <td style="padding:14px; text-align:center;">
                                <button class="btn" style="background:${s.status !== 'expired' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'}; 
                                                          color:${s.status !== 'expired' ? '#ef4444' : '#22c55e'}; 
                                                          padding:5px 10px; border:1px solid ${s.status !== 'expired' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}; 
                                                          border-radius:4px; font-size:11px; cursor:pointer; margin-bottom:5px;" 
                                        onclick="appLogic.toggleStoreStatus('${pin}', '${s.status || 'active'}')">
                                    <i class="fa-solid ${s.status !== 'expired' ? 'fa-ban' : 'fa-check-circle'}"></i> 
                                    ${s.status !== 'expired' ? 'تعطيل' : 'تفعيل'}
                                </button>
                                <button class="btn" style="background:${s.canInstallPWA ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)'}; color:${s.canInstallPWA ? '#22c55e' : '#f59e0b'}; padding:5px 10px; border:1px solid ${s.canInstallPWA ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}; border-radius:4px; font-size:11px; cursor:pointer; margin-right:5px; margin-bottom:5px;" onclick="appLogic.togglePWAStatus('${pin}', ${!!s.canInstallPWA})">
                                    <i class="fa-solid ${s.canInstallPWA ? 'fa-mobile-screen' : 'fa-mobile'}"></i> ${s.canInstallPWA ? 'منع PWA' : 'سماح PWA'}
                                </button>
                                <button class="btn" style="background:rgba(245,158,11,0.1); color:#f59e0b; padding:5px 10px; border:1px solid rgba(245,158,11,0.2); border-radius:4px; font-size:11px; cursor:pointer; margin-right:5px; margin-bottom:5px;" onclick="appLogic.triggerFactoryReset('${pin}')" title="ضبط المصنع"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="btn" style="background:rgba(239,68,68,0.1); color:#ef4444; padding:5px 10px; border:1px solid rgba(239,68,68,0.2); border-radius:4px; font-size:11px; cursor:pointer; margin-right:5px; margin-bottom:5px;" onclick="appLogic.deleteStore('${pin}')">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }

            html += `</tbody></table></div></div>`;
            container.innerHTML = html;
        } catch (err) {
            console.error('[Admin] Dashboard error:', err);
            container.innerHTML = '<div style="color:red; padding:20px; text-align:center;">خطأ في تحميل لوحة الإدارة. تأكد من أنك Super Admin.</div>';
        }
    },

    async createStore() {
        const name = document.getElementById('admin-new-name').value.trim();
        const phone = document.getElementById('admin-new-phone').value.trim();
        const tax = document.getElementById('admin-new-tax').value.trim();

        if (!name) return alert('يرجى إدخال اسم المغسلة');

        // Generate clean 6-digit PIN
        let pin = '';
        for (let i = 0; i < 6; i++) pin += Math.floor(Math.random() * 10);

        // Collision check
        try {
            const check = await firebase.database().ref(`admin/stores/${pin}`).once('value');
            if (check.exists()) return this.createStore(); // retry

            const storeData = {
                name: name, phone: phone, taxNumber: tax,
                timestamp: Date.now(),
                status: 'active',
                canInstallPWA: false
            };
            await firebase.database().ref(`admin/stores/${pin}`).set(storeData);

            this.showToast(`تم إنشاء المغسلة بنجاح. PIN: ${pin}`);
            document.getElementById('admin-new-name').value = '';
            document.getElementById('admin-new-phone').value = '';
            document.getElementById('admin-new-tax').value = '';
            this.renderAdmin();
        } catch (err) {
            console.error('[Admin] Create Store failed:', err);
            alert('فشل في إنشاء الحساب الجديد.');
        }
    },

    async triggerFactoryReset(pin) {
        try {
            const storeSnap = await firebase.database().ref(`admin/stores/${pin}`).once('value');
            if (!storeSnap.exists()) return alert('المتجر غير موجود.');
            const storeData = storeSnap.val();
            const storeUID = storeData.uid;

            if (!storeUID) return alert('هذا المتجر غير مرتبط بحساب (UID مفقود).');

            const result = await Swal.fire({
                title: 'أنواع مسح البيانات (Factory Reset)',
                text: 'اختر نوع ضبط المصنع الذي ترغب به لهذا الحساب:',
                icon: 'warning',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'مسح جزئي (احتفاظ بالإعدادات)',
                denyButtonText: 'مسح شامل (نفس القديم)',
                cancelButtonText: 'إلغاء الأمر',
                customClass: {
                    confirmButton: 'swal2-confirm swal2-styled',
                    denyButton: 'swal2-deny swal2-styled',
                    cancelButton: 'swal2-cancel swal2-styled'
                }
            });

            if (!result.isConfirmed && !result.isDenied) return;

            const isSoft = result.isConfirmed;
            const newResetToken = (isSoft ? 'SOFT_' : 'HARD_') + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // Wipe Cloud Collections
            const collectionsToWipe = ['invoices', 'expenses', 'customers', 'journal_entries', 'tax_records', 'zreports', 'reports', 'archived_z_reports', 'laundry_balances', 'invoiceCounter'];

            // Wipe settings if Hard
            if (!isSoft) collectionsToWipe.push('settings');

            const deletePromises = collectionsToWipe.map(col =>
                firebase.database().ref(`users/${storeUID}/${col}`).remove()
            );
            await Promise.all(deletePromises);

            // Set reset token so devices wipe localDB
            await firebase.database().ref(`users/${storeUID}/accountDetails/resetToken`).set(newResetToken);

            Swal.fire('تم المسح', isSoft ? 'تم المسح الجزئي للبيانات والأرصدة (مع الاحتفاظ بالإعدادات)' : 'تم المسح الشامل (الضبط الكامل) بنجاح', 'success');

        } catch (err) {
            console.error('Error in factory reset:', err);
            alert('حدث خطأ أثناء ضبط المصنع');
        }
    },

    async toggleStoreStatus(pin, currentStatus) {
        const newStatus = (currentStatus === 'expired') ? 'active' : 'expired';
        console.log(`[Admin-Sync] Unifying status for PIN ${pin} to [${newStatus}]...`);
        try {
            const updates = {};
            updates[`admin/stores/${pin}/status`] = newStatus;

            await firebase.database().ref().update(updates);
            console.log(`[Admin-Sync] Successfully synchronized Firebase for PIN ${pin}`);

            this.showToast(newStatus === 'active' ? 'تم تفعيل الحساب بنجاح ✅' : 'تم تعطيل الحساب ⚠️');
            this.renderAdmin();
        } catch (err) {
            console.error('[Admin-Sync] Synchronization failed:', err);
            alert('فشل تحديث الحالة في قاعدة البيانات');
        }
    },

    async togglePWAStatus(pin, currentStatus) {
        const newStatus = !currentStatus;
        try {
            await firebase.database().ref(`admin/stores/${pin}/canInstallPWA`).set(newStatus);
            this.showToast(newStatus ? 'تم منح الإذن بتثبيت التطبيق 📱' : 'تم حجب الإذن بتثبيت التطبيق 🚫');
            this.renderAdmin();
        } catch (err) {
            console.error('[Admin] PWA toggle failed:', err);
            alert('فشل في تحديث إذن التثبيت.');
        }
    },

    async deleteStore(pin) {
        if (!confirm(`هل أنت متأكد من حذف هذه المغسلة (PIN: ${pin})؟\nهذا الإجراء لا يمكن التراجع عنه.`)) return;
        try {
            await firebase.database().ref(`admin/stores/${pin}`).remove();
            this.renderAdmin();
            this.showToast('تم الحذف بنجاح');
        } catch (err) {
            console.error('[Admin] Delete Store failed:', err);
        }
    },

    // =====================================================
    // AUTH & TENANT SETTINGS
    // =====================================================

    // --- New UI Validation for PIN --- 
    validatePinInput(el) {
        const btn = document.getElementById('login-btn');
        if (el.value.length === 6) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    },

    async loginWithPIN() {
        const pin = document.getElementById('pin-input').value.trim();
        const errEl = document.getElementById('login-error');
        const btn = document.getElementById('login-btn');
        errEl.classList.add('hidden');

        if (!pin) { errEl.classList.remove('hidden'); return; }

        // Final Length Check
        if (pin.length !== 6) {
            const lang = this.currentLang || 'ar';
            errEl.textContent = lang === 'en' ? "PIN must be exactly 6 digits." : "يجب أن يتكون الرمز من 6 أرقام.";
            errEl.classList.remove('hidden');
            return;
        }

        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...';
        btn.disabled = true;

        console.log(`[Smart-Gate] Directing traffic for PIN: [${pin}]`);

        try {
            // 1. Secret Master Admin Check: Redirect to Command Center
            if (pin === ADMIN_PIN) {
                console.log(`[Smart-Gate] AUTHORIZED: Persisting Master Auth and Redirecting...`);
                localStorage.setItem('sahab_master_authorized', 'true');
                window.location.href = 'sahab-master.html';
                return;
            }

            const email = `${pin}@sahab.pos`;

            // 2. Identity Resolution: PIN -> UID
            const pinSnap = await firebase.database().ref(`pincodes/${pin}`).once('value');
            const pinData = pinSnap.val();
            let targetUID = null;

            if (pinData && typeof pinData === 'object') {
                targetUID = pinData.uid;
            } else if (typeof pinData === 'string') {
                targetUID = pinData;
            }

            // 2a. Check SaaS Registry Fallback
            let meta = null;
            if (!targetUID) {
                const storeSnap = await firebase.database().ref(`admin/stores/${pin}`).once('value');
                if (!storeSnap.exists()) {
                    throw new Error('invalid-pin');
                }
                meta = storeSnap.val();
                targetUID = meta.uid;
            } else {
                const storeSnap = await firebase.database().ref(`admin/stores/${pin}`).once('value');
                meta = storeSnap.val() || {};
            }

            // 2b. Force Fresh Activation Check (Direct fetch, no cache)
            if (targetUID) {
                const accountSnap = await firebase.database().ref(`users/${targetUID}/accountDetails`).once('value');
                const accountData = accountSnap.val() || {};

                if (accountData.isActivated !== true) {
                    throw new Error('account-deactivated');
                }

                if (accountData.isTrial === true && accountData.trialEndDate) {
                    if (Date.now() > accountData.trialEndDate) {
                        throw new Error('trial-expired');
                    }
                }
            }

            // 3. Authenticate to POS
            try {
                localStorage.removeItem('sahab_auth_blocked');
                await firebase.auth().signInWithEmailAndPassword(email, pin);

                // 3a. Update Mapping if necessary (If Auth UID is different from Registry UID)
                const user = firebase.auth().currentUser;
                if (user && targetUID && targetUID !== user.uid) {
                    console.log(`[Smart-Gate] Internal Sync: Binding Registry [${targetUID}] to Auth [${user.uid}]`);
                    const migrationUpdates = {};
                    migrationUpdates[`pincodes/${pin}`] = user.uid;
                    migrationUpdates[`admin/stores/${pin}/uid`] = user.uid;

                    // Copy existing data to new UID node
                    const oldDataSnap = await firebase.database().ref(`users/${targetUID}`).once('value');
                    if (oldDataSnap.exists()) {
                        migrationUpdates[`users/${user.uid}`] = oldDataSnap.val();
                        // Optional: Clean up old placeholder node
                        // migrationUpdates[`users/${targetUID}`] = null; 
                    }
                    await firebase.database().ref().update(migrationUpdates);
                }
            } catch (authErr) {
                // 4. Auto-Registration for authorized new stores
                const code = authErr.code;
                if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
                    console.log(`[Smart-Gate] Auto-provisioning Auth account for PIN ${pin}...`);
                    await firebase.auth().createUserWithEmailAndPassword(email, pin);
                    const user = firebase.auth().currentUser;
                    if (user) {
                        const syncUpdates = {};
                        // Ensure we bridge the registry to this new permanent UID
                        syncUpdates[`pincodes/${pin}`] = { uid: user.uid, isActivated: true };
                        syncUpdates[`admin/stores/${pin}/uid`] = user.uid;

                        // If we have meta from Step 2, use it to initialize settings
                        syncUpdates[`users/${user.uid}/settings`] = {
                            name: meta.name || 'مغسلة جديدة',
                            phone: meta.phone || '',
                            status: 'active',
                            pin: pin
                        };
                        syncUpdates[`users/${user.uid}/accountDetails`] = {
                            isActivated: true,
                            name: meta.name || 'مغسلة جديدة',
                            phone: meta.phone || '',
                            firstUsedDate: Date.now()
                        };

                        // If targetUID was a placeholder, copy its data too
                        if (targetUID && targetUID !== user.uid) {
                            const oldSnap = await firebase.database().ref(`users/${targetUID}`).once('value');
                            if (oldSnap.exists()) syncUpdates[`users/${user.uid}`] = oldSnap.val();
                        }

                        await firebase.database().ref().update(syncUpdates);
                        console.log(`[Smart-Gate] Permanent identity established for UID: ${user.uid}`);
                    }
                } else {
                    throw authErr;
                }
            }
        } catch (err) {
            console.error('[Smart-Gate] Routing Failure:', err.message);
            const lang = this.currentLang || 'ar';
            let errMsg = lang === 'en' ? 'Invalid PIN. Please check and try again.' : 'الرمز خاطئ، يرجى التأكد من الرمز والمحاولة مرة أخرى.';
            if (err.message === 'account-deactivated') errMsg = lang === 'en' ? 'Sorry, this account has been disabled by Administration.' : 'عذراً، هذا الحساب معطل من قبل الإدارة.';
            else if (err.message === 'trial-expired') errMsg = lang === 'en' ? 'Trial period expired. Please contact administration to renew.' : 'انتهت الفترة التجريبية. يرجى التواصل مع الإدارة للتجديد.';

            errEl.textContent = errMsg;
            errEl.classList.remove('hidden');
            btn.innerHTML = lang === 'en' ? '<i class="fa-solid fa-right-to-bracket"></i> Login' : '<i class="fa-solid fa-right-to-bracket"></i> دخول';
            btn.disabled = false;
        }
    },

    initRealtimeSecurity(uid) {
        if (!uid || typeof firebase === 'undefined') return;
        const authRef = firebase.database().ref(`users/${uid}/accountDetails`);
        authRef.on('value', async (snap) => {
            if (!snap.exists()) return;
            const data = snap.val();

            // 1. THE KILL SWITCH: Instant Eviction on deactivation
            if (data.isActivated === false) {
                console.warn("[SECURITY] Kill switch triggered! Account deactivated from Admin.");
                const lang = localStorage.getItem('sahab-lang') || 'ar';
                alert(lang === 'en' ? "System disabled. Please contact administration." : "النظام معطل، يرجى التواصل مع الإدارة");
                localStorage.clear();
                sessionStorage.clear();
                await localforage.clear();
                firebase.auth().signOut().then(() => {
                    window.location.reload();
                });
                return;
            }

            // 2. Proactive Expiration Warning (Nag Screen)
            // Use Math.max to ensure we always pick the most future date, bypassing legacy frozen dates.
            const targetEndDate = Math.max(data.expiryDate || 0, data.trialEndDate || 0);
            if (targetEndDate > 0) {
                const daysLeftExact = Math.round((targetEndDate - Date.now()) / (1000 * 60 * 60 * 24));

                // Only show if strictly <= 3 days left and > 0, and ensure we only pop up ONCE per session.
                if (daysLeftExact <= 3 && daysLeftExact > 0 && !window.hasShownExpiryWarning) {
                    window.hasShownExpiryWarning = true; // Mark to avoid racing

                    const triggerNag = () => {
                        if (typeof Swal === 'undefined') {
                            setTimeout(triggerNag, 500); // Wait for CDN
                            return;
                        }

                        const lang = localStorage.getItem('sahab-lang') || 'ar';
                        Swal.fire({
                            title: lang === 'en' ? 'Warning: Renewal approaching ⚠️' : 'تنبيه: اقترب موعد التجديد ⚠️',
                            text: lang === 'en' ? `Your subscription expires in ${daysLeftExact} days. Please renew to avoid system interruption.` : `اشتراكك سينتهي خلال ${daysLeftExact} أيام. يرجى التجديد لتجنب توقف النظام.`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: lang === 'en' ? 'Renew Now 💳' : 'تجديد الآن 💳',
                            cancelButtonText: lang === 'en' ? 'Later' : 'لاحقاً',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.open('https://www.google.com/?q=payment+link+placeholder', '_blank');
                            }
                        });
                    };

                    triggerNag();
                }
            }

            // 3. TRIAL BANNER & LOCK
            const banner = document.getElementById('trial-banner');
            const trialDays = document.getElementById('trial-days');
            const expiredOverlay = document.getElementById('trial-expired-overlay');

            // Save actual state strictly to localStorage to guarantee instant rendering on refresh as requested
            localStorage.setItem(`sahab_is_subscribed_${uid}`, data.isSubscribed === true ? 'true' : 'false');
            if (data.trialEndDate) {
                localStorage.setItem(`sahab_trial_expiry_${uid}`, data.trialEndDate.toString());
            }

            // Prioritize localStorage to ensure states persist across hard reloads synchronously
            const storedExpiry = localStorage.getItem(`sahab_trial_expiry_${uid}`);
            const effectiveTrialEndDate = storedExpiry ? parseInt(storedExpiry) : data.trialEndDate;

            if (data.isSubscribed === true) {
                // PAID SUBSCRIPTION: Hide trial visuals immediately & permanently
                if (expiredOverlay) {
                    expiredOverlay.classList.add('hidden');
                    expiredOverlay.style.display = 'none';
                }
                if (banner) banner.classList.add('hidden');
            } else if (data.isTrial === true && effectiveTrialEndDate) {
                const checkTrialExpiry = () => {
                    const exactDaysLeft = (effectiveTrialEndDate - Date.now()) / (1000 * 60 * 60 * 24);
                    const displayDays = Math.ceil(exactDaysLeft);

                    if (exactDaysLeft <= 0) {
                        // Trial expired - HARD LOCK
                        console.warn("[SECURITY] Trial Expired! Locking POS.");
                        if (expiredOverlay) {
                            expiredOverlay.classList.remove('hidden');
                            expiredOverlay.style.display = 'flex'; // Ensure flex display for centering
                        }
                        if (banner) banner.classList.add('hidden');
                    } else {
                        // Trial Active - Show Banner & Unlock
                        if (expiredOverlay) {
                            expiredOverlay.classList.add('hidden');
                            expiredOverlay.style.display = 'none';
                        }
                        if (banner && trialDays) {
                            trialDays.innerText = displayDays;
                            banner.classList.remove('hidden');
                        }
                    }
                };

                checkTrialExpiry();

                // Ensure real-time eviction if app remains open and midnight passes
                if (window.trialCheckInterval) clearInterval(window.trialCheckInterval);
                window.trialCheckInterval = setInterval(checkTrialExpiry, 60000); // Check every minute
            } else {
                // Unlimited account - Unlock & Hide Everything
                if (expiredOverlay) {
                    expiredOverlay.classList.add('hidden');
                    expiredOverlay.style.display = 'none';
                }
                if (banner) banner.classList.add('hidden');
            }
            // 4. RESET TOKEN WATCHER
            const currentSessionToken = localStorage.getItem('sahab_reset_token') || '';
            const dbToken = data.resetToken || '';

            if (dbToken && currentSessionToken && currentSessionToken !== dbToken) {
                console.warn("[SECURITY] Reset token mismatch detected! Forcing local wipe.");
                const isSoft = dbToken.startsWith('SOFT_');

                // Clear localStorage items except user session and settings if soft
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    // Critical: Do NOT wipe the session UID, otherwise login breaks
                    if (key === 'sahab_session_uid') continue;

                    if (isSoft && (key === 'sahab_services' || key.startsWith('sahab_settings') || key.startsWith('invoiceCity') || key.startsWith('invoiceStreet') || key.startsWith('invoiceNeighborhood') || key.startsWith('logo_'))) {
                        continue; // Keep settings and UI preferences on Soft Reset
                    }
                    localStorage.removeItem(key);
                }

                // Clear IndexedDB via localforage
                const collectionsToWipeLocally = ['invoices', 'expenses', 'customers', 'journal_entries', 'tax_records', 'zreports', 'reports', 'archived_z_reports', 'laundry_balances', 'invoiceCounter'];

                if (!isSoft) {
                    collectionsToWipeLocally.push('settings');
                    collectionsToWipeLocally.push('inventory');
                }

                for (let col of collectionsToWipeLocally) {
                    await localforage.removeItem(col);
                }

                localStorage.setItem('sahab_reset_token', dbToken); // acknowledge new token

                alert(isSoft ? 'تم تحديث أرقام الفواتير ومسح السجلات (إعادة ضبط جزئية). سيتم إعادة تحميل النظام.' : 'تم إعادة ضبط المصنع ومسح كافة البيانات. سيتم إعادة تحميل النظام.');
                window.location.reload();
                return;
            } else if (dbToken && !currentSessionToken) {
                // First time login after a reset, just acknowledge it.
                localStorage.setItem('sahab_reset_token', dbToken);
            }
        });
    },

    async logoutUser() {
        this.closeSettingsModal();
        if (typeof firebase !== 'undefined' && firebase.database) firebase.database().ref().off();
        await firebase.auth().signOut();

        const departsUID = window.currentUID;
        window.currentUID = null;
        window.isDataInitialized = false;
        this.cart = [];
        this.services = [];
        this.expenses = [];

        await localforage.clear();
        sessionStorage.clear();

        if (departsUID) {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.endsWith('_' + departsUID)) {
                    localStorage.removeItem(key);
                }
            }
        }
        localStorage.removeItem('sahab_active_view');
        localStorage.removeItem('sahab_session_uid');
        location.reload();
    },

    async openSettingsModal() {
        const s = window.tenantSettings;
        document.getElementById('setting-name').value = s.name || '';
        document.getElementById('setting-phone').value = s.phone || '';
        document.getElementById('setting-tax').value = s.taxNumber || '';

        const cityEl = document.getElementById('setting-city');
        const hoodEl = document.getElementById('setting-hood');
        const streetEl = document.getElementById('setting-street');
        if (cityEl) cityEl.value = s.addressCity || (typeof lsGet === 'function' ? lsGet('invoiceCity') : localStorage.getItem('invoiceCity')) || '';
        if (hoodEl) hoodEl.value = s.addressNeighborhood || (typeof lsGet === 'function' ? lsGet('invoiceNeighborhood') : localStorage.getItem('invoiceNeighborhood')) || '';
        if (streetEl) streetEl.value = s.addressStreet || (typeof lsGet === 'function' ? lsGet('invoiceStreet') : localStorage.getItem('invoiceStreet')) || '';

        // PWA Button Gatekeeper Logic
        let isPwaAllowed = s.canInstallPWA === true;
        if (window.currentUID && typeof firebase !== 'undefined') {
            try {
                const snap = await firebase.database().ref(`users/${window.currentUID}/settings/canInstallPWA`).once('value');
                if (snap.exists()) {
                    isPwaAllowed = snap.val() === true;
                    s.canInstallPWA = isPwaAllowed; // Update local cache
                }
            } catch (ignore) { }
        }

        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            if (isPwaAllowed && !isStandalone) {
                installBtn.classList.remove('hidden');
                installBtn.style.display = 'block'; // Ensure visibility

                installBtn.onclick = async (e) => {
                    e.preventDefault();
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

                    if (isIOS) {
                        alert('في متصفح سفاري: اضغط على أيقونة المشاركة 📤 ثم اختر "إضافة إلى الصفحة الرئيسية"');
                    } else if (deferredPrompt) {
                        installBtn.classList.add('hidden');
                        installBtn.style.display = 'none';
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        deferredPrompt = null;
                    } else {
                        alert('لا يمكن التثبيت التلقائي حالياً. يرجى تثبيت التطبيق يدوياً من قائمة المتصفح (Install App / Add to Home Screen).');
                    }
                };
            } else {
                installBtn.classList.add('hidden');
                installBtn.style.display = 'none';
            }
        }

        // Load existing logo preview
        const logoPreview = document.getElementById('setting-logo-preview');
        if (s.logo) {
            logoPreview.src = s.logo;
            logoPreview.style.display = 'block';
        } else {
            logoPreview.style.display = 'none';
        }

        document.getElementById('settings-modal').classList.remove('hidden');
    },
    handleLogoUpload: function (input) {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            alert('يرجى رفع ملف صورة صحيح (PNG / JPG).');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_SIZE = 300;

                if (width > height && width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                } else if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                const previewEl = document.getElementById('setting-logo-preview');
                if (previewEl) {
                    previewEl.src = compressedBase64;
                    previewEl.style.display = 'block';
                }
                window._tempLogoBase64 = compressedBase64;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },


    changeLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('sahab-lang', lang);
        this.applyLanguage();
        this.updateCartUI(); // Repaint Cart labels for english UI

        // Dynamically repaint the active table without refreshing the page
        const activeNav = document.querySelector('.main-nav .active');
        if (activeNav) {
            const viewMatch = (activeNav.getAttribute('onclick') || '').match(/'([^']+)'/);
            if (viewMatch) {
                const currentViewId = viewMatch[1];
                if (currentViewId === 'history') this.renderHistory();
                else if (currentViewId === 'customers') this.renderCustomers();
                else if (currentViewId === 'expenses') this.renderExpenses();
            }
        }

        // Force generic services grid repaint
        this.renderItems(this.services);

        if (this.showToast) {
            this.showToast(lang === 'en' ? 'Language switched to English' : 'تم تغيير اللغة إلى العربية');
        }
    },
    translate(arString) {
        if (this.currentLang !== 'en') return arString;
        const dynDict = {
            'ثوب': 'Thobe',
            'ثوب قطن': 'Cotton Thobe',
            'ثوب صوف': 'Wool Thobe',
            'شماغ': 'Shemagh',
            'غترة': 'Ghutra',
            'عميل نقدي': 'Cash Customer',
            'عميل دون اسم': 'Unnamed Customer',
            'تسديد مغاسل': 'Laundry Settlement',
            'ايجار': 'Shop Rent',
            'رواتب': 'Salaries',
            'فواتير': 'Bills & Utilities',
            'صيانة': 'Maintenance',
            'مشتريات': 'Operating Purchases',
            'أخرى': 'Misc Expenses',
            'تم حفظ القيد المحاسبي': 'Journal entry saved successfully',
            'يرجى تعبئة كافة الحقول لحفظ التقييد المحاسبي!': 'Please fill all fields to save!',
            'غسيل وكوي': 'Wash & Iron',
            'كوي': 'Iron',
            'غسيل': 'Wash',
            'عادي': 'Normal',
            'مستعجل': 'Express',
            'نقدي': 'Cash',
            'مدى': 'Mada',
            'فيزا': 'Visa',
            'ماستركارد': 'Mastercard',
            'شبكة': 'Network',
            'دفع لاحقاً': 'Pay Later',
            'غير مدفوع': 'Unpaid',
            'مدفوع': 'Paid'
        };
        return dynDict[arString] || arString;
    },

    applyLanguage() {
        const lang = this.currentLang;
        const dict = {
            // Custom store name handled by applyBranding dynamic logic
            '.main-nav .nav-btn:nth-child(1)': { ar: '<i class="fa-solid fa-cash-register"></i> الكاشير', en: '<i class="fa-solid fa-cash-register"></i> Cashier' },
            '.main-nav .nav-btn:nth-child(2)': { ar: '<i class="fa-solid fa-clock-rotate-left"></i> الفواتير', en: '<i class="fa-solid fa-clock-rotate-left"></i> Invoices' },
            '.main-nav .nav-btn:nth-child(3)': { ar: '<i class="fa-solid fa-users"></i> العملاء', en: '<i class="fa-solid fa-users"></i> Customers' },
            '.main-nav .nav-btn:nth-child(4)': { ar: '<i class="fa-solid fa-boxes-stacked"></i> المخزون', en: '<i class="fa-solid fa-boxes-stacked"></i> Inventory' },
            '.main-nav .nav-btn:nth-child(5)': { ar: '<i class="fa-solid fa-money-bill-transfer"></i> المصروفات', en: '<i class="fa-solid fa-money-bill-transfer"></i> Expenses' },
            '.main-nav .nav-btn:nth-child(6)': { ar: '<i class="fa-solid fa-chart-line"></i> القوائم المالية', en: '<i class="fa-solid fa-chart-line"></i> Reports' },
            '#settings-nav-btn': { ar: '<i class="fa-solid fa-gear"></i> الإعدادات', en: '<i class="fa-solid fa-gear"></i> Settings' },

            // Fast Batch Toggles
            '#fb-type-wash_iron': { ar: 'غسيل وكوي', en: 'Wash & Iron' },
            '#fb-type-iron': { ar: 'كوي فقط', en: 'Iron Only' },
            '#fb-type-wash': { ar: 'غسيل فقط', en: 'Wash Only' },
            '#fb-speed-normal': { ar: 'عادي', en: 'Normal' },
            '#fb-speed-express': { ar: 'مستعجل', en: 'Express' },

            // POS Header
            '.items-header h2': { ar: 'الخدمات', en: 'Services' },
            '.cart-header h2': { ar: 'الفاتورة', en: 'Invoice' },
            '.trigger-text': { ar: 'الفاتورة <i class="fa-solid fa-chevron-up" id="mobile-cart-icon"></i>', en: 'Invoice <i class="fa-solid fa-chevron-up" id="mobile-cart-icon"></i>' },

            // Categories
            '#category-filter button:nth-child(1)': { ar: 'الكل', en: 'All' },
            '#category-filter button:nth-child(2)': { ar: 'رجالي', en: 'Men' },
            '#category-filter button:nth-child(3)': { ar: 'نسائي', en: 'Women' },
            '#category-filter button:nth-child(4)': { ar: 'أخرى', en: 'Misc' },

            // Cart elements
            '.delivery-options h4': { ar: 'رسوم التوصيل:', en: 'Delivery Fee:' },
            '.grand-total span:nth-child(1)': { ar: 'الإجمالي النهائي:', en: 'Grand Total:' },
            '.totals .total-row:nth-child(2) span': { ar: '* الأسعار لا تشمل ضريبة القيمة المضافة', en: '* Prices exclude VAT' },
            '.cart-actions .btn-primary': { ar: '<i class="fa-solid fa-file-invoice"></i> إنشاء فاتورة', en: '<i class="fa-solid fa-file-invoice"></i> Checkout' },

            // Settings Modal
            '#settings-modal h3': { ar: '<i class="fa-solid fa-gear"></i> الإعدادات', en: '<i class="fa-solid fa-gear"></i> Settings' },
            '#theme-toggle-btn span:first-child': { ar: 'تبديل المظهر', en: 'Toggle Theme' },
            '#settings-save-btn': { ar: '<i class="fa-solid fa-floppy-disk"></i> حفظ الإعدادات', en: '<i class="fa-solid fa-floppy-disk"></i> Save Settings' },
            '#pwa-install-btn': { ar: '<i class="fa-solid fa-mobile-screen"></i> تثبيت التطبيق على الجهاز (PWA)', en: '<i class="fa-solid fa-mobile-screen"></i> Install App on Device (PWA)' },
            '#settings-modal .selector-group:nth-of-type(1) label': { ar: 'اسم النشاط التجاري', en: 'Business Name' },
            '#settings-modal .selector-group:nth-of-type(2) label': { ar: 'شعار الفاتورة (Logo)', en: 'Invoice Logo' },
            '#settings-modal .selector-group:nth-of-type(3) label': { ar: 'رقم الجوال', en: 'Phone Number' },
            '#settings-modal .selector-group:nth-of-type(4) label': { ar: 'الرقم الضريبي (اختياري)', en: 'Tax Number (Optional)' },
            '#settings-modal .selector-group:nth-of-type(5) label': { ar: 'مظهر النظام (Theme)', en: 'System Theme' },
            '#trial-banner': { ar: 'نسخة تجريبية: متبقي <span id="trial-days"></span> أيام', en: 'Trial version: <span id="trial-days">5</span> days left' },
            '#initial-loader h2': { ar: 'جاري التحميل...', en: 'Loading...' },

            // Expense Modal Option Selectors (Deep Form Translation)
            '#exp-category option[value="ايجار"]': { ar: 'إيجار المحل', en: 'Shop Rent' },
            '#exp-category option[value="رواتب"]': { ar: 'رواتب عمالة', en: 'Salaries' },
            '#exp-category option[value="فواتير"]': { ar: 'فواتير ومنافع (كهرباء/ماء)', en: 'Bills & Utilities (Electric/Water)' },
            '#exp-category option[value="صيانة"]': { ar: 'صيانة دورية', en: 'Routine Maintenance' },
            '#exp-category option[value="مشتريات"]': { ar: 'مشتريات تشغيلية', en: 'Operating Purchases' },
            '#exp-category option[value="أخرى"]': { ar: 'أخرى / مصاريف نثرية', en: 'Misc / Petty Cash' },

            // Sub-Headers across views
            '.history-header h2': { ar: 'سجل الفاتورة', en: 'Invoice History' },
            '#history-search': { attr: 'placeholder', ar: 'بحث برقم الفاتورة، اسم أو جوال العميل...', en: 'Search by Invoice ID, Customer Name or Phone...' },
            '.delivery-mgr span:first-child': { ar: '<i class="fa-solid fa-motorcycle"></i> إدارة التوصيل', en: '<i class="fa-solid fa-motorcycle"></i> Delivery Management' },
            '#settings-logout-btn': { ar: '<i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج', en: '<i class="fa-solid fa-right-from-bracket"></i> Logout' },

            // View Titles
            '#view-history > div > div:first-child h2': { ar: '<i class="fa-solid fa-clock-rotate-left"></i> سجل الفواتير', en: '<i class="fa-solid fa-clock-rotate-left"></i> Invoice History' },
            '.delivery-action-card h2': { ar: '<i class="fa-solid fa-truck-fast"></i> إدارة رسوم التوصيل', en: '<i class="fa-solid fa-truck-fast"></i> Delivery Management' },
            '.delivery-action-card p': { ar: 'تحكم في أسعار التوصيل المتاحة لموظفي الكاشير', en: 'Control delivery rates available to cashiers' },
            '#view-customers h2': { ar: 'سجل العملاء', en: 'Customers Directory' },
            '#view-inventory h2': { ar: 'إدارة المخزون', en: 'Inventory Management' },
            '#view-expenses h2': { ar: 'إدارة المصروفات التشغيلية', en: 'Operational Expenses Management' },
            '#view-expenses p': { ar: 'سجل وراجع جميع المصروفات اليومية للمغسلة', en: 'Record and review daily operational expenses' },
            '#view-reports h2': { ar: 'القوائم المالية وإقرارات الزكاة', en: 'Financial Reports & ZATCA' },

            // Login & Auth
            '.login-body label': { ar: 'الرمز السري (PIN)', en: 'PIN Code' },
            '#login-btn': { ar: '<i class="fa-solid fa-right-to-bracket"></i> دخول', en: '<i class="fa-solid fa-right-to-bracket"></i> Login' },
            '#trial-expired-overlay h2': { ar: 'انتهت الفترة التجريبية', en: 'Trial Period Expired' },
            '#trial-expired-overlay p:first-of-type': { ar: 'نشكركم على تجربة نظام سحاب. لقد انتهت الفترة المخصصة للتجربة، يرجى التواصل مع الإدارة لتفعيل الاشتراك الدائم أو تمديد الفترة.', en: 'Thank you for trying Sahab POS. Your trial has expired. Please contact administration to activate your subscription.' },
            '#trial-expired-overlay div p:first-of-type': { ar: 'للتواصل والدعم الفني:', en: 'Contact Technical Support:' },
            '#trial-expired-overlay button': { ar: '<i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج', en: '<i class="fa-solid fa-right-from-bracket"></i> Logout' },

            // Buttons
            '#view-history .btn-primary': { ar: '<i class="fa-solid fa-plus"></i> إضافة خيار توصيل', en: '<i class="fa-solid fa-plus"></i> Add Delivery Option' },
            '#view-inventory .btn-primary': { ar: '<i class="fa-solid fa-box"></i> إضافة صنف استهلاكي', en: '<i class="fa-solid fa-box"></i> Add Consumable Item' },
            '#view-inventory .btn-success': { ar: '<i class="fa-solid fa-shirt"></i> إضافة خدمة جديدة', en: '<i class="fa-solid fa-shirt"></i> Add New Service' },
            '#view-expenses .btn-primary': { ar: '<i class="fa-solid fa-plus"></i> تقييد مصروف جديد', en: '<i class="fa-solid fa-plus"></i> Register New Expense' },
            '#view-expenses .btn-danger': { ar: '<i class="fa-solid fa-trash-can"></i> تصفير', en: '<i class="fa-solid fa-trash-can"></i> Reset All' },
            '.empty-cart-msg': { ar: 'السلة فارغة، يرجى اختيار أصناف.', en: 'Cart is empty. Please select items.' },

            // Modals Headers (Fallback for ones controlled by JS)
            '#inventory-content h2': { ar: 'جاري تحضير قائمة الخدمات...', en: 'Preparing services list...' },
            '#inventory-content p': { ar: 'إذا استغرق هذا وقتاً طويلاً، يرجى تحديث الصفحة.', en: 'If this takes too long, please refresh the page.' },

            // Payment Methods
            '#method-cash span': { ar: '<i class="fa-solid fa-money-bill-1-wave" style="margin-left:10px;"></i> كاش (Cash)', en: '<i class="fa-solid fa-money-bill-1-wave" style="margin-left:10px;"></i> Cash' },
            '#method-mada span': { ar: '<i class="fa-solid fa-credit-card" style="margin-left:10px;"></i> مدى (Mada)', en: '<i class="fa-solid fa-credit-card" style="margin-left:10px;"></i> Mada' },
            '#method-visa span': { ar: '<i class="fa-brands fa-cc-visa" style="margin-left:10px;"></i> فيزا (Visa)', en: '<i class="fa-brands fa-cc-visa" style="margin-left:10px;"></i> Visa' },
            '#method-mastercard span': { ar: '<i class="fa-brands fa-cc-mastercard" style="margin-left:10px;"></i> ماستركارد', en: '<i class="fa-brands fa-cc-mastercard" style="margin-left:10px;"></i> Mastercard' },

            // Confirmation Headers
            '#modal-actions-success h4': { ar: 'تم تسجيل الفاتورة بنجاح', en: 'Invoice Generated Successfully' },
            '#modal-actions-success p': { ar: 'العملية مقيدة بالمرجع <span id="success-invoice-ref"></span>', en: 'Reference: <span id="success-invoice-ref"></span>' },
            '#modal-actions-success h4:nth-of-type(2)': { ar: 'إجراءات الفاتورة:', en: 'Invoice Actions:' },
            '#modal-actions-success button:nth-of-type(1) span': { ar: 'طباعة إيصال حراري', en: 'Print Thermal Receipt' },
            '#modal-actions-success button:nth-of-type(2)': { ar: '<i class="fa-solid fa-file-pdf"></i> تحميل الفاتورة الرقمية (PDF)', en: '<i class="fa-solid fa-file-pdf"></i> Download PDF Invoice' },

            // Daily Report Headers
            '#daily-review-modal h3': { ar: '<i class="fa-solid fa-file-invoice-dollar"></i> مراجعة الإيرادات وتأكيد إغلاق اليومية', en: '<i class="fa-solid fa-file-invoice-dollar"></i> Daily Closing Review & Confirmation' },
            '#z-report-preview-modal h3': { ar: 'مراجعة إغلاق اليومية (Daily Review)', en: 'Daily Closing Review' },
            '#z-report-preview-modal .btn-primary': { ar: '<i class="fa-solid fa-check-double" style="margin-left: 10px;"></i> اعتماد وتحميل التقرير (PDF)', en: '<i class="fa-solid fa-check-double" style="margin-left: 10px;"></i> Confirm & Download Report (PDF)' },
            '#z-report-preview-modal .w-100:not(.btn-primary)': { ar: 'إلغاء المراجعة', en: 'Cancel Review' },
            '#daily-review-modal .modal-body > p': { ar: 'يرجى مطابقة الأرقام أدناه مع النقد الفعلي والأرصدة بالدرج. في حال تأكيد العملية وتصفير الدرج، سيتم تصدير تقرير Z-Report وإشعار الإدارة.', en: 'Please match physical cash and terminals with the figures below. Once confirmed, a Z-Report will be generated and the dashboard resets.' },
            '.financial-breakdown .breakdown-row:nth-child(1) span:first-child': { ar: '<i class="fa-solid fa-file-invoice"></i> إجمالي المبيعات (نظام):', en: '<i class="fa-solid fa-file-invoice"></i> Gross Sales (System):' },
            '.financial-breakdown .breakdown-row:nth-child(2) span:first-child': { ar: '<i class="fa-solid fa-rotate-left"></i> مرتجعات وإلغاءات:', en: '<i class="fa-solid fa-rotate-left"></i> Refunds & Cancellations:' },
            '.financial-breakdown .breakdown-row:nth-child(3) span:first-child': { ar: '<i class="fa-solid fa-money-bill-transfer"></i> المصاريف التشغيلية (مسحوبة):', en: '<i class="fa-solid fa-money-bill-transfer"></i> Operational Expenses (Withdrawn):' },
            '.financial-breakdown .breakdown-row.total-row span:first-child': { ar: 'الصافي الفعلي المطلوب (بالدرج والشبكة):', en: 'Expected Net Revenue (Drawer & Terminals):' },
            '#daily-review-modal .modal-footer button:last-child': { ar: '<i class="fa-solid fa-check"></i> اعتماد التقرير وتحميل (PDF)', en: '<i class="fa-solid fa-check"></i> Approve & Download Z-Report' },

            // Empty States
            '.empty-state h3': { ar: 'لا توجد بيانات للعرض', en: 'No data to display' },
            '.empty-state p': { ar: 'لم يتم العثور على أي معلومات في هذا القسم حالياً.', en: 'No information was found in this section.' },
        };

        Object.entries(dict).forEach(([selector, textObj]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (textObj.attr) el.setAttribute(textObj.attr, textObj[lang] || textObj['ar']);
                else el.innerHTML = textObj[lang] || textObj['ar'];
            });
        });

        // Advanced placeholders & adjacent labels
        const langSelect = document.getElementById('ui-language');
        if (langSelect && langSelect.previousElementSibling) langSelect.previousElementSibling.innerText = lang === 'en' ? 'App Language' : 'لغة التطبيق';

        const itemSearch = document.getElementById('item-search');
        if (itemSearch) itemSearch.placeholder = lang === 'en' ? 'Search items...' : 'ابحث عن صنف...';

        const custName = document.getElementById('customer-name');
        if (custName) custName.placeholder = lang === 'en' ? 'Customer Name (Optional)' : 'اسم العميل (اختياري)';

        const custPhone = document.getElementById('customer-phone');
        if (custPhone) custPhone.placeholder = lang === 'en' ? 'Customer Phone (Optional)' : 'رقم الجوال (اختياري)';

        const invSearch = document.getElementById('history-search');
        if (invSearch) invSearch.placeholder = lang === 'en' ? 'Search by ID, Customer...' : 'بحث بالرقم، العميل أو الجوال...';

        const cSearch = document.getElementById('customer-search');
        if (cSearch) cSearch.placeholder = lang === 'en' ? 'Search by Name or Phone...' : 'بحث باسم العميل أو الجوال...';

        // Modal Action text inside Checkout pos-laundry
        const pLName = document.getElementById('pos-laundry-name');
        if (pLName) pLName.placeholder = lang === 'en' ? 'Laundry Name (Required)' : 'اسم المغسلة (مطلوب)';
        const pLHood = document.getElementById('pos-laundry-hood');
        if (pLHood) pLHood.placeholder = lang === 'en' ? 'Neighborhood (Required)' : 'الحي (مطلوب)';
        const pLCost = document.getElementById('pos-laundry-cost');
        if (pLCost) pLCost.placeholder = lang === 'en' ? 'Cost (Required)' : 'التكلفة (مطلوب)';

        // Add Expense Modal Deep Labels
        const expCatLabel = (document.querySelector('#exp-category') || {}).previousElementSibling;
        if (expCatLabel) expCatLabel.innerText = lang === 'en' ? 'Category' : 'التصنيف';
        const expAmtLabel = (document.querySelector('#exp-amount') || {}).previousElementSibling;
        if (expAmtLabel) expAmtLabel.innerText = lang === 'en' ? 'Amount (SAR)' : 'المبلغ (ر.س)';
        const expDescLabel = (document.querySelector('#exp-desc') || {}).previousElementSibling;
        if (expDescLabel) expDescLabel.innerText = lang === 'en' ? 'Description' : 'البيان / الوصف';
        const expDateLabel = (document.querySelector('#expense-date') || {}).previousElementSibling;
        if (expDateLabel) expDateLabel.innerText = lang === 'en' ? 'Expense Date' : 'تاريخ المصروف';
        const expModalTitle = document.querySelector('#add-expense-modal h3');
        if (expModalTitle) expModalTitle.innerHTML = lang === 'en' ? '<i class="fa-solid fa-hand-holding-dollar"></i> Add New Expense' : '<i class="fa-solid fa-hand-holding-dollar"></i> تقييد مصروف جديد';
        const expSubmitBtn = document.querySelector('#add-expense-modal .btn');
        if (expSubmitBtn) expSubmitBtn.innerHTML = lang === 'en' ? '<i class="fa-solid fa-check"></i> Save Expense Record' : '<i class="fa-solid fa-check"></i> حفظ القيد المحاسبي';

        // Force native chromium inputs (DatePicker) into english locale explicitly
        document.documentElement.lang = lang === 'en' ? 'en' : 'ar';

        // --- ⚡ CRITICAL FIX: RE-INJECT DYNAMIC TRIAL DAYS INTO BANNER POST-TRANSLATION ---
        const currentSession = localStorage.getItem('sahab_session_uid');
        if (currentSession) {
            const trialExpiryStr = localStorage.getItem(`sahab_trial_expiry_${currentSession}`);
            if (trialExpiryStr) {
                const exactDaysLeft = (parseInt(trialExpiryStr) - Date.now()) / (1000 * 60 * 60 * 24);
                const displayDays = Math.ceil(exactDaysLeft);
                const dSpan = document.getElementById('trial-days');
                if (dSpan && exactDaysLeft > 0) {
                    dSpan.innerText = displayDays;
                }
            }
        }
    },

    closeSettingsModal() {
        document.getElementById('settings-modal').classList.add('hidden');
    },

    async saveTenantSettings() {
        const name = document.getElementById('setting-name').value.trim() || '';
        const phone = document.getElementById('setting-phone').value.trim();
        let taxElement = document.getElementById('setting-tax');
        if (!taxElement) taxElement = document.getElementById('vatNumberInput'); // fail-safe if UI layout swapped
        let vatValue = taxElement ? taxElement.value.trim() : '';

        if (vatValue !== "") {
            let isValidVat = /^\d{15}$/.test(vatValue) && vatValue.startsWith('3') && vatValue.endsWith('3');
            if (!isValidVat) {
                alert("الرقم الضريبي غير صحيح! يجب أن يتكون من 15 رقم ويبدأ وينتهي برقم 3");
                return; // CRITICAL: STOP EXECUTION HERE. DO NOT SAVE TO FIREBASE.
            }
        }
        const tax = vatValue;

        const city = document.getElementById('setting-city') ? document.getElementById('setting-city').value.trim() : '';
        const hood = document.getElementById('setting-hood') ? document.getElementById('setting-hood').value.trim() : '';
        const street = document.getElementById('setting-street') ? document.getElementById('setting-street').value.trim() : '';
        if (typeof lsSet === 'function') {
            lsSet('invoiceCity', city);
            lsSet('invoiceNeighborhood', hood);
            lsSet('invoiceStreet', street);
        } else {
            localStorage.setItem('invoiceCity', city);
            localStorage.setItem('invoiceNeighborhood', hood);
            localStorage.setItem('invoiceStreet', street);
        }

        // Merge locally so we don't destroy pre-existing properties like pin or status
        window.tenantSettings = {
            ...window.tenantSettings,
            name, phone, taxNumber: tax,
            addressCity: city, addressNeighborhood: hood, addressStreet: street
        };

        // Attach logo if uploaded
        if (window._tempLogoBase64) {
            window.tenantSettings.logo = window._tempLogoBase64;
        }

        // Persist to Firebase using atomic multi-path update to prevent data destruction
        if (window.currentUID && typeof firebase !== 'undefined') {
            try {
                const updates = {};
                // Update primary settings
                updates[`users/${window.currentUID}/settings/name`] = name;
                updates[`users/${window.currentUID}/settings/phone`] = phone;
                updates[`users/${window.currentUID}/settings/taxNumber`] = tax;
                updates[`users/${window.currentUID}/settings/addressCity`] = city;
                updates[`users/${window.currentUID}/settings/addressNeighborhood`] = hood;
                updates[`users/${window.currentUID}/settings/addressStreet`] = street;
                if (window._tempLogoBase64) updates[`users/${window.currentUID}/settings/logo`] = window._tempLogoBase64;

                // CRITICAL SYNC: Mirror updates to accountDetails so the Master Dashboard knows instantly
                updates[`users/${window.currentUID}/accountDetails/laundryName`] = name;
                updates[`users/${window.currentUID}/accountDetails/name`] = name;
                updates[`users/${window.currentUID}/accountDetails/phone`] = phone;

                await firebase.database().ref().update(updates);
            } catch (e) {
                console.warn('[Settings] Firebase save failed, using local only:', e);
            }
        }

        window._tempLogoBase64 = null; // reset temp
        this.applyBranding();
        this.closeSettingsModal();
        this.showToast('تم حفظ إعدادات المغسلة بنجاح ✓');
    },

    async loadTenantSettings(uid) {
        let settings = null;
        const user = firebase.auth().currentUser;

        // Special Case: Super Admin
        if (user && user.email === `${ADMIN_PIN}@sahab.pos`) {
            window.tenantSettings = { name: 'الإدارة العامة (Sahab Admin)', phone: '', taxNumber: '' };
            this.applyBranding();
            return;
        }

        // 1. Try Firebase first
        if (uid && typeof firebase !== 'undefined') {
            try {
                const snap = await firebase.database().ref(`users/${uid}/settings`).once('value');
                if (snap.val()) settings = snap.val();
            } catch (e) {
                console.warn('[Settings] Firebase read failed:', e);
            }
        }

        // 2. Local fallback removed for security

        window.tenantSettings = settings || { name: '', phone: '', taxNumber: '' };
        this.applyBranding();
    },

    applyBranding() {
        const name = (window.tenantSettings || {}).name || '';
        const hStore = document.getElementById('header-store-name');
        if (hStore) hStore.textContent = name;

        document.title = name ? `سحاب POS | ${name}` : 'سحاب POS';
    },

    async confirmCloseDay() {
        // UI-Bound Synchronization
        const syncEl = document.getElementById('db-sync-data');
        if (!syncEl) {
            alert(this.currentLang === 'en' ? 'Data Sync Error: Please visit Financial Dashboard first.' : 'خطأ في مزامنة البيانات: يرجى التوجه لصفحة القوائم المالية أولاً.');
            return;
        }

        if (!confirm(this.currentLang === 'en' ? 'Are you sure you want to close the day and issue the report?' : 'هل أنت متأكد من إغلاق اليومية وإصدار التقرير؟')) return;

        // Pull EXACT values from UI elements
        const gross = parseFloat(syncEl.dataset.gross) || 0;
        const refunds = parseFloat(syncEl.dataset.refunds) || 0;
        const netRev = parseFloat(syncEl.dataset.netRev) || 0;
        const opExps = parseFloat(syncEl.dataset.opex) || 0;
        const netProfit = netRev - opExps;
        const cashTotal = parseFloat(syncEl.dataset.cash) || 0;
        const madaTotal = parseFloat(syncEl.dataset.mada) || 0;
        const visaTotal = parseFloat(syncEl.dataset.visa) || 0;
        const mastercardTotal = parseFloat(syncEl.dataset.mastercard) || 0;
        const collected = parseFloat(syncEl.dataset.collected) || 0;
        const uncollected = parseFloat(syncEl.dataset.uncollected) || 0;

        // === KSA STRICT LOCAL DATE (prevents UTC timezone drift) ===
        const todayKSA = getLocalYMD();          // e.g. "2026-04-01"
        const now = new Date();
        const reportDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
        const bizName = (window.tenantSettings || {}).name || 'سحاب';

        const reportContent = `
            <style>
                @media print {
                    @page { margin: 10mm; size: A4 portrait; }
                    .z-page { 
                        font-family: 'Tajawal', Arial, sans-serif; 
                        direction: rtl; 
                        color: #000; 
                        font-size: 12px; 
                        page-break-inside: avoid;
                        width: 100%;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .z-page * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    .final-summary { page-break-inside: avoid !important; }
                }
            </style>
            <div class="z-page" style="padding: 18px 28px; max-width: 760px; margin: 0 auto; background: #fff;">

                <!-- ══ HEADER ══ -->
                <div style="background: #1a1a2e; color: #fff; text-align: center; padding: 16px 20px; border-radius: 8px; margin-bottom: 16px;">
                    ${(window.tenantSettings || {}).logo ? `<img src="${window.tenantSettings.logo}" style="width: 100%; max-width: 50px; height: auto; display: block; margin: 0 auto 10px auto; border-radius: 4px; background: #fff; padding: 2px;">` : `<div style="font-size: 9px; letter-spacing: 2px; color: #fdb813; text-transform: uppercase; margin-bottom: 4px;">${this.currentLang === 'en' ? 'Sahab POS System' : 'نظام سحاب POS'}</div>`}
                    <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #fff; line-height: 1.3;">${this.currentLang === 'en' ? 'Daily Closure Report' : 'تقرير إغلاق اليومية'}</h1>
                    <div style="margin-top: 6px; font-size: 14px; font-weight: bold; color: #fdb813;">${bizName}</div>
                    <div style="margin-top: 4px; font-size: 11px; color: rgba(255,255,255,0.7);">
                        <span>${this.currentLang === 'en' ? 'Date:' : 'بتاريخ:'} ${reportDate}</span>
                        &nbsp;|&nbsp;
                        <span style="direction:ltr; display:inline-block;">${this.currentLang === 'en' ? 'Print Time:' : 'وقت الطباعة:'} ${new Date().toLocaleTimeString(this.currentLang === 'en' ? 'en-US' : 'ar-SA', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    </div>
                </div>
                <hr style="border: 0; border-top: 2px solid #e0e0e0; margin-bottom: 14px;">

                <!-- ══ TWO-COLUMN LAYOUT: Payments LEFT, Financial Summary RIGHT ══ -->
                <table style="width: 100%; border-collapse: collapse; vertical-align: top;">
                    <tr>
                        <!-- LEFT COLUMN: Payment Methods -->
                        <td style="width: 48%; vertical-align: top; padding-left: 8px;">
                            <div style="font-size: 11px; font-weight: 800; color: #444; border-right: 3px solid #fdb813; padding-right: 8px; margin-bottom: 8px;">${this.currentLang === 'en' ? 'Payment Breakdown' : 'تفاصيل طرق الدفع'}</div>
                            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                                <thead>
                                    <tr style="background: #f5f5f5;">
                                        <th style="padding: 7px 10px; text-align: right; color: #666; font-weight: 700;">${this.currentLang === 'en' ? 'Payment Method' : 'طريقة الدفع'}</th>
                                        <th style="padding: 7px 10px; text-align: left; color: #666; font-weight: 700;">${this.currentLang === 'en' ? 'Amount' : 'المبلغ'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-bottom: 1px solid #f0f0f0; background: #fff;">
                                        <td style="padding: 7px 10px; color: #333; font-weight: 600;">💵 ${this.currentLang === 'en' ? 'Cash' : 'نقدي (Cash)'}</td>
                                        <td style="padding: 7px 10px; text-align: left; font-weight: 900; direction: ltr; color: #000;">${cashTotal.toFixed(2)} ر.س</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #f0f0f0; background: #fafafa;">
                                        <td style="padding: 7px 10px; color: #333; font-weight: 600;">💳 ${this.currentLang === 'en' ? 'Mada' : 'مدى (Mada)'}</td>
                                        <td style="padding: 7px 10px; text-align: left; font-weight: 900; direction: ltr; color: #000;">${madaTotal.toFixed(2)} ر.س</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #f0f0f0; background: #fff;">
                                        <td style="padding: 7px 10px; color: #333; font-weight: 600;">💳 ${this.currentLang === 'en' ? 'Visa' : 'فيزا (Visa)'}</td>
                                        <td style="padding: 7px 10px; text-align: left; font-weight: 900; direction: ltr; color: #000;">${visaTotal.toFixed(2)} ر.س</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid #f0f0f0; background: #fafafa;">
                                        <td style="padding: 7px 10px; color: #333; font-weight: 600;">💳 ${this.currentLang === 'en' ? 'Mastercard' : 'ماستركارد'}</td>
                                        <td style="padding: 7px 10px; text-align: left; font-weight: 900; direction: ltr; color: #000;">${mastercardTotal.toFixed(2)} ر.س</td>
                                    </tr>
                                    <tr style="background: #fffbea; border-top: 2px solid #fdb813;">
                                        <td style="padding: 8px 10px; font-weight: 900; color: #333;">${this.currentLang === 'en' ? 'Total Received' : 'إجمالي المقبوضات'}</td>
                                        <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #000; font-size: 13px;">${(cashTotal + madaTotal + visaTotal + mastercardTotal).toFixed(2)} ر.س</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>

                        <!-- SPACER -->
                        <td style="width: 4%;"></td>

                        <!-- RIGHT COLUMN: Financial Summary -->
                        <td style="width: 48%; vertical-align: top; padding-right: 8px;">
                            <div class="final-summary">
                                <div style="font-size: 11px; font-weight: 800; color: #444; border-right: 3px solid #2e7d32; padding-right: 8px; margin-bottom: 8px;">${this.currentLang === 'en' ? 'Financial Summary' : 'ملخص القوائم المالية'}</div>
                                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                                    <tbody>
                                        <tr style="background: #fff; border-bottom: 1px solid #eee;">
                                            <td style="padding: 8px 10px; color: #444; font-weight: 700;">${this.currentLang === 'en' ? 'Gross Sales' : 'إجمالي المبيعات'}</td>
                                            <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #000; font-size: 13px;">${gross.toFixed(2)} ر.س</td>
                                        </tr>
                                        <tr style="background: #fff8f8; border-bottom: 1px solid #eee;">
                                            <td style="padding: 8px 10px; color: #c62828; font-weight: 700;">${this.currentLang === 'en' ? 'Total Refunds' : 'إجمالي المرتجعات'}</td>
                                            <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #c62828; font-size: 13px;">- ${refunds.toFixed(2)} ر.س</td>
                                        </tr>
                                        <tr style="background: #f1f8e9; border-bottom: 1px solid #a5d6a7;">
                                            <td style="padding: 8px 10px; color: #2e7d32; font-weight: 700;">${this.currentLang === 'en' ? 'Net Revenue' : 'صافي الإيرادات'}</td>
                                            <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #2e7d32; font-size: 13px;">${netRev.toFixed(2)} ر.س</td>
                                        </tr>
                                        <tr style="background: #e1f5fe; border-bottom: 1px solid #81d4fa;">
                                            <td style="padding: 8px 10px; color: #0288d1; font-weight: 700;">${this.currentLang === 'en' ? 'Collected Amounts' : 'المبالغ المحصلة (مقبوضات)'}</td>
                                            <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #0288d1; font-size: 13px;">${collected.toFixed(2)} ر.س</td>
                                        </tr>
                                        <tr style="background: #fff8f8; border-bottom: 2px solid #e0e0e0;">
                                            <td style="padding: 8px 10px; color: #c62828; font-weight: 700;">${this.currentLang === 'en' ? 'Total Expenses' : 'إجمالي المصاريف'}</td>
                                            <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #c62828; font-size: 13px;">- ${opExps.toFixed(2)} ر.س</td>
                                        </tr>
                                        <tr style="background: #fff; border-bottom: 2px solid #e0e0e0;">
                                            <td style="padding: 8px 10px; color: #f59e0b; font-weight: 700;">${this.currentLang === 'en' ? 'Uncollected (Rolling)' : 'مبالغ غير محصلة (تراكمي)'}</td>
                                            <td style="padding: 8px 10px; text-align: left; font-weight: 900; direction: ltr; color: #f59e0b; font-size: 13px;">${uncollected.toFixed(2)} ر.س</td>
                                        </tr>
                                        <!-- FINAL NET PROFIT - BOLD STANDOUT ROW -->
                                        <tr style="background: #1b5e20; border-top: 3px double #a5d6a7;">
                                            <td style="padding: 10px 10px; font-size: 13px; font-weight: 900; color: #fff;">🏆 ${this.currentLang === 'en' ? 'Final Net Profit' : 'صافي الربح النهائي'}</td>
                                            <td style="padding: 10px 10px; text-align: left; font-weight: 900; direction: ltr; color: #fff; font-size: 16px;">${netProfit.toFixed(2)} ر.س</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- ══ FOOTER ══ -->
                <div style="text-align: center; margin-top: 16px; padding-top: 10px; border-top: 1px solid #eee; color: #aaa; font-size: 10px;">
                    <span>${this.currentLang === 'en' ? 'Report generated by <strong>Sahab POS System</strong>' : 'تم توليد هذا التقرير بواسطة <strong>نظام سحاب POS</strong>'}</span>
                    &nbsp;|&nbsp;
                    <span style="direction: ltr; display: inline-block;">${new Date().toLocaleString('en-US')}</span>
                </div>
            </div>
        `;

        // Zero Reset (Live Database Update)
        const invoices = await localforage.getItem('invoices') || [];
        const exps = await localforage.getItem('expenses') || [];

        /* Begin localized date logic */
        const KSA_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', calendar: 'gregory' });
        const targetFormattedDate = getLocalYMD();

        // Filter invoices based on KSA date logi
        const filteredInvoices = invoices.filter(invoice => {
            if (!invoice) return false;
            if (invoice.isZReported) return false;

            // Format match check: Ensure strict alignment with the current shift
            const dStr = invoice.timestamp || invoice.date || new Date().toISOString();
            const fallbackStr = getLocalYMD(new Date(dStr));
            return fallbackStr === targetFormattedDate;
        });
        /* End localized date logic */

        // Apply identical bounds to expenses
        const shiftExpenses = exps.filter(e => e && !e.isZReported && (e.date === targetFormattedDate || getLocalYMD(e.timestamp) === targetFormattedDate));

        // ═══ CRITICAL FIX: MARK CLOSED STATE *BEFORE* SERIALIZING TO ARCHIVE DB ═══
        filteredInvoices.forEach(i => { if (i && i.paymentStatus !== 'unpaid') i.isZReported = true; });
        shiftExpenses.forEach(e => { if (e) e.isZReported = true; });

        // Wait... there may be invoices that didn't match the KSA date but ARE from today's shift visually?
        // To be absolutely safe and prevent rogue ghost invoices from persisting: 
        // EXCEPTION: Unpaid "Pay Later" invoices MUST persist across daily closures.
        invoices.forEach(i => {
            if (i && i.paymentStatus !== 'unpaid') {
                i.isZReported = true;
            }
        });
        exps.forEach(e => { if (e) e.isZReported = true; });

        const archiveEntry = {
            id: 'Z-' + Date.now(),
            timestamp: Date.now(),
            date: reportDate,
            totals: { gross, refunds, netRev, opExps, netProfit, paymentBreakdown: { cashTotal, madaTotal, visaTotal, mastercardTotal }, uncollected },
            invoices: filteredInvoices,
            expenses: shiftExpenses
        };

        let archived = await localforage.getItem('archived_z_reports') || [];
        archived.push(archiveEntry);
        await localforage.setItem('archived_z_reports', archived);
        await manualSyncToCloud('archived_z_reports', archived);

        // Filter out the closed items physically from the live queue
        const activeInvoices = invoices.filter(i => i && !i.isZReported);
        const activeExps = exps.filter(e => e && !e.isZReported);

        await localforage.setItem('invoices', activeInvoices);
        await localforage.setItem('expenses', activeExps);
        await manualSyncToCloud('invoices', activeInvoices);
        await manualSyncToCloud('expenses', activeExps);

        // ═══ STEP 4: CLEAN SLATE — Reset the active Live view to empty ═══
        // Reset date to today in Live Shift mode (clears the historical browse state)
        this.currentViewDate = getLocalYMD();
        this.reportFilterDate = null; // null = Live Shift mode (only un-reported invoices)

        // Close modal before re-rendering
        const previewModal = document.getElementById('z-report-preview-modal');
        if (previewModal) previewModal.classList.add('hidden');

        // Force full re-render: Dashboard → 0.00 SAR, Invoice Table → empty
        await this.renderReports();
        await this.renderHistory();

        // === مسح الذاكرة المحلية بالقوة ===
        localStorage.setItem('invoices', '[]');
        localStorage.setItem('expenses', '[]');

        // === رسالة النجاح ===
        const msg = this.currentLang === 'en' ? '✅ Day closed successfully. Records zeroed.' : '✅ تم إغلاق اليومية بنجاح وتصفير السجل.';
        if (this.showToast) this.showToast(msg); else alert(msg);

        // === إصدار ملف PDF / طباعة التقرير (Native Print) ===
        try {
            // Hide standard invoice container specifically just in case
            const invContainer = document.getElementById('invoice-print-container');
            if (invContainer) invContainer.innerHTML = '';

            const zContainer = document.getElementById('z-report-print-container');
            if (zContainer) {
                zContainer.innerHTML = reportContent;
            }

            // Native Browser Print Dialog (Handles A4 export perfectly)
            // استخدام تأخير بسيط لضمان قيام نظام iOS (Safari) بتحميل عناصر الطباعة قبل فتح نافذة الطباعة
            setTimeout(() => {
                window.print();
                // تم إزالة مسح العنصر وتحديث الصفحة بشكل إجباري لأنها تقطع عملية الطباعة وتنتج صفحة بيضاء في نظام الجوال
            }, 500);

        } catch (printErr) {
            console.error('[Print Gen] Error:', printErr);
        }
    },

    async showZReportPreview() {
        // UI-Bound Synchronization: Pull data from the Dashboard UI instead of re-calculating
        const syncEl = document.getElementById('db-sync-data');
        if (!syncEl) {
            alert('يرجى فتح صفحة القوائم المالية لمزامنة البيانات قبل الإغلاق.');
            return;
        }

        const gross = parseFloat(syncEl.dataset.gross) || 0;
        const refunds = parseFloat(syncEl.dataset.refunds) || 0;
        const netRev = parseFloat(syncEl.dataset.netRev) || 0;
        const opExps = parseFloat(syncEl.dataset.opex) || 0;
        const lCosts = parseFloat(syncEl.dataset.laundryCosts) || 0;
        const netProfit = parseFloat(syncEl.dataset.profit) || 0;
        const cashTotal = parseFloat(syncEl.dataset.cash) || 0;
        const madaTotal = parseFloat(syncEl.dataset.mada) || 0;
        const visaTotal = parseFloat(syncEl.dataset.visa) || 0;
        const mastercardTotal = parseFloat(syncEl.dataset.mastercard) || 0;
        const collected = parseFloat(syncEl.dataset.collected) || 0;
        const uncollected = parseFloat(syncEl.dataset.uncollected) || 0;

        const format = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const lang = this.currentLang || 'ar';
        const content = `
            <!-- Payment Breakdown Section -->
            <div style="background: rgba(253, 184, 19, 0.05); border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 15px 0; color: var(--primary); font-size: 15px; border-bottom: 1px solid rgba(253,184,19,0.2); padding-bottom: 10px; display: flex; align-items: center;">
                    <i class="fa-solid fa-receipt" style="margin-left: 10px;"></i> ${lang === 'en' ? 'Payment Details' : 'تفاصيل الدفع'}
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-body); padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border);">
                        <span style="color: var(--text-muted); font-size: 13px;">${lang === 'en' ? 'Cash' : 'نقدي (Cash)'}</span>
                        <span style="font-weight: 800; color: #fff; direction: ltr; font-size: 15px;">${format(cashTotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-body); padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border);">
                        <span style="color: var(--text-muted); font-size: 13px;">${lang === 'en' ? 'Mada' : 'مدى (Mada)'}</span>
                        <span style="font-weight: 800; color: #fff; direction: ltr; font-size: 15px;">${format(madaTotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-body); padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border);">
                        <span style="color: var(--text-muted); font-size: 13px;">${lang === 'en' ? 'Visa' : 'فيزا (Visa)'}</span>
                        <span style="font-weight: 800; color: #fff; direction: ltr; font-size: 15px;">${format(visaTotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-body); padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border);">
                        <span style="color: var(--text-muted); font-size: 13px;">${lang === 'en' ? 'Mastercard' : 'ماستركارد'}</span>
                        <span style="font-weight: 800; color: #fff; direction: ltr; font-size: 15px;">${format(mastercardTotal)}</span>
                    </div>
                </div>
            </div>

            <div class="z-report-grid">
                <div class="z-report-item">
                    <div class="info">
                        <i class="fa-solid fa-cart-shopping" style="color:var(--primary); margin-left:10px;"></i>
                        <span class="label">${lang === 'en' ? 'Gross Sales' : 'إجمالي المبيعات'}</span>
                    </div>
                    <span class="value">${format(gross)} ر.س</span>
                </div>
                <div class="z-report-item">
                    <div class="info">
                        <i class="fa-solid fa-rotate-left" style="color:var(--danger); margin-left:10px;"></i>
                        <span class="label">${lang === 'en' ? 'Total Refunds' : 'إجمالي المرتجعات'}</span>
                    </div>
                    <span class="value" style="color:var(--danger)">- ${format(refunds)} ر.س</span>
                </div>
                <div class="z-report-item" style="background: rgba(46, 125, 50, 0.1); border-color: rgba(46, 125, 50, 0.3);">
                    <div class="info">
                        <i class="fa-solid fa-money-bill-trend-up" style="color:#4caf50; margin-left:10px;"></i>
                        <span class="label" style="color:#4caf50">${lang === 'en' ? 'Net Revenue' : 'صافي الإيرادات'}</span>
                    </div>
                    <span class="value" style="color:#4caf50">${format(netRev)} ر.س</span>
                </div>
                <div class="z-report-item" style="background: rgba(14, 165, 233, 0.1); border-color: rgba(14, 165, 233, 0.3);">
                    <div class="info">
                        <i class="fa-solid fa-hand-holding-dollar" style="color:#0ea5e9; margin-left:10px;"></i>
                        <span class="label" style="color:#0ea5e9">${lang === 'en' ? 'Collected Amounts' : 'المبالغ المحصلة (مقبوضات)'}</span>
                    </div>
                    <span class="value" style="color:#0ea5e9">${format(collected)} ر.س</span>
                </div>
                <div class="z-report-item">
                    <div class="info">
                        <i class="fa-solid fa-file-invoice-dollar" style="color:var(--danger); margin-left:10px;"></i>
                        <span class="label">${lang === 'en' ? 'Operating Expenses' : 'إجمالي المصاريف التشغيلية'}</span>
                    </div>
                    <span class="value" style="color:var(--danger)">- ${format(opExps)} ر.س</span>
                </div>
                <div class="z-report-item">
                    <div class="info">
                        <i class="fa-solid fa-clock" style="color:#f59e0b; margin-left:10px;"></i>
                        <span class="label">${lang === 'en' ? 'Uncollected (Rolling)' : 'مبالغ غير محصلة (تراكمي)'}</span>
                    </div>
                    <span class="value" style="color:#f59e0b">${format(uncollected)} ر.س</span>
                </div>
                <div class="z-report-item profit">
                    <div class="info">
                        <i class="fa-solid fa-wallet" style="color:var(--primary); margin-left:10px; font-size: 24px;"></i>
                        <div style="display:flex; flex-direction:column;">
                            <span class="label">${lang === 'en' ? 'Net Profit' : 'صافي الربح النهائي'}</span>
                        </div>
                    </div>
                    <span class="value">${format(netProfit)} ر.س</span>
                </div>
            </div>
            <div style="margin-top:25px; padding:15px; background:rgba(253,184,19,0.05); border-radius:12px; text-align:center;">
                <p style="font-size:13px; color:var(--text-muted); line-height:1.6; margin:0;">
                    <i class="fa-solid fa-triangle-exclamation" style="color:var(--primary); margin-left:5px;"></i>
                    ${lang === 'en' ? 'Upon approval, all current operations will be zeroed and archived.' : 'عند الاعتماد، سيتم تصفير جميع العمليات الحالية وأرشفتها.'}
                </p>
            </div>
        `;
        document.getElementById('z-report-preview-content').innerHTML = content;
        document.getElementById('z-report-preview-modal').classList.remove('hidden');
    },
};

// =====================================================
// FIREBASE AUTH STATE OBSERVER — controls app startup
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const appEl = document.getElementById('app');

    // UI state is initially determined by the 'Fast Guard' script at the top of app.js
    // to prevent login flash on refresh.

    if (typeof firebase === 'undefined') {
        // No Firebase — run in local mode directly
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (appEl) appEl.style.display = 'block';
        appLogic.init();
        return;
    }

    // PERSISTENCE: Allow session to survive page refreshes and browser restarts
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    firebase.auth().onAuthStateChanged(async (user) => {
        const adminBtn = document.getElementById('admin-nav-btn');
        if (user) {
            // ✅ LOGGED IN - Mirror session in localStorage for tracking
            window.currentUID = user.uid;
            localStorage.setItem('sahab_session_uid', user.uid);

            // 🔐 INITIAL SECURITY CHECK (Kill Switch)
            // Ensure account is STILL active before allowing POS dashboard access
            try {
                const snap = await firebase.database().ref(`users/${user.uid}/accountDetails/isActivated`).once('value');
                if (snap.exists() && snap.val() === false) {
                    console.warn("[SECURITY] Account deactivated. Force logging out.");
                    await firebase.auth().signOut();
                    localStorage.removeItem('sahab_session_uid');
                    location.reload();
                    return;
                }
            } catch (err) {
                console.error("[Auth] Status check failed:", err);
            }

            if (loginOverlay) loginOverlay.style.display = 'none';
            if (appEl) appEl.style.display = 'block';

            // SaaS Logic: Show Admin Panel only for Super Admin UID/Email
            if (user.email === `${ADMIN_PIN}@sahab.pos`) {
                if (adminBtn) adminBtn.classList.remove('hidden');
                console.log('[Admin] Super Admin Identity Confirmed.');
            } else {
                if (adminBtn) adminBtn.classList.add('hidden');
            }

            // Load tenant settings & apply branding BEFORE init
            await appLogic.loadTenantSettings(user.uid);

            // Deploy Realtime SaaS Daemons (Kill Switch listener)
            appLogic.initRealtimeSecurity(user.uid);

            // Now boot the app
            await appLogic.init();

            // RESTORE ACTIVE VIEW
            const savedView = localStorage.getItem('sahab_active_view');
            if (savedView && savedView !== 'pos') {
                console.log(`[Navigation] Restoring persistent view: ${savedView}`);
                appLogic.switchView(savedView);
            }

            // ✨ FINAL RENDER: Show the app after layout is stable
            const appContainer = document.getElementById('app');
            if (appContainer) {
                appContainer.classList.add('app-ready');
            }

            // 💨 HIDE LOADER: Dashboard is steady
            hideInitialLoader();
        } else {
            // ❌ NOT LOGGED IN — show login screen
            window.currentUID = null;
            localStorage.removeItem('sahab_session_uid');
            if (adminBtn) adminBtn.classList.add('hidden');
            if (loginOverlay) loginOverlay.style.display = 'flex';
            if (appEl) appEl.style.display = 'none';
            const pinInput = document.getElementById('pin-input');
            if (pinInput) pinInput.focus();

            // 💨 HIDE LOADER: Login screen is prompt
            hideInitialLoader();
        }
    });
});
