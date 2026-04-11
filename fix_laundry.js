const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

c = c.replace('balances[key].balance += cost;', '// balances[key].balance += cost; // Replaced by distinct liabilities flow');

const getAllUnpaidCode = `
    async getAllUnpaidLaundries() {
        const unpaid = [];
        const currentInvs = await localforage.getItem('invoices') || [];
        const archivedData = await localforage.getItem('archived_z_reports') || [];

        const processInv = (i) => {
            if (!i || !i.partnerLaundryName || i.partnerLaundryName.trim() === '' || i.isCancelled || i.status === 'cancelled') return;
            if (i.laundryPaid === true) return;
            const cost = parseFloat(i.laundryCost || i.partnerLaundryCost || 0);
            if (cost <= 0) return;

            unpaid.push({
                invoiceId: i.id,
                name: i.partnerLaundryName.trim(),
                hood: (i.partnerLaundryNeighborhood || '').trim(),
                amount: cost,
                date: getLocalYMD(i.timestamp)
            });
        };

        currentInvs.forEach(processInv);
        
        let validArchives = Array.isArray(archivedData) ? archivedData : Object.values(archivedData);
        validArchives.forEach(arc => {
            if (arc && arc.invoices) {
                const arcInvs = Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices);
                arcInvs.forEach(processInv);
            }
        });

        const unique = {};
        unpaid.forEach(u => unique[u.invoiceId] = u);
        return Object.values(unique).sort((a,b) => new Date(b.date) - new Date(a.date));
    },

    async settleSingleLaundry(invoiceId, name, amount) {
        const lang = this.currentLang || 'ar';
        if (!confirm(lang === 'en' ? 'Settle amount ' + amount + ' for ' + name + '?' : 'تأكيد تسديد مبلغ ' + amount + ' ر.س لمغسلة: ' + name + '؟')) return;
        
        let invs = await localforage.getItem('invoices') || [];
        let archivedLogs = await localforage.getItem('archived_z_reports') || [];
        let updated = false;

        const idx = invs.findIndex(i => i.id === invoiceId);
        if (idx !== -1) {
            invs[idx].laundryPaid = true;
            updated = true;
            await localforage.setItem('invoices', invs);
            await manualSyncToCloud('invoices', invs);
        } else {
            let validArchives = Array.isArray(archivedLogs) ? archivedLogs : Object.values(archivedLogs);
            for (let arc of validArchives) {
                if (arc && arc.invoices) {
                    let arcInvs = Array.isArray(arc.invoices) ? arc.invoices : Object.values(arc.invoices);
                    let aIdx = arcInvs.findIndex(i => i.id === invoiceId);
                    if (aIdx !== -1) {
                        arcInvs[aIdx].laundryPaid = true;
                        updated = true;
                        break;
                    }
                }
            }
            if (updated) {
                await localforage.setItem('archived_z_reports', archivedLogs);
                await manualSyncToCloud('archived_z_reports', archivedLogs);
            }
        }

        if (updated) {
            let exps = await localforage.getItem('expenses') || [];
            exps.push({
                id: Date.now(),
                timestamp: Date.now(),
                category: lang === 'en' ? 'Partner Settlement' : 'حسابات مغاسل',
                amount: parseFloat(amount),
                desc: lang === 'en' ? 'Settlement for: ' + name : 'تسديد حساب متعاونة: ' + name,
                date: getLocalYMD()
            });
            await localforage.setItem('expenses', exps);
            localStorage.setItem('expenses', JSON.stringify(exps));
            await manualSyncToCloud('expenses', exps);

            this.showToast(lang === 'en' ? 'Settled and added to expenses' : 'تم التسديد وتحويله للمصروفات بنجاح');
            
            let balances = await localforage.getItem('laundry_balances') || {};
            const keyNames = Object.keys(balances).filter(k => k.startsWith(name + '|'));
            if(keyNames.length > 0) {
               balances[keyNames[0]].balance = Math.max(0, balances[keyNames[0]].balance - parseFloat(amount));
               await localforage.setItem('laundry_balances', balances);
               localStorage.setItem('laundry_balances', JSON.stringify(balances));
            }

            this.renderExpenses();
        } else {
            alert(lang === 'en' ? 'Invoice not found' : 'الفاتورة غير موجودة');
        }
    },
`;

c = c.replace('renderExpenses() {', getAllUnpaidCode + '    async renderExpenses() {');

const table2Start = c.indexOf('// --- TABLE 2: PARTNER ACCOUNTS (Laundries) ---');
const table2End = c.indexOf('} catch (err) { console.error(\'Error rendering consolidated expenses:\', err); }');

if (table2Start !== -1 && table2End !== -1) {
    const table2ReplaceText = `
            // --- TABLE 2: PARTNER ACCOUNTS (Laundries) ---
            const unpaidList = await this.getAllUnpaidLaundries();
            
            const partnerTitle = lang === 'en' ? 'Partner Laundry Accounts' : 'حسابات المغاسل المتعاونة المستحقة';
            const noPartners = lang === 'en' ? 'No unpaid partner accounts' : 'لا توجد حسابات متعاونة بانتظار التسديد';
            const thName = lang === 'en' ? 'Laundry Name' : 'اسم المغسلة';
            const thInv = lang === 'en' ? 'Inv ID' : 'رقم الفاتورة';
            const thDate = lang === 'en' ? 'Date' : 'تاريخ الفاتورة';
            const thDues = lang === 'en' ? 'Amount (Owed)' : 'مبلغ الاستحقاق (ر.س)';
            const thActions = lang === 'en' ? 'Actions' : 'إجراءات (Actions)';
            const settleBtn = lang === 'en' ? 'Settle' : 'تسديد';
            const grandTotalLbl = lang === 'en' ? 'Grand Total' : 'إجمالي المبالغ المستحقة';

            let totalDues = 0;
            unpaidList.forEach(u => totalDues += u.amount);

            html += \`
            <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:15px;">
                    <h3 style="color:var(--primary); font-size:16px;"><i class="fa-solid fa-handshake"></i> \${partnerTitle}</h3>
                </div>
                \${unpaidList.length === 0 ? \`<p style="color:var(--text-muted); text-align:center; padding:10px;">\${noPartners}</p>\` : \`
                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse:collapse; background:var(--bg-body); border-radius:8px; overflow:hidden;">
                        <thead>
                            <tr style="background:#111; color:var(--primary); font-size:12px;">
                                <th style="padding:12px; text-align:right;">\${thName}</th>
                                <th style="padding:12px; text-align:center;">\${thInv}</th>
                                <th style="padding:12px; text-align:right;">\${thDate}</th>
                                <th style="padding:12px; text-align:right;">\${thDues}</th>
                                <th style="padding:12px; text-align:center;">\${thActions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${unpaidList.map(item => {
                                const displayName = item.hood ? \`\${item.name} <small style="color:#888;">(\${item.hood})</small>\` : item.name;
                                const safeName = item.name.replace(/'/g, "\\\\'").replace(/\"/g, "&quot;");
                                return \`
                                <tr style="border-bottom:1px solid var(--border);">
                                    <td style="padding:15px; font-weight:bold; color:#fff;">\${displayName}</td>
                                    <td style="padding:15px; font-weight:bold; color:var(--text-muted); direction:ltr; text-align:center; font-size:12px;">\${item.invoiceId}</td>
                                    <td style="padding:15px; font-size:13px; color:var(--text-muted); direction:ltr; text-align:right;">\${item.date}</td>
                                    <td style="padding:15px; font-weight:bold; color:#ff4538; direction:ltr; text-align:right;">\${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} SAR</td>
                                    <td style="padding:15px; text-align:center;">
                                        <button class="btn" style="background:var(--primary); color:#000; padding:8px 16px; font-weight:900; border:none; border-radius:6px; font-size:13px; cursor:pointer;" onclick="appLogic.settleSingleLaundry('\${item.invoiceId}', '\${safeName}', \${item.amount})"><i class="fa-solid fa-money-check-dollar"></i> \${settleBtn}</button>
                                    </td>
                                </tr>
                                \`;
                            }).join('')}
                            <tr style="background:#111; border-top:2px solid var(--border); font-weight:900;">
                                <td colspan="3" style="padding:15px; color:var(--primary);">\${grandTotalLbl}</td>
                                <td style="padding:15px; color:#ff4538; direction:ltr; text-align:right;">\${totalDues.toLocaleString('en-US', { minimumFractionDigits: 2 })} SAR</td>
                                <td style="padding:15px;">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>\`}
            </div>\`;
            container.innerHTML = html;
            `;
    c = c.slice(0, table2Start) + table2ReplaceText + c.slice(table2End);
} else {
    console.log("Could not find table offsets.");
}

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', c);
console.log('Laundry Table Refactored!');
