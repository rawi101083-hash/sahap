const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

// 1. Rename the trigger button in renderCustomersList
c = c.replace(/<i class="fa-solid fa-receipt"><\/i>[^<]+/g, '<i class="fa-solid fa-user"></i> عرض ملف العميل\n                            ');

// 2. Fix reprintInvoice to search archives
const oldReprint = `    async reprintInvoice(id) {
        const invs = await localforage.getItem('invoices') || [];
        const invoiceData = invs.find(i => i.id === id);`;

const newReprint = `    async reprintInvoice(id) {
        const invs = await localforage.getItem('invoices') || [];
        const arcs = await localforage.getItem('archived_z_reports') || [];
        let all = Array.isArray(invs) ? invs.slice() : Object.values(invs);
        const validArcs = Array.isArray(arcs) ? arcs : Object.values(arcs);
        validArcs.forEach(a => {
            if(a.invoices) {
                const aInvs = Array.isArray(a.invoices) ? a.invoices : Object.values(a.invoices);
                all = all.concat(aInvs);
            }
        });
        const invoiceData = all.find(i => i && i.id === id);`;

c = c.replace(oldReprint, newReprint);

// 3. Add triggerInvoiceAction function
const newActionMethod = `
    async triggerInvoiceAction(id, actionName) {
        await this.reprintInvoice(id);
        setTimeout(() => {
            if (actionName === 'print') {
                 this.printInvoice();
            } else if (actionName === 'pdf') {
                 this.generateInvoicePDF();
            } else if (actionName === 'wa') {
                 this.shareInvoiceWhatsApp();
            }
        }, 500);
    },
`;
c = c.replace('async reprintInvoice(id) {', newActionMethod + '    async reprintInvoice(id) {');

// 4. Upgrade openCustomerProfile modal UI
const regexUI = /tbody\.innerHTML = customerInvoices\.map\([^]+?\}\)\.join\(''\);/g;

const newHTMLMap = `tbody.innerHTML = customerInvoices.map(i => {
                    const d = getLocalYMD(i.timestamp) + ' ' + new Date(i.timestamp).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'});
                    const st = (i.isCancelled || i.status === 'cancelled') ? '<span style="color:var(--danger)"> (ملغاة)</span>' : '';
                    return \`<tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                        <td style="padding: 12px; text-align:right;">\${d}</td>
                        <td style="padding: 12px; text-align:center; direction:ltr; filter: brightness(0.8);">\${i.id}\${st}</td>
                        <td style="padding: 12px; text-align:center;">
                            <span style="background: rgba(253,184,19,0.15); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                                \${parseFloat(i.grandTotal || i.total || 0).toLocaleString('en-US', {minimumFractionDigits:2})} SAR
                            </span>
                        </td>
                        <td style="padding: 12px; text-align:center;">
                            <div style="display:flex; justify-content:center; gap:8px;">
                                <button onclick="appLogic.triggerInvoiceAction('\${i.id}', 'print')" title="طباعة" style="background:#222; color:#fff; border:1px solid #444; padding:6px 10px; border-radius:4px; margin: 0; display: inline-flex; height: 32px; width: 32px; justify-content: center; align-items: center; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#222'"><i class="fa-solid fa-print"></i></button>
                                <button onclick="appLogic.triggerInvoiceAction('\${i.id}', 'pdf')" title="PDF" style="background:#222; color:#ff453a; border:1px solid #444; padding:6px 10px; border-radius:4px; margin: 0; display: inline-flex; height: 32px; width: 32px; justify-content: center; align-items: center; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#222'"><i class="fa-solid fa-file-pdf"></i></button>
                                <button onclick="appLogic.triggerInvoiceAction('\${i.id}', 'wa')" title="واتساب" style="background:#222; color:#25D366; border:1px solid #444; padding:6px 10px; border-radius:4px; margin: 0; display: inline-flex; height: 32px; width: 32px; justify-content: center; align-items: center; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#222'"><i class="fa-brands fa-whatsapp"></i></button>
                            </div>
                        </td>
                    </tr>\`;
                }).join('');`;

c = c.replace(regexUI, newHTMLMap);
fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', c);


// Now index.html edit
let idx = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/index.html', 'utf8');
idx = idx.replace('<th style="padding: 10px; text-align: left;">المبلغ</th>', '<th style="padding: 10px; text-align: center;">المبلغ</th>\n                                    <th style="padding: 10px; text-align: center;">إجراءات</th>');
fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/index.html', idx);
console.log('CRM UI Updates Applied!');
