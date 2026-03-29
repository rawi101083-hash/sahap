// Sahab POS - Main Application Logic
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

// ZATCA Phase 1 TLV & Base64 Encoder (byte-array approach — handles Arabic UTF-8 correctly)
const zatcaEncoder = {
    toUTF8Bytes: function(str) {
        return new TextEncoder().encode(String(str));
    },
    buildTLV: function(tag, value) {
        const valBytes = this.toUTF8Bytes(value);
        // [Tag (1 byte)] [Length (1 byte)] [Value bytes...]
        return new Uint8Array([tag, valBytes.length, ...valBytes]);
    },
    generateZATCA_QR: function(sellerName, vatNumber, timestamp, total, vatTotal) {
        try {
            const name    = (sellerName && sellerName.trim()) ? sellerName.trim() : 'Redix';
            const vat     = (vatNumber  && vatNumber.trim()  && vatNumber.length === 15 && vatNumber !== '000000000000000') ? vatNumber : '300000000000000';
            const isoTime = new Date(timestamp).toISOString().split('.')[0] + 'Z';
            const fTotal  = parseFloat(total   || 0).toFixed(2);
            const fVat    = parseFloat(vatTotal || 0).toFixed(2);

            // Concatenate all TLV byte arrays
            const parts = [
                this.buildTLV(1, name),
                this.buildTLV(2, vat),
                this.buildTLV(3, isoTime),
                this.buildTLV(4, fTotal),
                this.buildTLV(5, fVat)
            ];
            const totalLen = parts.reduce((s, p) => s + p.length, 0);
            const all = new Uint8Array(totalLen);
            let offset = 0;
            parts.forEach(p => { all.set(p, offset); offset += p.length; });

            // Convert to binary string then Base64
            let binaryStr = '';
            all.forEach(b => { binaryStr += String.fromCharCode(b); });
            return btoa(binaryStr);
        } catch (err) {
            console.error('ZATCA QR generation failed:', err);
            return 'AQzZhdi62LPZhNipINmG2YrYp9mB'; // safe fallback — won't crash the POS
        }
    }
};



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

// 1. SIMPLE STORAGE: localforage now ONLY handles local database
localforage.setItem = async function (key, value) {
    return await originalSetItem.call(localforage, key, value);
};

// 2. EXPLICIT SYNC: Manual helper to send data to Firebase (UID-scoped)
async function manualSyncToCloud(key, value) {
    if (!window.isDataInitialized) {
        console.warn(`[Sync-Blocked] Cannot save ${key}. System is still initializing.`);
        return;
    }
    
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY" && !!firebaseConfig.apiKey) {
        try {
            console.log(`[Manual-Sync] Sending ${key} to cloud...`);
            const safePayload = JSON.parse(JSON.stringify(value, (k, v) => (v === undefined ? null : v)));
            await firebase.database().ref(getDbPath(key)).set(safePayload);
            console.log(`[Manual-Sync] ${key} saved successfully.`);
        } catch (err) {
            console.error(`[Manual-Sync] Error saving ${key}:`, err);
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

    const fetchPromises = collectionsToSync.map(key => {
        return new Promise((resolve) => {
            const dbRef = firebase.database().ref(getDbPath(key));
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
                    console.log(`[Recovery] No cloud data for ${key}. Local cache remains intact.`);
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
                    window.appLogic.refreshActiveView();
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
window.appLogic = {
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
        const savedTheme = localStorage.getItem('redix-theme') || 'dark';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('redix-theme', theme);
        
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
        
        console.log("[App] Initialization pulse complete. Data is now protected and loaded.");
        
        await this.updateLaundryDatalist();
        this.renderItems();
        this.updateCartUI();
    },

    async updateLaundryDatalist() {
        try {
            const invs = await localforage.getItem('invoices') || [];
            const laundries = new Set();
            const hoods = new Set();
            
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
                datalist.innerHTML = '';
                Array.from(laundries).sort().forEach(name => {
                    datalist.innerHTML += `<option value="${name}">`;
                });
            }

            const hoodDatalist = document.getElementById('saved-neighborhoods');
            if (hoodDatalist) {
                hoodDatalist.innerHTML = '';
                Array.from(hoods).sort().forEach(hood => {
                    hoodDatalist.innerHTML += `<option value="${hood}">`;
                });
            }
        } catch(e) { console.error('Error updating datalists', e); }
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
            card.innerHTML = `<div class="item-icon"><i class="fa-solid ${item.icon}"></i></div><div class="item-name">${item.name}</div>`;
            card.onclick = () => this.openModal(item);
            grid.appendChild(card);
        });
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
            this.cart.unshift({ // Add to top for immediate visibility
                id: this.modalState.item.id,
                name: this.modalState.item.name,
                type: this.modalState.type,
                speed: this.modalState.speed,
                qty: this.modalState.qty,
                unitPrice: this.modalState.price
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
            container.innerHTML = '<div class="empty-cart-msg">السلة فارغة، يرجى اختيار أصناف.</div>';
        } else {
            this.cart.forEach((item, index) => {
                let tLbl = item.type === 'iron' ? 'كوي فقط' : (item.type === 'wash_iron' ? 'غسيل وكوي' : 'غسيل فقط');
                let sLbl = item.speed === 'normal' ? 'عادي' : 'مستعجل';
                container.innerHTML += `
                    <div class="cart-item">
                        <div style="flex:1">
                            <div class="cart-item-title">${item.name} <span class="cart-item-qty">x${item.qty}</span></div>
                            <div class="cart-item-meta">${tLbl} - ${sLbl}</div>
                        </div>
                        <div class="cart-item-price">${(item.unitPrice * item.qty).toFixed(2)}</div>
                        <button class="btn-remove" onclick="appLogic.removeFromCart(${index})"><i class="fa-solid fa-times"></i></button>
                    </div>
                `;
            });
        }

        const subt = this.cart.reduce((s, i) => s + (i.unitPrice * i.qty), 0);
        let finalTotal = (subt + this.deliveryFee).toFixed(2) + ' ر.س';
        document.getElementById('grand-total').innerText = finalTotal;
        const mobileTotal = document.getElementById('mobile-grand-total');
        if (mobileTotal) mobileTotal.innerText = finalTotal;
        const goldenTotal = document.getElementById('golden-trigger-total');
        if (goldenTotal) goldenTotal.innerText = finalTotal;

        // Dynamic Delivery Buttons
        this.renderDeliveryButtons();
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

        const custNameInput  = document.getElementById('customer-name')  ? document.getElementById('customer-name').value.trim()  : (this.customer.name  || '').trim();
        const custPhoneInput = document.getElementById('customer-phone') ? document.getElementById('customer-phone').value.trim() : (this.customer.phone || '').trim();

        // Phone is optional — but if entered it MUST be a valid Saudi number (10 digits, starts with 05)
        if (custPhoneInput && !/^05\d{8}$/.test(custPhoneInput)) {
            const errEl = document.getElementById('phone-error');
            if (errEl) { errEl.textContent = 'رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05'; errEl.style.display = 'block'; }
            document.getElementById('customer-phone').focus();
            return;
        }

        let cName  = custNameInput  || 'عميل نقدي';
        let cPhone = custPhoneInput || '0000000000';


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
            newInvId = `INV-${String(max + 1).padStart(6, '0')}`;
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
            items: [...this.cart], 
            deliveryFee: parseFloat(this.deliveryFee) || 0, 
            total: parseFloat(grT) || 0, // AUTHORITATIVE REVENUE FIELD
            grandTotal: parseFloat(grT) || 0, 
            laundryCost: pCost, // AUTHORITATIVE PARTNER COST FIELD
            partnerLaundryCost: pCost,
            partnerLaundryName: pName,
            partnerLaundryNeighborhood: pHood,
            laundryPaid: pPaid,
            status: 'completed',
            paymentMethod: 'cash'
        };

        // Calculate 15% Inclusive VAT: Subtotal = Total / 1.15, VAT = Total - Subtotal
        const _total = parseFloat(grT) || 0;
        const _subtotalNet = _total / 1.15;
        const _vatAmount = _total - _subtotalNet;

        invoiceData.subtotalNet = _subtotalNet;
        invoiceData.vatAmount = _vatAmount;

        this.pendingInvoice = invoiceData;

        // Render Thermal HTML into Preview Container
        document.getElementById('invoice-preview-container').innerHTML = this.generateThermalHTML(invoiceData, 'preview-qr-render');

        // Render QR in Preview (ZATCA Base64 TLV Format)
        const bizNamePreview = window.tenantSettings?.name || 'Redix';
        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR(bizNamePreview, window.tenantSettings?.taxNumber || "000000000000000", invoiceData.timestamp, invoiceData.grandTotal, invoiceData.vatAmount);

        new QRCode(document.getElementById('preview-qr-render'), {
            text: zatcaQRBase64,
            width: 100, height: 100,
            colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.L
        });

        // Setup UI State for Preview
        document.getElementById('modal-actions-preview').classList.remove('hidden');
        document.getElementById('modal-actions-success').classList.add('hidden');

        document.getElementById('preview-invoice-id').innerText = invoiceData.id;
        document.getElementById('invoice-preview-modal').classList.remove('hidden');
    },

    async confirmCheckout() {
        console.log('Button Clicked: confirmCheckout - Start confirming invoice');
        if (!this.pendingInvoice) return;

        // Save Customer intelligently
        if (this.customer.phone && this.customer.phone !== '0000000000') {
            let customers = await localforage.getItem('customers') || [];
            let cIdx = customers.findIndex(c => c.phone === this.customer.phone);
            let cData = { phone: this.customer.phone, name: this.customer.name || 'عميل نقدي', timestamp: Date.now() };
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

        // Switch Modal State
        document.getElementById('success-invoice-ref').innerText = this.currentInvoice.id;
        document.getElementById('modal-actions-preview').classList.add('hidden');
        document.getElementById('modal-actions-success').classList.remove('hidden');

        // WhatsApp sharing is now always available — users can forward to any contact if no number was provided
        const _waBtnEl = document.getElementById('btn-whatsapp-share');
        if (_waBtnEl) _waBtnEl.style.display = 'block';

        // Reset POS background
        this.cart = [];
        this.customer = { phone: '', name: '' };
        const _phoneEl = document.getElementById('customer-phone');
        const _errEl   = document.getElementById('phone-error');
        if (_phoneEl) { _phoneEl.value = ''; _phoneEl.style.borderColor = ''; }
        if (_errEl)   { _errEl.style.display = 'none'; _errEl.textContent = ''; }
        document.getElementById('customer-name').value = '';

        if (document.getElementById('pos-laundry-name')) document.getElementById('pos-laundry-name').value = '';
        if (document.getElementById('pos-laundry-cost')) document.getElementById('pos-laundry-cost').value = '';
        if (document.getElementById('pos-laundry-paid')) document.getElementById('pos-laundry-paid').value = 'false';
        this.updateCartUI();

        await this.updateLaundryDatalist();

        // Auto Download PDF
        await this.downloadDigitalPDF(null);
    },
    closeInvoicePreview() {
        document.getElementById('invoice-preview-modal').classList.add('hidden');
        this.currentInvoice = null;
        this.pendingInvoice = null;
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

    printThermalReceipt() {
        if (!this.currentInvoice) return;
        this.printInvoice(this.currentInvoice);
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
        const storeName  = window.tenantSettings?.name || 'المغسلة';
        const invId      = inv.id || '';
        const total      = (inv.grandTotal || inv.total || 0).toFixed(2);
        const msg = encodeURIComponent(
            `مرحباً ${inv.customer.name || 'عزيزي العميل'}،\n` +
            `شكراً لتعاملكم مع ${storeName}.\n` +
            `فاتورتكم رقم ${invId} بمبلغ ${total} ر.س جاهزة.\n` +
            `نسعد بخدمتكم دائماً 😊\n` +
            `— نظام Redix | ريدكس`
        );

        const url = `https://wa.me/${waTarget}?text=${msg}`;
        window.open(url, '_blank');
    },

    async downloadDigitalPDF(event) {
        console.log('Button Clicked: downloadDigitalPDF - Generating ERP Invoice');
        if (!this.currentInvoice) return;

        const data = this.currentInvoice;
        const dObj = new Date(data.timestamp);
        const dStrHijri = dObj.toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const dStrGregorian = dObj.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        const dStr = `${dStrHijri} / ${dStrGregorian}`;

        // WhatsApp link helper — formats Saudi numbers to wa.me/966xxxxxxxxx
        const _waLink = (phone, display) => {
            if (!phone || phone === '0000000000') return '-';
            let digits = phone.replace(/\D/g, '');
            if (digits.startsWith('966')) { /* already international */ }
            else if (digits.startsWith('0')) digits = '966' + digits.slice(1);
            else digits = '966' + digits;
            const shown = display || phone;
            return `<a href="https://wa.me/${digits}" target="_blank" style="color:#25D366; text-decoration:none; font-weight:bold;">&#x1F4AC; ${shown}</a>`;
        };

        const _vatAmt   = parseFloat(data.vatAmount || 0);
        const _delivery = parseFloat(data.deliveryFee || 0);
        const _grand    = parseFloat(data.grandTotal || data.total || 0);
        const _subtotal = _grand - _vatAmt;
        const _storeTax = window.tenantSettings?.taxNumber
            ? `<p style="margin:2px 0; font-size:14px; color:#444;">الرقم الضريبي: &nbsp;&nbsp; <strong style="direction:ltr; display:inline-block;">${window.tenantSettings.taxNumber}</strong></p>` : '';
        const _storeWA  = window.tenantSettings?.phone
            ? `<p style="margin:2px 0; font-size:14px; color:#444;">رقم جوال النشاط: &nbsp;&nbsp; <strong style="direction:ltr; display:inline-block;">${window.tenantSettings.phone}</strong></p>` : '';
        const _storeAddress = window.tenantSettings?.address
            ? `<p style="margin:2px 0; font-size:14px; color:#444;">العنوان: &nbsp;&nbsp; <strong style="direction:rtl; display:inline-block;">${window.tenantSettings.address}</strong></p>`
            : `<p style="margin:2px 0; font-size:14px; color:#444;">العنوان: &nbsp;&nbsp; <strong style="direction:rtl; display:inline-block;">المملكة العربية السعودية</strong></p>`;
        const _invType  = _vatAmt > 0 ? 'فاتورة ضريبية مبسطة' : 'فاتورة';

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
                <td style="padding:9px 0; text-align:center;">${_delivery.toFixed(2)}</td>
                <td style="padding:9px 0; text-align:center; font-weight:bold;">${_delivery.toFixed(2)}</td>
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
                <div style="font-size:32px; font-weight:900; color:#000; margin-top:6px; margin-bottom:14px;">${window.tenantSettings?.name || 'Redix'}</div>
                ${_storeAddress}
                ${_storeTax}
                ${_storeWA}
                <div style="margin-top:14px; font-size:16px; font-weight:bold; color:#000;">${_invType}</div>
            </div>

            <!-- Invoice & Customer Info — RTL table with colon on the correct left side -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:14px; direction:rtl;">
                <tr>
                    <td style="padding:5px 0; color:#555; white-space:nowrap; width:120px; unicode-bidi:plaintext; direction:rtl;">&#x202B;رقم الفاتورة:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000;">${data.id}</td>
                    <td style="padding:5px 0; color:#555; white-space:nowrap; width:80px; unicode-bidi:plaintext; direction:rtl;">&#x202B;التاريخ:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000; direction:ltr; text-align:right;">${dStr}</td>
                </tr>
                <tr>
                    <td style="padding:5px 0; color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;العميل:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000;">${data.customer.name || 'عميل نقدي'}</td>
                    <td style="padding:5px 0; color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;رقم الجوال:&#x200F;</td>
                    <td style="padding:5px 10px; font-weight:bold; color:#000; direction:ltr; text-align:right;">${_waLink(data.customer.phone, data.customer.phone)}</td>
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
                    <tr>
                        <td style="padding:6px 0; color:#555;">المجموع بدون ضريبة</td>
                        <td style="padding:6px 0; padding-right:20px; font-weight:bold; direction:ltr; text-align:left;">${_subtotal.toFixed(2)} ر.س</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#555;">ضريبة القيمة المضافة 15٪</td>
                        <td style="padding:6px 0; padding-right:20px; font-weight:bold; direction:ltr; text-align:left;">${_vatAmt.toFixed(2)} ر.س</td>
                    </tr>
                    <tr style="border-top:1px solid #000;">
                        <td style="padding:10px 0; font-size:16px; font-weight:900; color:#000;">الإجمالي النهائي</td>
                        <td style="padding:10px 0; padding-right:20px; font-size:18px; font-weight:900; color:#000; direction:ltr; text-align:left;">${_grand.toFixed(2)} ر.س</td>
                    </tr>
                </table>
            </div>

            <!-- ZATCA QR centered at bottom -->
            <div style="text-align:center; border-top:1px solid #ccc; padding-top:25px;">
                <div id="pdf-qr-container" style="display:inline-block; margin-bottom:10px;"></div>
                <div style="font-size:13px; color:#555;">شكراً لتعاملكم معنا - نظام Redix | ريدكس</div>
            </div>

        </div>
        `;

        document.body.appendChild(container);

        // Standard ZATCA QR (Updated with Real Tax)
        const bizName = window.tenantSettings?.name || 'Redix';
        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR(bizName, window.tenantSettings?.taxNumber || "000000000000000", data.timestamp, data.grandTotal, data.vatAmount);
        new QRCode(container.querySelector('#pdf-qr-container'), {
            text: zatcaQRBase64,
            width: 140, height: 140,
            colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M
        });

        const opt = {
            margin: 0,
            filename: `Invoice_${data.id}.pdf`,
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
        let t = document.getElementById('toast-msg');
        if (!t) {
            t = document.createElement('div');
            t.id = 'toast-msg';
            t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#4CAF50;color:#fff;padding:15px 30px;border-radius:30px;font-weight:bold;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,0.5);opacity:0;transition:opacity 0.3s; pointer-events:none; font-family:"Tajawal",sans-serif; text-align:center; min-width:300px;';
            document.body.appendChild(t);
        }
        t.innerText = msg;
        t.style.opacity = '1';
        setTimeout(() => t.style.opacity = '0', 4000);
    },

    // HTML Generator for Thermal Receipt (Zero Ink — white background, RTL Arabic)
    generateThermalHTML(data, qrContainerId) {
        const dObj = new Date(data.timestamp);
        const dStrHijri = dObj.toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const dStrGregorian = dObj.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        const dStr = `${dStrHijri} / ${dStrGregorian}`;
        const vatAmount  = parseFloat(data.vatAmount  || 0);
        const deliveryFee = parseFloat(data.deliveryFee || 0);
        const grandTotal  = parseFloat(data.grandTotal  || data.total || 0);
        const combinedSum = grandTotal - vatAmount; // subtotal before VAT

        // WhatsApp link helper — formats Saudi numbers to wa.me/966xxxxxxxxx
        const _waLink = (phone, display) => {
            if (!phone || phone === '0000000000') return '-';
            let digits = phone.replace(/\D/g, '');
            if (digits.startsWith('966')) { /* already international */ }
            else if (digits.startsWith('0')) digits = '966' + digits.slice(1);
            else digits = '966' + digits;
            const shown = display || phone;
            return `<a href="https://wa.me/${digits}" target="_blank" style="color:#25D366; text-decoration:none; font-weight:bold;">&#x1F4AC; ${shown}</a>`;
        };


        // Build item rows
        let itemsHtml = '';
        data.items.forEach(item => {
            if (!item) return;
            let tLbl = item.type === 'iron' ? 'كوي' : (item.type === 'wash_iron' ? 'غسيل وكوي' : 'غسيل');
            let sLbl = item.speed === 'normal' ? 'عادي' : 'سريع';
            itemsHtml += `
            <tr>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:right;">${item.name} <span style="font-size:10px;"> &nbsp;-&nbsp; ${tLbl} &nbsp;-&nbsp; ${sLbl}</span></td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:center;">${item.qty}</td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:left;">${(item.unitPrice * item.qty).toFixed(2)}</td>
            </tr>`;
        });
        if (deliveryFee > 0) {
            itemsHtml += `
            <tr>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:right;">رسوم التوصيل</td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:center;">1</td>
                <td style="padding:4px 0; border-bottom:1px dashed #bbb; text-align:left;">${deliveryFee.toFixed(2)}</td>
            </tr>`;
        }

        const storePhone = window.tenantSettings?.phone
            ? `<p style="margin:0;"><span class="label">رقم جوال النشاط:</span> <span class="number">${window.tenantSettings.phone}</span></p>` : '';
        const storeTax = window.tenantSettings?.taxNumber
            ? `<p style="margin:0;"><span class="label">الرقم الضريبي:</span> <span class="number">${window.tenantSettings.taxNumber}</span></p>` : '';
        const storeAddress = window.tenantSettings?.address
            ? `<p style="margin:0;"><span class="label">العنوان:</span> <span class="number">${window.tenantSettings.address}</span></p>`
            : `<p style="margin:0;"><span class="label">العنوان:</span> <span class="number">المملكة العربية السعودية</span></p>`;

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
                <div style="font-size:18px; font-weight:900; margin-bottom:4px;">${window.tenantSettings?.name || 'Redix'}</div>
                ${storeAddress}
                ${storeTax}
                ${storePhone}
            </div>

            <!-- Meta info — colon pinned to left of each label via unicode-bidi -->
            <table style="width:100%; font-size:12px; margin-bottom:8px; border-collapse:collapse; direction:rtl;">
                <tr>
                    <td style="color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;رقم الفاتورة:&#x200F;</td>
                    <td style="font-weight:bold; text-align:left; direction:ltr;">${data.id}</td>
                </tr>
                <tr>
                    <td style="color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;التاريخ:&#x200F;</td>
                    <td style="text-align:left; direction:ltr;">${dStr}</td>
                </tr>
                <tr>
                    <td style="color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;العميل:&#x200F;</td>
                    <td style="font-weight:bold;">${data.customer.name || 'عميل نقدي'}</td>
                </tr>
                ${data.customer.phone && data.customer.phone !== '0000000000' ? `<tr><td style="color:#555; unicode-bidi:plaintext; direction:rtl;">&#x202B;&#x1585;&#x1602;&#x1605; &#x1575;&#x1604;&#x1580;&#x1608;&#x1575;&#x1604;:&#x200F;</td><td style="direction:ltr; text-align:left;">${_waLink(data.customer.phone, data.customer.phone)}</td></tr>` : ''}
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
                <tr>
                    <td style="padding:3px 0; color:#555;">المجموع بدون ضريبة</td>
                    <td style="text-align:left; font-weight:bold; direction:ltr;">${combinedSum.toFixed(2)} ر.س</td>
                </tr>
                <tr>
                    <td style="padding:3px 0; color:#555;">ضريبة القيمة المضافة 15٪</td>
                    <td style="text-align:left; font-weight:bold; direction:ltr;">${vatAmount.toFixed(2)} ر.س</td>
                </tr>
                <tr style="border-top:1px solid #000;">
                    <td style="padding:5px 0; font-size:14px; font-weight:900;">الإجمالي النهائي</td>
                    <td style="text-align:left; font-size:14px; font-weight:900; direction:ltr;">${grandTotal.toFixed(2)} ر.س</td>
                </tr>
            </table>

            <!-- ZATCA QR + Footer -->
            <div style="text-align:center; margin-top:12px; border-top:1px solid #ccc; padding-top:10px;">
                <div id="${qrContainerId}" style="display:inline-block; margin-bottom:6px;"></div>
                <div style="font-size:11px; color:#555;">شكراً لتعاملكم معنا - نظام Redix | ريدكس</div>
            </div>

        </div>`;
    },

    // 80mm Thermal Receipt Layout
    printInvoice(data) {
        document.getElementById('invoice-print-container').innerHTML = this.generateThermalHTML(data, 'print-qr-render');

        const bizName = window.tenantSettings?.name || 'Redix';
        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR(bizName, window.tenantSettings?.taxNumber || "000000000000000", data.timestamp, data.grandTotal, data.vatAmount);
        new QRCode(document.getElementById('print-qr-render'), {
            text: zatcaQRBase64,
            width: 120, height: 120,
            colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.L
        });

        window.print();
    },

    // History & Invoice Management
    async filterHistory() {
        const term = document.getElementById('history-search').value.toLowerCase();
        this.renderHistory(term);
    },

    async renderHistory(searchTerm = '') {
        try {
            const invs = await localforage.getItem('invoices') || [];
            
            // STRICT VALIDATION: Filter out undefined/empty invoices to kill ghosts
            let filteredInvoices = Array.isArray(invs) ? invs : Object.values(invs);
            let validInvoices = filteredInvoices.filter(i => i && i.id && typeof i.grandTotal !== 'undefined');

            // Cleanup corrupted ghosts permanently from DB
            if (validInvoices.length !== (Array.isArray(invs) ? invs.length : Object.keys(invs).length)) {
                await localforage.setItem('invoices', validInvoices);
            }

            let filtered = validInvoices;

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filtered = invs.filter(i => {
                    if (!i) return false;
                    let idMatch = i.id ? i.id.toLowerCase().includes(term) : false;
                    let cNameMatch = (i.customer && i.customer.name) ? i.customer.name.toLowerCase().includes(term) : false;
                    let cPhoneMatch = (i.customer && i.customer.phone) ? i.customer.phone.includes(term) : false;
                    let dMatch = i.timestamp ? new Date(i.timestamp).toLocaleString('ar-SA').toLowerCase().includes(term) : false;
                    return idMatch || cNameMatch || cPhoneMatch || dMatch;
                });
            }

            let html = '<table style="width:100%; border-collapse:collapse; background:var(--bg-surface); border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.5)">';
            html += '<thead><tr style="background:#111; color:var(--primary)"><th style="padding:15px; text-align:right;">رقم الفاتورة</th><th style="padding:15px; text-align:right;">العميل</th><th style="padding:15px; text-align:right;">المبلغ</th><th style="padding:15px; text-align:right;">التاريخ</th><th style="padding:15px; text-align:center;">إجراءات</th></tr></thead><tbody>';

            if (filtered.length === 0) {
                html += '<tr><td colspan="5" style="padding:20px; text-align:center;">لا توجد فواتير مطابقة للبحث.</td></tr>';
            } else {
                // UNIFIED SORTING: Newest First based on timestamp
                const displayInvoices = [...filtered].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                
                displayInvoices.forEach(i => {
                    if (!i) return;
                    const isCancelled = i.isCancelled === true;
                    let customerName = (i.customer && i.customer.name) ? i.customer.name : 'عميل نقدي';
                    let customerPhone = (i.customer && i.customer.phone) ? i.customer.phone : '0000000000';
                    let cellPhone = (customerPhone !== '0000000000') ? `<br><small style="color:var(--text-muted); direction:ltr; display:inline-block">${customerPhone}</small>` : '';
                    let total = i.grandTotal || 0;
                    let dateStr = i.timestamp ? new Date(i.timestamp).toLocaleString('ar-SA') : '-';
                    let partnerBadge = i.partnerLaundryName ? `<br><span onclick="appLogic.toggleLaundryPaid('${i.id}')" style="cursor:pointer; display:inline-block; margin-top:5px; font-size:11px; padding:3px 8px; border-radius:12px; background:${i.laundryPaid ? '#4CAF50' : '#f44336'}; color:#fff;"><i class="fa-solid ${i.laundryPaid ? 'fa-check' : 'fa-times'}"></i> مغسلة: ${i.partnerLaundryName} (${i.laundryPaid ? 'مدفوع' : 'غير مدفوع'})</span>` : '';

                    // Cancelled invoice visuals
                    const rowStyle = isCancelled
                        ? 'border-bottom:1px solid var(--border); opacity:0.55; background:rgba(255,70,70,0.06);'
                        : 'border-bottom:1px solid var(--border);';
                    const totalDisplay = isCancelled
                        ? `<span style="text-decoration:line-through; color:#f44336">${total.toFixed(2)} ر.س</span> <span style="display:inline-block; background:#c62828; color:#fff; font-size:11px; font-weight:900; padding:2px 8px; border-radius:12px; margin-right:6px;">ملغاة</span>`
                        : `${total.toFixed(2)} ر.س ${partnerBadge}`;
                    const cancelBtn = isCancelled
                        ? '' // Already cancelled — hide button
                        : `<button class="btn-action-icon btn-action-delete" onclick="appLogic.cancelInvoice('${i.id}')" title="إلغاء الفاتورة"><i class="fa-solid fa-ban"></i></button>`;

                    html += `<tr style="${rowStyle}">
                        <td style="padding:15px; font-weight:bold;">${i.id || 'N/A'}</td>
                        <td style="padding:15px;">${customerName}${cellPhone}</td>
                        <td style="padding:15px; font-weight:bold; color:${isCancelled ? '#f44336' : 'var(--primary)'}">${totalDisplay}</td>
                        <td style="padding:15px;">${dateStr}</td>
                        <td style="padding:15px; text-align:center;">
                            ${isCancelled ? '' : `<button class="btn-action-icon btn-action-info" onclick="appLogic.togglePartnerInfo('${i.id}')" title="تفاصيل المغسلة الشريكة"><i class="fa-solid fa-truck-ramp-box"></i></button>`}
                            <button class="btn-action-icon btn-action-print" onclick="appLogic.reprintInvoice('${i.id}')" title="معاينة وإعادة طباعة"><i class="fa-solid fa-print"></i></button>
                            ${isCancelled ? '' : `<button class="btn-action-icon btn-action-edit" onclick="appLogic.editInvoice('${i.id}')" title="تعديل"><i class="fa-solid fa-edit"></i></button>`}
                            ${cancelBtn}
                        </td>
                    </tr>
                    ${isCancelled ? '' : `<tr id="partner-info-${i.id}" class="hidden" style="background:rgba(253,184,19,0.03); border-bottom:2px solid var(--primary);">
                        <td colspan="5" style="padding:20px;">
                            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:15px; align-items:end;">
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:5px;">اسم المغسلة</label>
                                    <input type="text" id="partner-name-${i.id}" value="${i.partnerLaundryName || ''}" list="saved-laundries" style="width:100%; background:#000; color:#fff; border:1px solid var(--border); padding:8px; border-radius:4px;">
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:5px;">حساب المغاسل (ر.س)</label>
                                    <input type="number" id="partner-cost-${i.id}" value="${i.laundryCost || i.partnerLaundryCost || 0}" style="width:100%; background:#000; color:#fff; border:1px solid var(--border); padding:8px; border-radius:4px;">
                                </div>
                                <div>
                                    <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:5px;">الحي</label>
                                    <input type="text" id="partner-hood-${i.id}" value="${i.partnerLaundryNeighborhood || ''}" list="saved-neighborhoods" style="width:100%; background:#000; color:#fff; border:1px solid var(--border); padding:8px; border-radius:4px;">
                                </div>
                                <div>
                                    <button class="btn btn-primary" style="width:100%; padding:9px;" onclick="appLogic.savePartnerInfo('${i.id}')">حفظ التفاصيل</button>
                                </div>
                            </div>
                        </td>
                    </tr>`}`;
                });

            }
            html += '</tbody></table>';
            const container = document.getElementById('history-content');
            if (container) container.innerHTML = html;
        } catch (err) {
            console.error('Render History Error:', err);
            const container = document.getElementById('history-content');
            if (container) container.innerHTML = `<p style="color:red; text-align:center; padding:20px;">خطأ في تحميل سجل الفواتير: ${err.message}</p>`;
        }
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

        // Strict Mandatory Validation
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
        
        this.showToast('تم حفظ بيانات المغسلة الشريكة بنجاح');
        
        // Refresh UI to keep it consistent
        this.renderHistory();
        this.renderReports();
        this.renderLaundryAccounts(); // Ensure explicit recalculation
    },

    async reprintInvoice(id) {
        const invs = await localforage.getItem('invoices') || [];
        const invoiceData = invs.find(i => i.id === id);
        if (!invoiceData) return;

        this.currentInvoice = invoiceData;
        document.getElementById('invoice-preview-container').innerHTML = this.generateThermalHTML(invoiceData, 'preview-qr-render');

        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR(window.tenantSettings?.name || "Redix", window.tenantSettings?.taxNumber || "000000000000000", invoiceData.timestamp, invoiceData.grandTotal, invoiceData.vatAmount || 0);
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

    async editInvoice(id) {
        if (!confirm(`تعديل الفاتورة سيقوم بإلغائها الحالية ونقل محتوياتها إلى نقطة البيع لإنشاء فاتورة جديدة. هل تود المتابعة؟`)) return;

        let invs = await localforage.getItem('invoices') || [];
        const invoiceData = invs.find(i => i.id === id);
        if (!invoiceData) return;

        // Load to cart
        this.cart = [...invoiceData.items];
        this.customer = { phone: invoiceData.customer.phone || '', name: invoiceData.customer.name || '' };
        this.deliveryFee = invoiceData.deliveryFee || 0;
        this.editingInvoiceId = id; // Flag that we are updating this specific ID

        document.getElementById('customer-phone').value = this.customer.phone === '0000000000' ? '' : this.customer.phone;
        document.getElementById('customer-name').value = this.customer.name === 'عميل نقدي' ? '' : this.customer.name;

        if (document.getElementById('pos-laundry-name')) document.getElementById('pos-laundry-name').value = invoiceData.partnerLaundryName || '';
        if (document.getElementById('pos-laundry-hood')) document.getElementById('pos-laundry-hood').value = invoiceData.partnerLaundryNeighborhood || '';
        if (document.getElementById('pos-laundry-cost')) document.getElementById('pos-laundry-cost').value = invoiceData.laundryCost || invoiceData.partnerLaundryCost || '';
        if (document.getElementById('pos-laundry-paid')) document.getElementById('pos-laundry-paid').value = invoiceData.laundryPaid ? 'true' : 'false';

        // UI updates
        this.updateCartUI();
        this.switchView('pos');

        // ensure category is refreshed
        document.querySelector(`.nav-btn[onclick="appLogic.switchView('pos')"]`).classList.add('active');
    },

    async renderCustomers() {
        try {
            const custs = await localforage.getItem('customers') || [];
            const invs = await localforage.getItem('invoices') || [];

            // AGGRESSIVE SYNC: Map invoices to customers, exclude cancelled invoices
            const enriched = custs.map(c => {
                if (!c || !c.phone) return null;
                const customerInvoices = invs.filter(i => i && i.customer && i.customer.phone === c.phone && !i.isCancelled);
                const totalSpent = customerInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
                const orderCount = customerInvoices.length;
                return { ...c, totalSpent, orderCount };
            }).filter(c => c !== null && c.orderCount > 0);

            // AUTO-CLEANUP: If we found ghost customers in the list (0 orders), update the DB
            if (enriched.length !== custs.length) {
                console.log(`[Auto-Cleanup] Removing ghost customers with 0 invoices.`);
                await localforage.setItem('customers', enriched.map(({totalSpent, orderCount, ...c}) => c));
            }

            this.renderCustomersList(enriched);
        } catch (err) {
            console.error('Render Customers Error:', err);
        }
    },

    async filterCustomers() {
        try {
            const input = document.getElementById('customer-search');
            let term = input ? input.value.toLowerCase() : '';
            const custs = await localforage.getItem('customers') || [];
            let filtered = custs.filter(c => {
                if (!c) return false;
                let nameMatch = c.name ? c.name.toLowerCase().includes(term) : false;
                let phoneMatch = c.phone ? c.phone.includes(term) : false;
                return nameMatch || phoneMatch;
            });
            this.renderCustomersList(filtered);
        } catch (err) {
            console.error('Filter Customers Error:', err);
        }
    },

    renderCustomersList(customersArray) {
        try {
            let html = '<table style="width:100%; border-collapse:collapse; margin-top:20px; background:var(--bg-surface); border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.5)">';
            html += `<thead>
                <tr style="background:#111; color:var(--primary)">
                    <th style="padding:15px; text-align:right;">رقم الجوال</th>
                    <th style="padding:15px; text-align:right;">اسم العميل</th>
                    <th style="padding:15px; text-align:right;">عدد الطلبات</th>
                    <th style="padding:15px; text-align:right;">إجمالي المشتريات</th>
                    <th style="padding:15px; text-align:center;">إجراءات</th>
                </tr>
            </thead><tbody>`;
            if (customersArray.length === 0) {
                html += '<tr><td colspan="4" style="padding:20px; text-align:center;">لا توجد بيانات للعملاء حتى الآن.</td></tr>';
            } else {
                // FIXED SORTING: Newest First (b.timestamp - a.timestamp)
                const displayCustomers = [...customersArray].sort((a, b) => {
                    const timeA = a.timestamp || 0;
                    const timeB = b.timestamp || 0;
                    return timeB - timeA;
                });
                
                displayCustomers.forEach(c => {
                    if (!c) return;
                    let n = c.name || 'غير معروف';
                    let p = c.phone || 'غير مسجل';
                    let count = c.orderCount || 0;
                    let spent = c.totalSpent || 0;
                    
                    html += `<tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:15px; font-weight:bold; direction:ltr; text-align:right;">${p}</td>
                        <td style="padding:15px; font-weight:bold;">${n}</td>
                        <td style="padding:15px; font-weight:bold; color:var(--text-muted);">${count} طلب</td>
                        <td style="padding:15px; font-weight:bold; color:var(--primary); direction:ltr; text-align:right;">${spent.toFixed(2)} SAR</td>
                        <td style="padding:15px; text-align:center;">
                            <button class="btn btn-sm" style="background:var(--primary); color:#000; padding:5px 12px; border-radius:4px; font-weight:bold;" onclick="appLogic.viewCustomerOrders('${p}')">
                                <i class="fa-solid fa-list-ul"></i> عرض الفواتير
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

    viewCustomerOrders(phone) {
        this.switchView('history');
        const searchInput = document.getElementById('history-search');
        if (searchInput) {
            searchInput.value = phone;
            this.filterHistory();
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

            let html = '';

            // Consumables Section
            html += `
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; margin-bottom:20px;">
                <h3 style="margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">المواد الاستهلاكية (Consumables)</h3>
                ${trackedInv.length === 0 ? '<p style="color:var(--text-muted); text-align:center;">لا توجد مواد استهلاكية مضافة حالياً. أضف الجِير، الأكياس، الشماعات ليتم خصمها آلياً يدوياً.</p>' : ''}
            `;

            if (trackedInv.length > 0) {
                html += `<table style="width:100%; border-collapse:collapse; text-align:right; margin-bottom:20px;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--border); color:var(--text-muted);">
                            <th style="padding:10px;">SKU</th>
                            <th style="padding:10px;">الاسم</th>
                            <th style="padding:10px;">التكلفة</th>
                            <th style="padding:10px;">الرصيد المتاح (Qty)</th>
                            <th style="padding:10px;">إجمالي القيمة</th>
                            <th style="padding:10px; text-align:center;">إجراءات</th>
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
                                <i class="fa-solid fa-edit"></i> تعديل
                            </button>
                            <button class="btn-delete-svc" onclick="appLogic.deleteConsumable('${item.id}')" style="margin-right: 5px;">
                                <i class="fa-solid fa-trash"></i> حذف
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
                <h3 style="margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">خدمات المغسلة وأسعارها (Laundry Services)</h3>
                <div style="overflow-x: auto;">
                    <table class="inventory-table">
                        <thead>
                            <tr>
                                <th>الأيقونة</th>
                                <th>اسم الخدمة</th>
                                <th>الفئة</th>
                                <th>كوي</th>
                                <th>غسيل+كوي</th>
                                <th>غسيل</th>
                                <th>رسم السريع</th>
                                <th style="text-align:center;">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
            
            const services = window.appLogic.services || [];
            if (Array.isArray(services)) {
                services.forEach(item => {
                    if (!item) return;
                    const p = item.prices || {};
                    const iron = parseFloat(p.iron) || 0;
                    const washIron = parseFloat(p.wash_iron) || 0;
                    const wash = parseFloat(p.wash) || 0;
                    
                    let expLbl = '0.00';
                    if (item.expressFee) {
                        if (typeof item.expressFee === 'object') expLbl = 'متغير';
                        else expLbl = `+${parseFloat(item.expressFee).toFixed(2)}`;
                    }

                    html += `
                        <tr style="border-bottom:1px solid var(--border);">
                            <td style="padding:12px;"><i class="fa-solid ${item.icon || 'fa-shirt'}" style="font-size:20px; color:var(--primary);"></i></td>
                            <td style="padding:12px; font-weight:bold;">${item.name || 'N/A'}</td>
                            <td style="padding:12px;">${item.cat === 'men' ? 'رجالي' : (item.cat === 'women' ? 'نسائي' : 'أخرى')}</td>
                            <td style="padding:12px; color:var(--primary); font-weight:bold;">${iron.toFixed(2)}</td>
                            <td style="padding:12px; color:var(--primary); font-weight:bold;">${washIron.toFixed(2)}</td>
                            <td style="padding:12px; color:var(--primary); font-weight:bold;">${wash.toFixed(2)}</td>
                            <td style="padding:12px; color:#4CAF50; font-weight:bold;">${expLbl}</td>
                            <td style="padding:12px; text-align:center;">
                                <button class="btn-edit-svc" onclick="appLogic.openEditServiceModal('${item.id}')">
                                <i class="fa-solid fa-edit"></i> تعديل
                                </button>
                                <button class="btn-delete-svc" onclick="appLogic.deleteService('${item.id}')" style="margin-right: 5px;">
                                <i class="fa-solid fa-trash"></i> حذف
                                </button>
                            </td>
                        </tr>`;
                });
            }
            html += `</tbody></table></div></div>`;

            container.innerHTML = html;
            window.appLogic.renderDeliveryManager();
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
            
            let html = `
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th style="padding:12px; text-align:right;">اسم الخيار</th>
                            <th style="padding:12px; text-align:right;">المبلغ (ر.س)</th>
                            <th style="padding:12px; text-align:center;">إجراءات</th>
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
                html += '<tr><td colspan="3" style="text-align:center; padding:20px;">لا يوجد خيارات توصيل حالياً.</td></tr>';
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
                this.deliveryOptions[idx] = { ...this.deliveryOptions[idx], name: name, amount: amt };
            }
        } else {
            this.deliveryOptions.push({
                id: 'del_' + Date.now(),
                name: name,
                amount: amt
            });
        }

        await localforage.setItem('delivery_options', this.deliveryOptions);
        await manualSyncToCloud('delivery_options', this.deliveryOptions);
        
        this.closeDeliveryModal();
        this.renderInventory();
        this.updateCartUI();
        this.showToast('تم حفظ رسوم التوصيل');
    },

    async deleteDeliveryOption(id) {
        if (!confirm('هل أنت متأكد من حذف هذا الخيار؟')) return;
        this.deliveryOptions = this.deliveryOptions.filter(o => o.id !== id);
        
        await localforage.setItem('delivery_options', this.deliveryOptions);
        await manualSyncToCloud('delivery_options', this.deliveryOptions);
        
        this.renderInventory();
        this.updateCartUI();
        this.showToast('تم حذف الخيار');
    },

    // Wafeq UI: Expenses
    openAddExpenseModal() { 
        document.getElementById('add-expense-modal').classList.remove('hidden');
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    },
    closeExpenseModal() { document.getElementById('add-expense-modal').classList.add('hidden'); },
    async saveExpense() {
        let cat = document.getElementById('exp-category').value;
        let amount = parseFloat(document.getElementById('exp-amount').value);
        let desc = document.getElementById('exp-desc').value;
        let date = document.getElementById('expense-date').value;

        if (!amount || !desc || !date) { alert('يرجى تعبئة كافة الحقول لحفظ التقييد المحاسبي!'); return; }

        let exps = await localforage.getItem('expenses') || [];
        exps.push({ id: Date.now(), category: cat, amount: amount, desc: desc, date: date });
        await localforage.setItem('expenses', exps);
        await manualSyncToCloud('expenses', exps);

        this.closeExpenseModal();
        this.renderExpenses();
        this.showToast('تم تقييد المصروف بنجاح وتسجيله بالدفتر');

        // Reset fields
        document.getElementById('exp-amount').value = 0;
        document.getElementById('exp-desc').value = '';
        document.getElementById('expense-date').value = '';
    },

    async clearExpenses() {
        if (!confirm('هل أنت متأكد من مسح جميع المصروفات التشغيلية نهائياً؟')) return;
        
        await localforage.setItem('expenses', []);
        await manualSyncToCloud('expenses', []);
        
        this.renderExpenses();
        this.renderReports();
        this.showToast('تم تصفير جميع المصروفات التشغيلية');
    },

    async renderExpenses() {
        let exps = await localforage.getItem('expenses') || [];

        let html = `
        <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; margin-bottom:20px;">
            ${exps.length === 0 ? '<p style="color:var(--text-muted); text-align:center;">لا توجد مصروفات مقيدة في النظام</p>' : ''}
        `;

        if (exps.length > 0) {
            let totalExps = 0;
            html += `<table style="width:100%; border-collapse:collapse; text-align:right;">
                <thead>
                    <tr style="border-bottom:2px solid var(--border); color:var(--text-muted);">
                        <th style="padding:10px;">التاريخ</th>
                        <th style="padding:10px;">التصنيف</th>
                        <th style="padding:10px;">البيان</th>
                        <th style="padding:10px;">المبلغ (ر.س)</th>
                    </tr>
                </thead>
                <tbody>`;
            // Sort Descending
            exps.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(e => {
                totalExps += e.amount;
                html += `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:12px; font-weight:bold; color:#ccc;">${e.date}</td>
                    <td style="padding:12px;"><span style="background:rgba(87, 67, 177, 0.4); padding:4px 8px; border-radius:4px; font-size:12px;">${e.category}</span></td>
                    <td style="padding:12px; color:#fff;">${e.desc}</td>
                    <td style="padding:12px; font-weight:bold; color:#e91e63; direction:ltr;">- ${e.amount.toFixed(2)}</td>
                </tr>`;
            });
            html += `</tbody></table>
            <div style="margin-top:20px; text-align:left; border-top:1px solid var(--border); padding-top:15px;">
                <h3 style="color:#e91e63;">إجمالي المصروفات: <span style="direction:ltr; display:inline-block;">${totalExps.toFixed(2)} SAR</span></h3>
            </div>`;
        }

        html += `</div>`;
        document.getElementById('expenses-content').innerHTML = html;
    },

    async renderReports() {
        const invoices = await localforage.getItem('invoices') || [];
        const exps = await localforage.getItem('expenses') || [];
        let taxRecords = await localforage.getItem('tax_records') || [];

        // ZERO-STATE GUARD: If no invoices, force data to be empty
        if (invoices.length === 0) {
            taxRecords = [];
            const staleTax = await localforage.getItem('tax_records') || [];
            const staleJournals = await localforage.getItem('journal_entries') || [];
            if (staleTax.length > 0 || staleJournals.length > 0) {
                console.log('[Zero-State-Guard] Purging ghost collections because invoices is empty.');
                await localforage.setItem('tax_records', []);
                await manualSyncToCloud('tax_records', []);
                await localforage.setItem('journal_entries', []);
                await manualSyncToCloud('journal_entries', []);
            }
        } else {
            // SELF-HEALING: Filter tax_records and journal_entries that don't have a matching VALID invoice anymore
            // DATA UPLOAD (بص الرفع) FILTER: Exclude cancelled (refunded) invoices from these collections
            const validInvoiceIds = new Set(invoices.filter(i => i && i.id && !i.isCancelled).map(i => i.id.toString()));
            
            // Purge Tax Records
            const originalTaxCount = taxRecords.length;
            taxRecords = taxRecords.filter(r => r && r.ref_invoice && validInvoiceIds.has(r.ref_invoice.toString()));
            if (taxRecords.length !== originalTaxCount) {
                console.log(`[Self-Healing] Purged ${originalTaxCount - taxRecords.length} orphan tax records.`);
                await localforage.setItem('tax_records', taxRecords);
                await manualSyncToCloud('tax_records', taxRecords);
            }

            // Purge Journal Entries
            let journals = await localforage.getItem('journal_entries') || [];
            const originalJournalCount = journals.length;
            journals = journals.filter(j => j && j.ref_invoice && validInvoiceIds.has(j.ref_invoice.toString()));
            if (journals.length !== originalJournalCount) {
                console.log(`[Self-Healing] Purged ${originalJournalCount - journals.length} orphan journal entries.`);
                await localforage.setItem('journal_entries', journals);
                await manualSyncToCloud('journal_entries', journals);
            }
        }

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekAgo = todayStart - (7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime();

        let salesToday = 0, salesWeek = 0, salesMonth = 0, salesYear = 0;
        const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        const monthlyMap = {};

        // Active Dashboard Totals (Today Only + Not Reported)
        let totalAllInvoices = 0;
        let totalRefunds = 0;
        let totalOperatingExpenses = 0;
        let totalLaundryCosts = 0;
        let totalLaundryDebt = 0;

        // 1. Process Invoices
        invoices.forEach(i => {
            if (!i) return;
            const amt = parseFloat(i.total || i.grandTotal || 0);
            const rTime = new Date(i.date || i.timestamp).getTime();
            
            // Monthly Map (Full history)
            const d = new Date(i.date || i.timestamp);
            const mIdx = d.getMonth();
            const year = d.getFullYear();
            const key = `${year}-${String(mIdx + 1).padStart(2, '0')}`;
            const label = `${monthsAr[mIdx]} ${year}`;
            if (!monthlyMap[key]) monthlyMap[key] = { label, total: 0, sortKey: key };
            monthlyMap[key].total += amt;

            // ACTIVE BATCH FILTER (Today + Not Reported)
            const isToday = rTime >= todayStart;
            if (isToday && !i.isZReported) {
                totalAllInvoices += amt;
                if (i.isCancelled === true) {
                    totalRefunds += amt;
                } else {
                    const pCost = parseFloat(i.laundryCost || i.partnerLaundryCost || 0);
                    totalLaundryCosts += pCost;
                    if (!i.laundryPaid) totalLaundryDebt += pCost;
                }
            }
        });

        // 2. Process Expenses (Today + Not Reported)
        exps.forEach(e => {
            const eTime = new Date(e.date).getTime();
            if (eTime >= todayStart && !e.isZReported) {
                totalOperatingExpenses += parseFloat(e.amount) || 0;
            }
        });

        // FINAL COMPREHENSIVE FINANCIAL MATH (Redix Logic)
        let totalNetRevenue = totalAllInvoices - totalRefunds;
        // Net Profit = [Net Revenue] - [Operating Expenses] - [Total Outsourcing Costs]
        let netProfit = totalNetRevenue - (totalOperatingExpenses + totalLaundryCosts);

        let html = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px; margin-bottom:40px;">
            
            <!-- 1. Gross Sales -->
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">إجمالي المبيعات (Gross Sales)</h3>
                <div style="font-size:24px; font-weight:800; direction:ltr; color:var(--text-main);">${totalAllInvoices.toFixed(2)} ر.س</div>
            </div>

            <!-- 2. Refunds -->
            <div style="background:var(--bg-surface); border:1px solid rgba(255, 69, 58, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">إجمالي المرتجعات (Refunds)</h3>
                <div style="font-size:24px; font-weight:800; direction:ltr; color:#ff453a;">- ${totalRefunds.toFixed(2)} ر.س</div>
            </div>

            <!-- 3. Net Revenue -->
            <div style="background:var(--bg-surface); border:1px solid rgba(76, 175, 80, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">صافي الإيرادات (Net Revenue)</h3>
                <div style="font-size:24px; font-weight:800; direction:ltr; color:#4CAF50;">${totalNetRevenue.toFixed(2)} ر.س</div>
            </div>

            <!-- 4. Operating Expenses -->
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">المصاريف التشغيلية (Expenses)</h3>
                <div style="font-size:24px; font-weight:800; direction:ltr; color:var(--text-main);">- ${totalOperatingExpenses.toFixed(2)} ر.س</div>
            </div>

            <!-- 5. Partner Laundry Debt -->
            <div style="background:var(--bg-surface); border:1px solid rgba(253, 184, 19, 0.2); border-radius:var(--radius-md); padding:20px; text-align:center; box-shadow:var(--shadow-sm);">
                <h3 style="color:var(--text-muted); font-size:13px; margin-bottom:5px;">حسابات المغاسل (Debt)</h3>
                <div style="font-size:24px; font-weight:800; direction:ltr; color:var(--primary);">${totalLaundryDebt.toFixed(2)} ر.س</div>
            </div>

            <!-- 6. FINAL NET PROFIT OVERLAY -->
            <div style="grid-column: 1 / -1; background:var(--bg-elevated); border:2px solid var(--primary); border-radius:var(--radius-md); padding:25px; text-align:center; box-shadow:var(--shadow-lg);">
                <h3 style="color:var(--text-muted); font-size:15px; margin-bottom:10px;">صافي الربح النهائي (Net Profit)</h3>
                <div style="font-size:42px; font-weight:900; color:${netProfit >= 0 ? 'var(--primary)' : '#ff453a'}; direction:ltr; text-shadow:0 0 20px rgba(253,184,19,0.1);">
                    ${netProfit.toFixed(2)} <span style="font-size:20px;"> ر.س</span>
                </div>
                <p style="margin-top:10px; font-size:12px; color:var(--text-muted); opacity:0.8;">[صافي الإيراد] - [المصاريف التشغيلية] - [إجمالي تكاليف الشركاء]</p>
            </div>
        </div>

        <!-- End of Day Closure Button -->
        <div style="text-align: center; margin-bottom: 40px; background: rgba(87, 67, 177, 0.05); padding: 30px; border-radius: var(--radius-md); border: 2px dashed var(--primary);">
            <h3 style="color: var(--text-main); margin-bottom: 10px;">إغلاق اليومية (Close Accounting Day)</h3>
            <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">سيتم إصدار تقرير Z-Report وأرشفة العمليات الحالية لبدء يوم جديد.</p>
            <button class="btn btn-primary" onclick="appLogic.closeDay()" style="padding: 16px 50px; font-size: 18px; font-weight: 900; background: var(--primary); color: #000; box-shadow: 0 4px 15px rgba(253, 184, 19, 0.3);">
                <i class="fa-solid fa-lock" style="margin-left: 10px;"></i> إغلاق اليومية وإصدار التقرير
            </button>
        </div>

        <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; margin-bottom: 30px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:15px; margin-bottom:20px;">
                <div>
                    <h3 style="margin-bottom:5px; color:var(--text-main); font-size: 18px;"><i class="fa-solid fa-calendar-days" style="color:var(--primary); margin-left:8px;"></i> مبيعات الأشهر (Monthly Sales Breakdown)</h3>
                    <p style="color:var(--text-muted); font-size:13px;">تفصيل المبيعات الإيرادية مجمعة حسب الشهر والميلادي.</p>
                </div>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width:100%; border-collapse:collapse; text-align:right;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--border); color:var(--text-muted); font-size: 14px;">
                            <th style="padding:12px;">الشهر / السنة (Period)</th>
                            <th style="padding:12px;">إجمالي المبيعات (Total Revenue)</th>
                            <th style="padding:12px; text-align:center;">الحالة (Status)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        const sortedMonths = Object.values(monthlyMap).sort((a, b) => b.sortKey.localeCompare(a.sortKey));

        if (sortedMonths.length === 0) {
            html += `<tr><td colspan="3" style="padding:20px; text-align:center; color:var(--text-muted);">لا توجد مبيعات مسجلة حتى الآن</td></tr>`;
        } else {
            sortedMonths.forEach(m => {
                html += `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:14px; font-weight:700; color:#fff;">${m.label}</td>
                    <td style="padding:14px; font-weight:900; color:var(--primary); direction:ltr;">${m.total.toFixed(2)} SAR</td>
                    <td style="padding:14px; text-align:center;">
                        <span style="background:rgba(76, 175, 80, 0.15); color:#4CAF50; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:bold;">محقق</span>
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
                    <h3 style="margin-bottom:5px; color:var(--text-main); font-size: 18px;"><i class="fa-solid fa-chart-bar" style="color:var(--primary); margin-left:8px;"></i> ملخص المبيعات (Sales Analytics)</h3>
                    <p style="color:var(--text-muted); font-size:13px;">مقارنة سريعة لأداء المبيعات خلال فترات زمنية للنشاط.</p>
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                <div style="background:linear-gradient(135deg, rgba(253,184,19,0.1), rgba(253,184,19,0.02)); border:1px solid rgba(253,184,19,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">مبيعات اليوم</div>
                    <div style="font-size:24px; font-weight:800; color:var(--primary); direction:ltr;">${salesToday.toFixed(2)} SAR</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(76,175,80,0.1), rgba(76,175,80,0.02)); border:1px solid rgba(76,175,80,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">آخر 7 أيام</div>
                    <div style="font-size:24px; font-weight:800; color:#4CAF50; direction:ltr;">${salesWeek.toFixed(2)} SAR</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(33,150,243,0.1), rgba(33,150,243,0.02)); border:1px solid rgba(33,150,243,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">آخر 30 يوم</div>
                    <div style="font-size:24px; font-weight:800; color:#2196F3; direction:ltr;">${salesMonth.toFixed(2)} SAR</div>
                </div>
                <div style="background:linear-gradient(135deg, rgba(156,39,176,0.1), rgba(156,39,176,0.02)); border:1px solid rgba(156,39,176,0.2); border-radius:12px; padding:20px; text-align:center;">
                    <div style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">آخر 365 يوم</div>
                    <div style="font-size:24px; font-weight:800; color:#9c27b0; direction:ltr;">${salesYear.toFixed(2)} SAR</div>
                </div>
            </div>
        </div>
        `;
        document.getElementById('reports-content').innerHTML = html;
        this.renderLaundryAccounts();
    },

    async renderLaundryAccounts() {
        try {
            const invoices = await localforage.getItem('invoices') || [];
            const laundryMap = {};

            invoices.forEach(i => {
                if (!i || !i.partnerLaundryName || i.partnerLaundryName.trim() === '') return;
                const name = i.partnerLaundryName.trim();
                const hood = (i.partnerLaundryNeighborhood || '').trim();
                const compKey = `${name}|${hood}`;
                const cost = parseFloat(i.laundryCost || i.partnerLaundryCost || 0);
                if (cost <= 0) return;

                if (!laundryMap[compKey]) {
                    laundryMap[compKey] = { name, hood, dues: 0, paid: 0 };
                }

                if (i.laundryPaid) {
                    laundryMap[compKey].paid += cost;
                } else {
                    laundryMap[compKey].dues += cost;
                }
            });

            const container = document.getElementById('laundry-accounts-content');
            if (!container) return; // Silent if not on reports page

            const keys = Object.keys(laundryMap).sort();
            if (keys.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">لا توجد حسابات مسجلة للمغاسل الشريكة</p>';
                return;
            }

            let html = `
            <div style="overflow-x: auto;">
                <table style="width:100%; border-collapse:collapse; background:var(--bg-body); border-radius:8px; overflow:hidden;">
                    <thead>
                        <tr style="background:#111; color:var(--primary); font-size:13px;">
                            <th style="padding:12px; text-align:right;">المغسلة (الحي)</th>
                            <th style="padding:12px; text-align:right;">المستحقات (ذمة)</th>
                            <th style="padding:12px; text-align:right;">المدفوعات السابقة</th>
                            <th style="padding:12px; text-align:center;">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            keys.forEach(key => {
                const data = laundryMap[key];
                const displayName = data.hood ? `${data.name} <small style="color:#888;">(${data.hood})</small>` : data.name;
                const safeKey = key.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                html += `
                <tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:15px; font-weight:bold;">${displayName}</td>
                    <td style="padding:15px; font-weight:bold; color:${data.dues > 0 ? '#f44336' : '#fff'}; direction:ltr; text-align:right;">${data.dues.toFixed(2)} SAR</td>
                    <td style="padding:15px; font-weight:bold; color:#4CAF50; direction:ltr; text-align:right;">${data.paid.toFixed(2)} SAR</td>
                    <td style="padding:15px; text-align:center;">
                        ${data.dues > 0 ? `<button class="btn" style="background:var(--primary); color:#000; padding:6px 12px; font-weight:bold; border:none; border-radius:4px; font-size:12px; cursor:pointer;" onclick="appLogic.settleAllLaundryDues('${safeKey}')"><i class="fa-solid fa-money-check-dollar"></i> تسديد المستحقات</button>` : '<span style="color:#aaa; font-size:12px;">مُسددة بالكامل</span>'}
                    </td>
                </tr>
                `;
            });

            html += `</tbody></table></div>`;
            container.innerHTML = html;

        } catch (err) {
            console.error('Error rendering laundry accounts:', err);
        }
    },

    async settleAllLaundryDues(compKey) {
        let [targetName, targetHood = ''] = compKey.split('|');
        let displayName = targetHood ? `${targetName} (${targetHood})` : targetName;
        
        if (!confirm(`هل أنت متأكد من تسديد جميع المستحقات للمغسلة '${displayName}'?\n(سيتم تحويل حالة جميع الفواتير لهذه المغسلة إلى 'مدفوعة نقداً')`)) return;

        try {
            let invs = await localforage.getItem('invoices') || [];
            let updated = false;

            invs.forEach(i => {
                let pName = i.partnerLaundryName ? i.partnerLaundryName.trim() : '';
                let pHood = i.partnerLaundryNeighborhood ? i.partnerLaundryNeighborhood.trim() : '';
                
                if (pName === targetName && pHood === targetHood && !i.laundryPaid && parseFloat(i.laundryCost || i.partnerLaundryCost || 0) > 0) {
                    i.laundryPaid = true;
                    updated = true;
                }
            });

            if (updated) {
                await localforage.setItem('invoices', invs);
                await manualSyncToCloud('invoices', invs);
                this.renderLaundryAccounts();
                this.renderHistory();
                this.showToast(`تم تسديد جميع مستحقات المغسلة '${displayName}'`);
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
                    const date = s.timestamp ? new Date(s.timestamp).toLocaleDateString('ar-SA') : '-';
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
                            <td style="padding:14px; font-weight:900; color:var(--primary); font-size:18px; letter-spacing:2px;">${pin}</td>
                            <td style="padding:14px; text-align:center;">
                                <button class="btn" style="background:${s.status !== 'expired' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'}; 
                                                          color:${s.status !== 'expired' ? '#ef4444' : '#22c55e'}; 
                                                          padding:5px 10px; border:1px solid ${s.status !== 'expired' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}; 
                                                          border-radius:4px; font-size:11px; cursor:pointer;" 
                                        onclick="appLogic.toggleStoreStatus('${pin}', '${s.status || 'active'}')">
                                    <i class="fa-solid ${s.status !== 'expired' ? 'fa-ban' : 'fa-check-circle'}"></i> 
                                    ${s.status !== 'expired' ? 'تعطيل' : 'تفعيل'}
                                </button>
                                <button class="btn" style="background:rgba(239,68,68,0.1); color:#ef4444; padding:5px 10px; border:1px solid rgba(239,68,68,0.2); border-radius:4px; font-size:11px; cursor:pointer; margin-right:5px;" onclick="appLogic.deleteStore('${pin}')">
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
                name, phone, taxNumber: tax, 
                timestamp: Date.now(), 
                status: 'active' 
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
            errEl.textContent = "يجب أن يتكون الرمز من 6 أرقام.";
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
                localStorage.setItem('radix_master_authorized', 'true');
                window.location.href = 'radix-master.html';
                return;
            }

            const email = `${pin}@sahab.pos`;

            // 2. Identity Resolution: PIN -> UID
            const pinSnap = await firebase.database().ref(`pincodes/${pin}`).once('value');
            let targetUID = pinSnap.val();
            
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
            }

            // 3. Authenticate to POS
            try {
                localStorage.removeItem('redix_auth_blocked');
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
                if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/wrong-password') {
                     console.log(`[Smart-Gate] Auto-provisioning Auth account for PIN ${pin}...`);
                     await firebase.auth().createUserWithEmailAndPassword(email, pin);
                     const user = firebase.auth().currentUser;
                     if (user) {
                         const syncUpdates = {};
                         // Ensure we bridge the registry to this new permanent UID
                         syncUpdates[`pincodes/${pin}`] = user.uid;
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
            let errMsg = 'الرمز خاطئ، يرجى التأكد من الرمز والمحاولة مرة أخرى.';
            if (err.message === 'account-deactivated')  errMsg = 'عذراً، هذا الحساب معطل من قبل الإدارة.';
            
            errEl.textContent = errMsg;
            errEl.classList.remove('hidden');
            btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> دخول';
            btn.disabled = false;
        }
    },

    async logoutUser() {
        this.closeSettingsModal();
        await firebase.auth().signOut();
        window.currentUID = null;
        window.isDataInitialized = false;
        location.reload();
    },

    openSettingsModal() {
        const s = window.tenantSettings;
        document.getElementById('setting-name').value  = s.name  || '';
        document.getElementById('setting-phone').value = s.phone || '';
        document.getElementById('setting-tax').value   = s.taxNumber || '';
        document.getElementById('settings-modal').classList.remove('hidden');
    },

    closeSettingsModal() {
        document.getElementById('settings-modal').classList.add('hidden');
    },

    async saveTenantSettings() {
        const name  = document.getElementById('setting-name').value.trim()  || 'Redix';
        const phone = document.getElementById('setting-phone').value.trim();
        const tax   = document.getElementById('setting-tax').value.trim();

        window.tenantSettings = { name, phone, taxNumber: tax };

        // window.tenantSettings = { name, phone, taxNumber: tax }; // Already set above
        // REMOVED local storage persistence for security

        // Persist to Firebase under user node
        if (window.currentUID && typeof firebase !== 'undefined') {
            try {
                await firebase.database().ref(`users/${window.currentUID}/settings`).set(window.tenantSettings);
            } catch (e) {
                console.warn('[Settings] Firebase save failed, using local only:', e);
            }
        }

        this.applyBranding();
        this.closeSettingsModal();
        this.showToast('تم حفظ إعدادات المغسلة بنجاح ✓');
    },

    async loadTenantSettings(uid) {
        let settings = null;
        const user = firebase.auth().currentUser;

        // Special Case: Super Admin
        if (user && user.email === `${ADMIN_PIN}@sahab.pos`) {
            window.tenantSettings = { name: 'الإدارة العامة (Redix Admin)', phone: '', taxNumber: '' };
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

        window.tenantSettings = settings || { name: 'المغسلة', phone: '', taxNumber: '' };
        this.applyBranding();
    },

    applyBranding() {
        const name = window.tenantSettings?.name || 'Redix';
        const h1 = document.getElementById('header-brand-name');
        if (h1) h1.textContent = name;
        // LOGIN HEADING IS NOW STATIC: "تسجيل دخول نظام Redix"
        // const loginH2 = document.getElementById('login-brand-name');
        // if (loginH2) loginH2.textContent = name;
        document.title = `Redix POS | ${name}`;
    },

    async closeDay() {
        if (!confirm('هل أنت متأكد من إغلاق اليومية وإصدار التقرير؟')) return;

        // 1. Calculate current active totals
        const invoices = await localforage.getItem('invoices') || [];
        const exps = await localforage.getItem('expenses') || [];
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        let gross = 0, refunds = 0, lCosts = 0, netProfit = 0, opExps = 0;
        
        invoices.forEach(i => {
            const rTime = new Date(i.date || i.timestamp).getTime();
            if (rTime >= todayStart && !i.isZReported) {
                const amt = parseFloat(i.total || i.grandTotal || 0);
                gross += amt;
                if (i.isCancelled) {
                    refunds += amt;
                } else {
                    lCosts += parseFloat(i.laundryCost || i.partnerLaundryCost || 0);
                }
            }
        });

        exps.forEach(e => {
            const eTime = new Date(e.date).getTime();
            if (eTime >= todayStart && !e.isZReported) {
                opExps += parseFloat(e.amount) || 0;
            }
        });

        const netRev = gross - refunds;
        netProfit = netRev - (opExps + lCosts);

        // 2. Generate PDF Report
        const reportDate = new Date().toLocaleDateString('ar-SA');
        const bizName = window.tenantSettings?.name || 'Redix';

        const reportContent = `
            <div style="padding:50px; font-family:'Tajawal', sans-serif; direction:rtl; color:#333; background:#fff; min-height:280mm;">
                <!-- Header Section -->
                <div style="text-align:center; padding-bottom:30px; margin-bottom:40px; border-bottom:3px solid #333;">
                    <h1 style="margin:0; font-size:32px; color:#000;">تقرير إغلاق اليومية</h1>
                    <div style="font-size:22px; margin-top:15px; font-weight:bold; color:#555;">${bizName}</div>
                    <div style="font-size:16px; color:#888; margin-top:8px;">بتاريخ: ${reportDate}</div>
                </div>

                <!-- Financial Table -->
                <div style="border:1px solid #ddd; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                    <table style="width:100%; border-collapse:collapse; font-size:16px;">
                        <tr style="background:#fcfcfc; border-bottom:1px solid #eee;">
                            <td style="padding:18px 25px; color:#666; font-weight:bold; text-align:right;">إجمالي المبيعات</td>
                            <td style="padding:18px 25px; font-weight:900; text-align:left; direction:ltr; color:#000;">${gross.toFixed(2)} ر.س</td>
                        </tr>
                        <tr style="background:#f4f4f4; border-bottom:1px solid #eee;">
                            <td style="padding:18px 25px; color:#666; font-weight:bold; text-align:right;">إجمالي المرتجعات</td>
                            <td style="padding:18px 25px; font-weight:900; text-align:left; color:#ff453a; direction:ltr;">- ${refunds.toFixed(2)} ر.س</td>
                        </tr>
                        <tr style="background:#fcfcfc; border-bottom:1px solid #eee;">
                            <td style="padding:18px 25px; color:#666; font-weight:bold; text-align:right;">صافي الإيرادات</td>
                            <td style="padding:18px 25px; font-weight:900; text-align:left; color:#2e7d32; direction:ltr;">${netRev.toFixed(2)} ر.س</td>
                        </tr>
                        <tr style="background:#f4f4f4; border-bottom:1px solid #eee;">
                            <td style="padding:18px 25px; color:#666; font-weight:bold; text-align:right;">المصاريف التشغيلية</td>
                            <td style="padding:18px 25px; font-weight:900; text-align:left; color:#ff453a; direction:ltr;">- ${opExps.toFixed(2)} ر.س</td>
                        </tr>
                        <tr style="background:#fcfcfc; border-bottom:1px solid #eee;">
                            <td style="padding:18px 25px; color:#666; font-weight:bold; text-align:right;">حسابات المغاسل</td>
                            <td style="padding:18px 25px; font-weight:900; text-align:left; color:#ff453a; direction:ltr;">- ${lCosts.toFixed(2)} ر.س</td>
                        </tr>
                        <tr style="background:#e8f5e9; border-top:2px solid #333;">
                            <td style="padding:25px; font-size:22px; font-weight:900; color:#1b5e20; text-align:right;">صافي الربح النهائي</td>
                            <td style="padding:25px; font-size:28px; font-weight:900; text-align:left; color:#1b5e20; direction:ltr;">${netProfit.toFixed(2)} ر.س</td>
                        </tr>
                    </table>
                </div>

                <!-- Footer -->
                <div style="text-align:center; color:#aaa; font-size:13px; margin-top:80px; font-style:italic;">
                    تم توليد هذا التقرير المحاسبي بواسطة نظام Redix POS
                </div>
            </div>
        `;

        const element = document.createElement('div');
        element.innerHTML = reportContent;
        await html2pdf().from(element).save(`Z-Report_${reportDate.replace(/\//g, '-')}.pdf`);

        // 3. Archive Data
        const archiveEntry = {
            id: 'Z-' + Date.now(),
            timestamp: Date.now(),
            date: reportDate,
            totals: { gross, refunds, netRev, opExps, lCosts, netProfit }
        };
        let archived = await localforage.getItem('archived_z_reports') || [];
        archived.push(archiveEntry);
        await localforage.setItem('archived_z_reports', archived);
        await manualSyncToCloud('archived_z_reports', archived);

        // 4. Zero Reset (Mark transactions as reported)
        invoices.forEach(i => {
            const rTime = new Date(i.date || i.timestamp).getTime();
            if (rTime >= todayStart && !i.isZReported) {
                i.isZReported = true;
            }
        });
        exps.forEach(e => {
            const eTime = new Date(e.date).getTime();
            if (eTime >= todayStart && !e.isZReported) {
                e.isZReported = true;
            }
        });

        await localforage.setItem('invoices', invoices);
        await localforage.setItem('expenses', exps);
        await manualSyncToCloud('invoices', invoices);
        await manualSyncToCloud('expenses', exps);

        // 5. Refresh
        this.renderReports();
        alert('تم إغلاق اليومية بنجاح وإصدار التقرير وأرشفة البيانات.');
    }
};

// =====================================================
// FIREBASE AUTH STATE OBSERVER — controls app startup
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const appEl = document.getElementById('app');

    // Show login, hide app by default
    if (loginOverlay) loginOverlay.classList.remove('hidden');
    if (appEl) appEl.style.display = 'none';

    if (typeof firebase === 'undefined') {
        // No Firebase — run in local mode directly
        if (loginOverlay) loginOverlay.classList.add('hidden');
        if (appEl) appEl.style.display = '';
        appLogic.init();
        return;
    }

    // STRICT AUTH: No session persistence. Login required on every reload.
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    firebase.auth().onAuthStateChanged(async (user) => {
        const adminBtn = document.getElementById('admin-nav-btn');
        if (user) {
            // ✅ LOGGED IN
            window.currentUID = user.uid;
            if (loginOverlay) loginOverlay.classList.add('hidden');
            if (appEl) appEl.style.display = '';

            // SaaS Logic: Show Admin Panel only for Super Admin UID/Email
            if (user.email === `${ADMIN_PIN}@sahab.pos`) {
                if (adminBtn) adminBtn.classList.remove('hidden');
                console.log('[Admin] Super Admin Identity Confirmed.');
            } else {
                if (adminBtn) adminBtn.classList.add('hidden');
            }

            // Load tenant settings & apply branding BEFORE init
            await appLogic.loadTenantSettings(user.uid);

            // Now boot the app
            await appLogic.init();
        } else {
            // ❌ NOT LOGGED IN — show login screen
            window.currentUID = null;
            if (adminBtn) adminBtn.classList.add('hidden');
            if (loginOverlay) loginOverlay.classList.remove('hidden');
            if (appEl) appEl.style.display = 'none';
            const pinInput = document.getElementById('pin-input');
            if (pinInput) pinInput.focus();
        }
    });
});
