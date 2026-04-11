const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const newMethodCode = `    async initSmartCustomerAutocomplete(attachListeners) {
        try {
            let customers = await this._getAggregatedCustomers();
            if(!customers) return;
            
            customers.sort((a,b) => (b.orderCount || 0) - (a.orderCount || 0));
            
            let htmlNames = '';
            let htmlPhones = '';
            let seenNames = new Set();
            let seenPhones = new Set();
            
            this._smartCustomersMapByPhone = {};
            this._smartCustomersMapByName = {};

            customers.forEach(c => {
                const n = (c.name || '').trim();
                const p = (c.phone || '').trim();

                if (n && !seenNames.has(n) && n !== 'Unnamed Customer' && n !== 'عميل غير محدد') {
                    htmlNames += \`<option value="\${n}"></option>\`;
                    seenNames.add(n);
                }
                if (p && p !== '0000000000' && !seenPhones.has(p)) {
                    htmlPhones += \`<option value="\${p}"></option>\`;
                    seenPhones.add(p);
                }
                
                if (p && p !== '0000000000' && n) this._smartCustomersMapByPhone[p] = n;
                if (n && p && p !== '0000000000') this._smartCustomersMapByName[n] = p;
            });

            const dlNames = document.getElementById('smart-customers-names');
            const dlPhones = document.getElementById('smart-customers-phones');
            
            if (dlNames) dlNames.innerHTML = htmlNames;
            if (dlPhones) dlPhones.innerHTML = htmlPhones;

            if (attachListeners) {
                const inpName = document.getElementById('checkout-customer-name');
                const inpPhone = document.getElementById('checkout-customer-phone');
                
                if (inpPhone && inpName) {
                    inpPhone.addEventListener('input', (e) => {
                        let pV = e.target.value.trim();
                        if (this._smartCustomersMapByPhone[pV]) {
                            inpName.value = this._smartCustomersMapByPhone[pV];
                        }
                    });
                    
                    inpName.addEventListener('input', (e) => {
                        let nV = e.target.value.trim();
                        if (this._smartCustomersMapByName[nV] && !inpPhone.value.trim()) {
                            inpPhone.value = this._smartCustomersMapByName[nV];
                        }
                    });
                }
            }
        } catch(e) { console.error('Smart Autocomplete Error:', e); }
    },
`;

c = c.replace('toggleMobileCart() {', newMethodCode + '    toggleMobileCart() {');

// We have 2 calls: one in init(), and one at end of confirmCheckout's cleanup logic.
c = c.replace('await this.updateLaundryDatalist();', 'await this.updateLaundryDatalist();\n        await this.initSmartCustomerAutocomplete(true);');
c = c.replace('this.updateCartUI();\n    },\n    closeInvoicePreview()', 'this.updateCartUI();\n        this.initSmartCustomerAutocomplete(false);\n    },\n    closeInvoicePreview()');

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', c);
console.log("Datalist injected successfully");
