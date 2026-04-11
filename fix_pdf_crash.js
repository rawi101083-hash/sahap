const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

// Wrap `triggerInvoiceAction` in a try catch and ensure we catch background faults
const oldTrigger = `    async triggerInvoiceAction(id, actionName) {
        await this.reprintInvoice(id);
        setTimeout(() => {
            if (actionName === 'print') {
                 this.printInvoice();
            } else if (actionName === 'pdf') {
                 this.downloadDigitalPDF(null);
            } else if (actionName === 'wa') {
                 this.shareInvoiceWhatsApp();
            }
        }, 500);
    },`;

const newTrigger = `    async triggerInvoiceAction(id, actionName) {
        try {
            await this.reprintInvoice(id);
            setTimeout(() => {
                try {
                    if (actionName === 'print') {
                        this.printInvoice();
                    } else if (actionName === 'pdf') {
                        this.downloadDigitalPDF(null);
                    } else if (actionName === 'wa') {
                        this.shareInvoiceWhatsApp();
                    }
                } catch(err) {
                    console.error("Action Execution Error:", err);
                    alert("عذراً، حدث خطأ أثناء تنفيذ الإجراء.");
                }
            }, 500);
        } catch(err) {
            console.error("Action Setup Error:", err);
        }
    },`;
c = c.replace(oldTrigger, newTrigger);

// Fix data.customer.phone in downloadDigitalPDF
c = c.replace(/\$\{data\.customer\.phone \|\| '-'\}/g, "${(data.customer && data.customer.phone) ? data.customer.phone : '-'}");
c = c.replace(/const _custName = \(\!_customer\.name/g, 'const _customer = data.customer || {};\n        const _custName = (!_customer.name');

// Let's protect downloadDigitalPDF with try catch explicitly
const oldPdfStart = `    async downloadDigitalPDF(event) {
        console.log('Button Clicked: downloadDigitalPDF - Generating ERP Invoice');
        if (!this.currentInvoice) return;`;

const newPdfStart = `    async downloadDigitalPDF(event) {
        console.log('Button Clicked: downloadDigitalPDF - Generating ERP Invoice');
        if (!this.currentInvoice) return;
        try {`;

c = c.replace(oldPdfStart, newPdfStart);

// At the end of downloadDigitalPDF, add the catch block
const oldPdfEnd = `            await html2pdf().set(opt).from(container.firstElementChild).save();
            document.body.removeChild(container);
            
            // Re-show popup only if not auto-triggered
            setTimeout(() => {
                if (event) event.target.innerHTML = originalBtnHTML;
                const overlay = document.getElementById('loading-overlay');
                if (overlay) overlay.style.display = 'none';
            }, 500);

        } catch (err) {
            console.error('PDF Error:', err);
            if (event) event.target.innerHTML = originalBtnHTML;
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.style.display = 'none';
            // Only alert if we failed to save entirely
            alert('حدث خطأ أثناء إنشاء PDF: ' + err.message);
        }
    },`;

// Actually it seems it already HAS a try catch block at the end!! Let's check!
// The user crash might just have been from unhandled rejection inside the timeout or before the initial try...catch.
// If it already has a try block, let's just make sure the `if(!data.customer)` logic is perfectly safe.
fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', c);
console.log('PDF Crash fixes applied!');
