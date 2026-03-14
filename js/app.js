// Single monolithic file containing data, logic, and UI (World-class structure)

// Source of truth built explicitly from user CSV rules and images.
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


// ZATCA Phase 2 TLV & Base64 Encoder
const zatcaEncoder = {
    toHex: function (str) {
        return Array.from(new TextEncoder().encode(str)).map(b => b.toString(16).padStart(2, '0')).join('');
    },
    generateTLV: function (tag, value) {
        let valHex = this.toHex(value);
        let tagHex = tag.toString(16).padStart(2, '0');
        let lenHex = (valHex.length / 2).toString(16).padStart(2, '0');
        return tagHex + lenHex + valHex;
    },
    generateZATCA_QR: function (sellerName, vatNumber, timestamp, total, vatTotal) {
        let isoTime = new Date(timestamp).toISOString();
        let hexStr = this.generateTLV(1, sellerName) +
            this.generateTLV(2, vatNumber) +
            this.generateTLV(3, isoTime) +
            this.generateTLV(4, total.toString()) +
            this.generateTLV(5, vatTotal.toString());

        let bytes = new Uint8Array(hexStr.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        let binaryStr = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
        return btoa(binaryStr);
    }
};

// Wafeq-inspired Double-Entry Journal Engine
const accountingEngine = {
    async postTransaction(invoice) {
        const total = invoice.grandTotal;
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

        let inventory = await localforage.getItem('inventory') || [];
        // Future-proof: Logic to deduct raw materials if required
        await localforage.setItem('inventory', inventory);

        return invoice;
    }
};

// --- FIREBASE CROSS-DEVICE SYNCHRONIZATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBTE1YodqeIKjG-RBCe8pHbnRM7EQNSemU",
    authDomain: "sahab-3089b.firebaseapp.com",
    databaseURL: "https://sahab-3089b-default-rtdb.firebaseio.com/",
    projectId: "sahab-3089b",
    storageBucket: "sahab-3089b.firebasestorage.app",
    messagingSenderId: "236842364975",
    appId: "1:236842364975:web:1ECD34c708e7a9096596da"
};

// Initialize Firebase only if not already initialized
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (err) {
        console.error("Firebase init error:", err);
    }
}

const collectionsToSync = ['customers', 'invoices', 'journal_entries', 'tax_records', 'inventory', 'services', 'expenses'];
const originalSetItem = localforage.setItem;

// Override localforage to seamlessly sync ALL saves to Firebase
localforage.setItem = async function (key, value) {
    const result = await originalSetItem.call(localforage, key, value);
    if (collectionsToSync.includes(key) && !window.__syncingFromFirebase) {
        if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY" && !!firebaseConfig.apiKey) {
            try {
                // Sanitize undefined fields which completely crash Firebase Realtime Sync
                const safePayload = JSON.parse(JSON.stringify(value));
                firebase.database().ref(key).set(safePayload);
            } catch (err) {
                console.error("Firebase sync payload error:", err);
            }
        }
    }
    return result;
};

// Listen to Firebase Realtime Database for updates from other devices
function initFirebaseSync() {
    if (typeof firebase === 'undefined' || firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn("Firebase config is placeholder. Realtime Sync is currently disabled.");
        return;
    }
    
    console.log("Firebase initialized! Linking two-way Realtime Sync...");

    collectionsToSync.forEach(key => {
        const dbRef = firebase.database().ref(key);
        dbRef.on('value', async (snapshot) => {
            let cloudData = snapshot.val();
            
            if (cloudData !== null) {
                // Firebase might convert sparse arrays into objects; convert them back
                if (typeof cloudData === 'object' && !Array.isArray(cloudData)) {
                    cloudData = Object.values(cloudData);
                }
                
                // Strip out any null or ghost entries securely
                if (Array.isArray(cloudData)) {
                    cloudData = cloudData.filter(item => item !== null && item !== undefined && typeof item === 'object' && Object.keys(item).length > 0);
                }

                // 1. Data exists in Cloud -> Sync to local storage securely
                window.__syncingFromFirebase = true; // Prevent bounce back to cloud
                await originalSetItem.call(localforage, key, cloudData);
                window.__syncingFromFirebase = false;
                
                // 2. Refresh active UI
                if (window.appLogic) {
                    if (key === 'services') {
                        window.appLogic.services = cloudData;
                        window.appLogic.filterItems(); 
                    }
                    
                    const currentView = document.querySelector('.view-section.active');
                    if (currentView) {
                        const viewId = currentView.id.replace('view-', '');
                        // Preserve search state by calling filter functions instead of render directly
                        if (viewId === 'history' && key === 'invoices') window.appLogic.filterHistory();
                        else if (viewId === 'customers' && key === 'customers') window.appLogic.filterCustomers();
                        else if (viewId === 'inventory' && (key === 'inventory' || key === 'services')) window.appLogic.renderInventory();
                        else if (viewId === 'expenses' && key === 'expenses') window.appLogic.renderExpenses();
                        else if (viewId === 'reports') window.appLogic.renderReports();
                    }
                }
            } else {
                // 3. Data is NULL in Cloud -> Seed Cloud from Local Storage (First time setup)
                const localData = await localforage.getItem(key);
                if (localData && Array.isArray(localData) && localData.length > 0) {
                    console.log(`[Sync] Seeding empty cloud collection: ${key}`);
                    dbRef.set(localData).catch(e => console.error("Firebase seed error:", e));
                }
            }
        });
    });
}
// ---------------------------------------------

// Version: 1.0.3 (Firebase Sync Enabled)
window.appLogic = {
    _version: '1.0.3',
    cart: [],
    deliveryFee: 0,
    customer: { phone: '', name: '' },
    modalState: { item: null, type: 'iron', speed: 'normal', qty: 1, price: 0 },
    currentCategory: 'all',
    editingInvoiceId: null,
    services: [],
    async init() {
        // Init localforage DB
        localforage.config({ name: 'SahabPOS', storeName: 'pos_data' });

        // Ensure collections exist
        if (!(await localforage.getItem('customers'))) await localforage.setItem('customers', []);
        if (!(await localforage.getItem('invoices'))) await localforage.setItem('invoices', []);

        // Wafeq Acc DBs
        if (!(await localforage.getItem('journal_entries'))) await localforage.setItem('journal_entries', []);
        if (!(await localforage.getItem('tax_records'))) await localforage.setItem('tax_records', []);
        if (!(await localforage.getItem('inventory'))) await localforage.setItem('inventory', []);

        // Dynamic Services (Initialize only if empty to preserve Firebase synced custom pricing)
        if (!(await localforage.getItem('services'))) {
            await localforage.setItem('services', DefaultServices);
        }
        this.services = await localforage.getItem('services');

        // Start listening to Firebase Realtime Database
        initFirebaseSync();

        this.renderItems();
        this.updateCartUI();
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

        } catch (err) {
            console.error('Routing Error:', err);
        }
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

        let cName = this.customer.name || 'عميل نقدي';
        let cPhone = this.customer.phone || '0000000000';

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

        let invoiceData = {
            id: newInvId, timestamp: Date.now(), customer: { phone: cPhone, name: cName },
            items: [...this.cart], deliveryFee: this.deliveryFee, grandTotal: grT,
            status: 'completed',
            paymentMethod: 'cash'
        };

        // No VAT Logic (Tax free invoice as requested)
        invoiceData.subtotalNet = invoiceData.grandTotal;
        invoiceData.vatAmount = 0;

        this.pendingInvoice = invoiceData;

        // Render Thermal HTML into Preview Container
        document.getElementById('invoice-preview-container').innerHTML = this.generateThermalHTML(invoiceData, 'preview-qr-render');

        // Render QR in Preview (ZATCA Base64 TLV Format)
        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR("غسلة سحاب", "000000000000000", invoiceData.timestamp, invoiceData.grandTotal, invoiceData.vatAmount);

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
            let cData = { phone: this.customer.phone, name: this.customer.name || 'عميل نقدي', date: Date.now() };
            if (cIdx >= 0) customers[cIdx] = cData; else customers.push(cData);
            await localforage.setItem('customers', customers);
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

        this.currentInvoice = this.pendingInvoice;
        this.pendingInvoice = null;

        // Switch Modal State
        document.getElementById('success-invoice-ref').innerText = this.currentInvoice.id;
        document.getElementById('modal-actions-preview').classList.add('hidden');
        document.getElementById('modal-actions-success').classList.remove('hidden');

        // Reset POS background
        this.cart = [];
        this.customer = { phone: '', name: '' };
        document.getElementById('customer-phone').value = '';
        document.getElementById('customer-name').value = '';
        this.updateCartUI();

        // Auto Download PDF
        await this.downloadDigitalPDF(null);
    },
    closeInvoicePreview() {
        document.getElementById('invoice-preview-modal').classList.add('hidden');
        this.currentInvoice = null;
        this.pendingInvoice = null;
    },

    printThermalReceipt() {
        if (!this.currentInvoice) return;
        this.printInvoice(this.currentInvoice);
    },

    async downloadDigitalPDF(event) {
        console.log('Button Clicked: downloadDigitalPDF - Generating ERP Invoice');
        if (!this.currentInvoice) return;

        const data = this.currentInvoice;
        const dStr = new Date(data.timestamp).toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const subtotal = data.items.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
        const vatRate = 0; // Tax Removed
        const vatAmount = 0;
        const grandTotal = subtotal;

        // Professional Items Table
        let itemsHtml = '';
        data.items.forEach((item, i) => {
            let tLbl = item.type === 'iron' ? 'كوي' : (item.type === 'wash_iron' ? 'غسيل وكوي' : 'غسيل فقط');
            let sLbl = item.speed === 'normal' ? 'عادي' : 'سريع';
            let lineTotal = (item.unitPrice * item.qty).toFixed(2);

            itemsHtml += `
            <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="padding: 12px; text-align: center; border-right: 1px solid #edf2f7; font-weight: bold;">${lineTotal}</td>
                <td style="padding: 12px; text-align: center; border-right: 1px solid #edf2f7;">${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 12px; text-align: center; border-right: 1px solid #edf2f7;">${item.qty}</td>
                <td style="padding: 12px; text-align: right; line-height: 1.5;">
                    <strong style="display: block; color: #1a202c;">${item.name}</strong>
                    <span style="font-size: 11px; color: #718096;">${tLbl} - ${sLbl}</span>
                </td>
                <td style="padding: 12px; text-align: center; border-left: 1px solid #edf2f7; color: #a0aec0;">${i + 1}</td>
            </tr>`;
        });

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '210mm'; // Fixed A4 width
        container.style.background = '#fff';

        container.innerHTML = `
        <div class="formal-invoice-wrapper" style="width: 210mm; margin: 0 auto; padding: 40px; box-sizing: border-box; font-family: 'Tajawal', sans-serif; direction: rtl; color: #2d3748; line-height: 1.6; background: #fff;">
            
            <!-- ERP Header Section -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; box-sizing: border-box;">
                <div style="text-align: right;">
                    <h2 style="margin: 0; color: #1a202c; font-size: 28px; font-weight: 800;">غسلة سحاب</h2>
                    <p style="margin: 4px 0; color: #718096; font-size: 14px;">Sahab Laundry</p>
                </div>
                <div style="text-align: center; flex: 1; display:flex; justify-content:center; align-items:center;">
                    <!-- Robust Title Box -->
                    <div style="width: 220px; height: 110px; border: 5px solid #1a202c; background: #ffffff; border-radius: 4px; display: block; overflow: hidden; box-sizing: border-box;">
                        <div style="font-size: 38px; font-weight: 900; color: #1a202c !important; text-align: center; line-height: 70px; margin: 0; padding: 0;">فاتورة</div>
                        <div style="font-size: 18px; font-weight: 700; color: #718096 !important; text-align: center; line-height: 1; margin: 0; padding: 0; text-transform: uppercase; letter-spacing: 2px;">INVOICE</div>
                    </div>
                </div>
                <div style="text-align: left; width: 150px; box-sizing: border-box;">
                    <!-- Placeholder for potential logo -->
                </div>
            </div>

            <!-- Invoice Info Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f7fafc; padding: 20px; border-radius: 8px; box-sizing: border-box;">
                <div>
                    <div style="display: flex; margin-bottom: 8px; box-sizing: border-box;">
                        <span style="width: 100px; color: #718096; font-size: 13px;">رقم الفاتورة:</span>
                        <strong style="color: #1a202c;">#${data.id}</strong>
                    </div>
                    <div style="display: flex; margin-bottom: 8px; box-sizing: border-box;">
                        <span style="width: 100px; color: #718096; font-size: 13px;">التاريخ:</span>
                        <strong style="color: #1a202c;">${dStr}</strong>
                    </div>
                </div>
                <div>
                    <div style="display: flex; margin-bottom: 8px; box-sizing: border-box;">
                        <span style="width: 100px; color: #718096; font-size: 13px;">العميل:</span>
                        <strong style="color: #1a202c;">${data.customer.name || 'عميل نقدي'}</strong>
                    </div>
                    <div style="display: flex; box-sizing: border-box;">
                        <span style="width: 100px; color: #718096; font-size: 13px;">رقم الجوال:</span>
                        <strong style="color: #1a202c;">${data.customer.phone || 'N/A'}</strong>
                    </div>
                </div>
            </div>

            <!-- Professional Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #edf2f7; box-sizing: border-box;">
                <thead>
                    <tr style="background: #2d3748; color: #fff;">
                        <th style="padding: 12px; text-align: center; width: 15%; border: 1px solid #334155;">الإجمالي Total</th>
                        <th style="padding: 12px; text-align: center; width: 15%; border: 1px solid #334155;">السعر Price</th>
                        <th style="padding: 12px; text-align: center; width: 10%; border: 1px solid #334155;">الكمية Qty</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #334155;">الصنف Item</th>
                        <th style="padding: 12px; text-align: center; width: 5%; border: 1px solid #334155;">#</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <!-- Summary Section -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; box-sizing: border-box;">
                <!-- QR Code & ZATCA Note -->
                <div style="text-align: center; width: 250px; box-sizing: border-box;">
                    <div id="pdf-qr-container" style="margin-bottom: 10px; display: inline-block;"></div>
                    <p style="font-size: 10px; color: #718096; line-height: 1.4;">
                        هذا الرمز مشفر حسب متطلبات<br>
                        هيئة الزكاة والضريبة والجمارك<br>
                        ZATCA Compliant QR Code
                    </p>
                </div>

                <!-- Totals Table -->
                <div style="width: 300px; box-sizing: border-box;">
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 5px; background: #f7fafc; padding: 12px; border-radius: 4px; box-sizing: border-box;">
                        <span style="font-weight: 800; color: #1a202c;">الإجمالي النهائي (Total):</span>
                        <span style="font-weight: 900; color: #1a202c; font-size: 18px;">${grandTotal.toFixed(2)} SAR</span>
                    </div>
                </div>
            </div>

            <!-- Footer Note -->
            <div style="margin-top: 60px; border-top: 1px solid #edf2f7; padding-top: 20px; text-align: center; box-sizing: border-box;">
                <p style="font-size: 12px; color: #a0aec0; margin: 0;">شكراً لتعاملكم مع غسلة سحاب - نسعد بخدمتكم دائماً</p>
                <div style="font-size: 10px; color: #cbd5e0; margin: 4px 0; display: flex; justify-content: center; gap: 5px; align-items: center;">
                    <span>المملكة العربية السعودية</span>
                    <span>|</span>
                    <span style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; direction: ltr; letter-spacing: 1px;">Kingdom of Saudi Arabia</span>
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(container);

        // Standard ZATCA QR (Updated with zero tax)
        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR("غسلة سحاب", "000000000000000", data.timestamp, data.grandTotal, 0);
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

    // HTML Generator for Thermal Receipt
    generateThermalHTML(data, qrContainerId) {
        const dStr = new Date(data.timestamp).toLocaleString('ar-SA');
        let itemsHtml = '';
        data.items.forEach((item, i) => {
            let tLbl = item.type === 'iron' ? 'كوي' : (item.type === 'wash_iron' ? 'غ.كوي' : 'غسيل');
            let sLbl = item.speed === 'normal' ? 'عادي' : 'سريع';
            itemsHtml += `
            <tr>
                <td style="text-align:center;">${item.qty}</td>
                <td>${item.name}<br><span style="font-size:10px;color:#444">${tLbl}-${sLbl}</span></td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td style="font-weight:bold;">${(item.unitPrice * item.qty).toFixed(2)}</td>
            </tr>`;
        });

        return `
        <div class="thermal-receipt" style="margin:0 auto;">
            <div class="thermal-header">
                <img src="logo.png" alt="Logo" onerror="this.style.display='none'">
                <h1>غسلة سحاب</h1>
                <p>للغسيل والكوي | Sahab Laundry</p>
            </div>
            
            <div class="thermal-meta">
                <div><span>رقم الفاتورة:</span> <strong>${data.id}</strong></div>
                <div><span>التاريخ:</span> <span>${dStr}</span></div>
                <div><span>العميل:</span> <strong>${data.customer.name}</strong></div>
            </div>
            
            <table class="thermal-table">
                <thead>
                    <tr>
                        <th style="text-align:center">م</th>
                        <th>الصنف</th>
                        <th>سعر</th>
                        <th>إجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div class="thermal-totals">
                <div><span>رسوم التوصيل:</span> <span>${data.deliveryFee.toFixed(2)} ر.س</span></div>
                <div class="thermal-grand"><span>الإجمالي:</span> <span>${data.grandTotal.toFixed(2)} ر.س</span></div>
            </div>
            
            <div class="thermal-footer">
                <div id="${qrContainerId}" class="thermal-qr"></div>
                <p>شكراً لثقتكم بنا</p>
            </div>
        </div>`;
    },

    // 80mm Thermal Receipt Layout
    printInvoice(data) {
        document.getElementById('invoice-print-container').innerHTML = this.generateThermalHTML(data, 'print-qr-render');

        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR("غسلة سحاب", "000000000000000", data.timestamp, data.grandTotal, 0);
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
                filtered.forEach(i => {
                    if (!i) return;
                    let customerName = (i.customer && i.customer.name) ? i.customer.name : 'عميل نقدي';
                    let customerPhone = (i.customer && i.customer.phone) ? i.customer.phone : '0000000000';
                    let cellPhone = (customerPhone !== '0000000000') ? `<br><small style="color:var(--text-muted); direction:ltr; display:inline-block">${customerPhone}</small>` : '';
                    let total = i.grandTotal || 0;
                    let dateStr = i.timestamp ? new Date(i.timestamp).toLocaleString('ar-SA') : '-';

                    html += `<tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:15px; font-weight:bold;">${i.id || 'N/A'}</td>
                        <td style="padding:15px;">${customerName}${cellPhone}</td>
                        <td style="padding:15px; font-weight:bold; color:var(--primary)">${total.toFixed(2)} ر.س</td>
                        <td style="padding:15px;">${dateStr}</td>
                        <td style="padding:15px; text-align:center;">
                            <button class="btn-action-icon btn-action-print" onclick="appLogic.reprintInvoice('${i.id}')" title="معاينة وإعادة طباعة"><i class="fa-solid fa-print"></i></button>
                            <button class="btn-action-icon btn-action-edit" onclick="appLogic.editInvoice('${i.id}')" title="تعديل"><i class="fa-solid fa-edit"></i></button>
                            <button class="btn-action-icon btn-action-delete" onclick="appLogic.deleteInvoice('${i.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>`;
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

    async reprintInvoice(id) {
        const invs = await localforage.getItem('invoices') || [];
        const invoiceData = invs.find(i => i.id === id);
        if (!invoiceData) return;

        this.currentInvoice = invoiceData;
        document.getElementById('invoice-preview-container').innerHTML = this.generateThermalHTML(invoiceData, 'preview-qr-render');

        const zatcaQRBase64 = zatcaEncoder.generateZATCA_QR("غسلة سحاب", "000000000000000", invoiceData.timestamp, invoiceData.grandTotal, invoiceData.vatAmount || 0);
        new QRCode(document.getElementById('preview-qr-render'), {
            text: zatcaQRBase64,
            width: 100, height: 100,
            colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.L
        });

        document.getElementById('modal-actions-preview').classList.add('hidden');
        document.getElementById('modal-actions-success').classList.remove('hidden');

        document.getElementById('preview-invoice-id').innerText = invoiceData.id;
        document.getElementById('success-invoice-ref').innerText = invoiceData.id + " (نسخة مطابقة)";
        document.getElementById('invoice-preview-modal').classList.remove('hidden');
    },

    async deleteInvoice(id) {
        if (!confirm(`هل أنت متأكد من حذف الفاتورة ${id} نهائياً؟`)) return;
        let invs = await localforage.getItem('invoices') || [];
        invs = invs.filter(i => i.id !== id);
        await localforage.setItem('invoices', invs);
        this.filterHistory();
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

        // UI updates
        this.updateCartUI();
        this.switchView('pos');

        // ensure category is refreshed
        document.querySelector(`.nav-btn[onclick="appLogic.switchView('pos')"]`).classList.add('active');
    },

    async renderCustomers() {
        try {
            const custs = await localforage.getItem('customers') || [];
            this.renderCustomersList(custs);
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
            html += '<thead><tr style="background:#111; color:var(--primary)"><th style="padding:15px; text-align:right;">الجوال</th><th style="padding:15px; text-align:right;">الاسم</th><th style="padding:15px; text-align:right;">آخر تاريخ</th><th style="padding:15px; text-align:center;">إجراءات</th></tr></thead><tbody>';
            if (customersArray.length === 0) {
                html += '<tr><td colspan="4" style="padding:20px; text-align:center;">لا توجد بيانات للعملاء حتى الآن.</td></tr>';
            } else {
                customersArray.forEach(c => {
                    if (!c) return;
                    let n = c.name || 'غير معروف';
                    let p = c.phone || 'غير مسجل';
                    let d = c.date ? new Date(c.date).toLocaleString('ar-SA') : '-';
                    html += `<tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:15px; font-weight:bold; direction:ltr; text-align:right;">${p}</td>
                        <td style="padding:15px; font-weight:bold;">${n}</td>
                        <td style="padding:15px;">${d}</td>
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
    openAddInventoryModal() { document.getElementById('add-inventory-modal').classList.remove('hidden'); },
    closeInventoryModal() { document.getElementById('add-inventory-modal').classList.add('hidden'); },
    async saveInventoryItem() {
        let name = document.getElementById('inv-name').value;
        let sku = document.getElementById('inv-sku').value;
        let qty = parseFloat(document.getElementById('inv-qty').value);
        let cost = parseFloat(document.getElementById('inv-cost').value);
        if (!name || !sku) { alert('يرجى تعبئة الحقول الأساسية!'); return; }

        let inv = await localforage.getItem('inventory') || [];
        let itemIdx = inv.findIndex(i => i.sku === sku);
        if (itemIdx >= 0) {
            inv[itemIdx].qty += qty;
            inv[itemIdx].cost = cost;
        } else {
            inv.push({ id: Date.now(), name, sku, qty, cost });
        }
        await localforage.setItem('inventory', inv);
        this.closeInventoryModal();
        this.renderInventory();
        this.showToast('تم حفظ الصنف بنجاح');
    },

    async renderInventory() {
        let trackedInv = await localforage.getItem('inventory') || [];

        let html = `
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
                    </tr>
                </thead>
                <tbody>`;
            trackedInv.forEach(item => {
                html += `
                <tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:12px; font-family:monospace; color:var(--primary);">${item.sku}</td>
                    <td style="padding:12px; font-weight:bold;">${item.name}</td>
                    <td style="padding:12px; direction:ltr;">${item.cost.toFixed(2)} SAR</td>
                    <td style="padding:12px; font-weight:bold; color:${item.qty < 5 ? '#e91e63' : '#4CAF50'}">${item.qty}</td>
                    <td style="padding:12px; font-weight:bold; direction:ltr;">${(item.qty * item.cost).toFixed(2)} SAR</td>
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
        this.services.forEach(item => {
            html += `
                <tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:12px;"><i class="fa-solid ${item.icon}" style="font-size:20px; color:var(--primary);"></i></td>
                    <td style="padding:12px; font-weight:bold;">${item.name}</td>
                    <td style="padding:12px;">${item.cat === 'men' ? 'رجالي' : (item.cat === 'women' ? 'نسائي' : 'أخرى')}</td>
                    <td style="padding:12px; color:var(--primary); font-weight:bold;">${parseFloat(item.prices.iron).toFixed(2)}</td>
                    <td style="padding:12px; color:var(--primary); font-weight:bold;">${parseFloat(item.prices.wash_iron).toFixed(2)}</td>
                    <td style="padding:12px; color:var(--primary); font-weight:bold;">${parseFloat(item.prices.wash).toFixed(2)}</td>
                    <td style="padding:12px; color:#4CAF50; font-weight:bold;">
                        ${typeof item.expressFee === 'object' ? 'متغير' : `+${parseFloat(item.expressFee).toFixed(2)}`}
                    </td>
                    <td style="padding:12px; text-align:center;">
                        <button class="btn-edit-svc" onclick="appLogic.openEditServiceModal('${item.id}')">
                            <i class="fa-solid fa-edit"></i> تعديل
                        </button>
                    </td>
                </tr>`;
        });
        html += `</tbody></table></div></div>`;

        const container = document.getElementById('inventory-content');
        if (container) container.innerHTML = html;
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
        this.closeServiceModal();
        this.renderInventory();
        this.renderItems(); // Refresh POS grid
        this.showToast('تم حفظ بيانات الخدمة بنجاح');
    },

    // Wafeq UI: Expenses
    openAddExpenseModal() { document.getElementById('add-expense-modal').classList.remove('hidden'); },
    closeExpenseModal() { document.getElementById('add-expense-modal').classList.add('hidden'); },
    async saveExpense() {
        let cat = document.getElementById('exp-category').value;
        let amount = parseFloat(document.getElementById('exp-amount').value);
        let desc = document.getElementById('exp-desc').value;
        let date = document.getElementById('exp-date').value;

        if (!amount || !desc || !date) { alert('يرجى تعبئة كافة الحقول لحفظ التقييد المحاسبي!'); return; }

        let exps = await localforage.getItem('expenses') || [];
        exps.push({ id: Date.now(), category: cat, amount: amount, desc: desc, date: date });
        await localforage.setItem('expenses', exps);

        this.closeExpenseModal();
        this.renderExpenses();
        this.showToast('تم تقييد المصروف بنجاح وتسجيله بالدفتر');

        // Reset fields
        document.getElementById('exp-amount').value = 0;
        document.getElementById('exp-desc').value = '';
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

    // Wafeq UI: Financial Reports
    async renderReports() {
        const taxRecords = await localforage.getItem('tax_records') || [];
        const exps = await localforage.getItem('expenses') || [];

        let totalGross = 0;
        let totalNet = 0;
        let totalVat = 0;
        let totalExpensesCost = 0;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekAgo = today - (7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime();

        let salesToday = 0, salesWeek = 0, salesMonth = 0, salesYear = 0;

        taxRecords.forEach(r => {
            totalGross += r.grossTotal || 0;
            totalNet += r.netTotal || 0;
            totalVat += r.vatCollected || 0;

            const rTime = new Date(r.date).getTime();
            const rNet = r.netTotal || 0;
            if (rTime >= today) salesToday += rNet;
            if (rTime >= weekAgo) salesWeek += rNet;
            if (rTime >= monthAgo) salesMonth += rNet;
            if (rTime >= yearAgo) salesYear += rNet;
        });

        exps.forEach(e => {
            totalExpensesCost += e.amount || 0;
        });

        let netProfit = totalNet - totalExpensesCost;

        let html = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-bottom:30px;">
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:24px; text-align:center; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
                <i class="fa-solid fa-sack-dollar" style="font-size:32px; color:#4CAF50; margin-bottom:15px;"></i>
                <h3 style="color:var(--text-muted); font-size:16px; margin-bottom:5px;">إجمالي المبيعات الإيرادية (Revenue)</h3>
                <div style="font-size:28px; font-weight:900; color:#fff; direction:ltr;">${totalNet.toFixed(2)} SAR</div>
            </div>
            
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:24px; text-align:center; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
                <i class="fa-solid fa-arrow-right-from-bracket" style="font-size:32px; color:#e91e63; margin-bottom:15px;"></i>
                <h3 style="color:var(--text-muted); font-size:16px; margin-bottom:5px;">مصروفات تشغيلية (Expenses)</h3>
                <div style="font-size:28px; font-weight:900; color:#e91e63; direction:ltr;">- ${totalExpensesCost.toFixed(2)} SAR</div>
            </div>

            <div style="background:var(--bg-surface); border:1px solid var(--primary); border-radius:var(--radius-md); padding:24px; text-align:center; box-shadow:0 4px 15px rgba(253,184,19,0.2);">
                <i class="fa-solid fa-chart-pie" style="font-size:32px; color:var(--primary); margin-bottom:15px;"></i>
                <h3 style="color:var(--text-muted); font-size:16px; margin-bottom:5px;">صافي الربح / الخسارة (P&L)</h3>
                <div style="font-size:28px; font-weight:900; color:${netProfit >= 0 ? '#4CAF50' : '#e91e63'}; direction:ltr;">${netProfit.toFixed(2)} SAR</div>
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
    }
};

window.onload = () => appLogic.init();
