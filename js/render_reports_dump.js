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
        let totalUncollected = 0; // GLOBAL UNCOLLECTED
        let totalCollected = 0;   // Collected amounts

        // 🌟 CRITICAL BUG FIX: Compute Global Uncollected Amounts from Active Invoices ONLY
        // Debts MUST survive the daily reset (shiftCutoff) and carry over indefinitely.
        let validActiveInvs = Array.isArray(activeInvs) ? activeInvs : Object.values(activeInvs);
        validActiveInvs.forEach(i => {
            if (i && i.paymentStatus === 'unpaid' && !i.isCancelled) {
                const amt = parseFloat(i.total || i.grandTotal || 0);
                const refundAmt = i.isCancelled ? amt : parseFloat(i.refundAmount || 0);
                totalUncollected += (amt - refundAmt);
            }
        });

        // 1. Process Invoices
        let cashTotal = 0, madaTotal = 0, visaTotal = 0, mastercardTotal = 0;
        invoices.forEach(i => {
            if (!i) return;
            const amt = parseFloat(i.total || i.grandTotal || 0);
            const rTime = new Date(i.date || i.timestamp).getTime();

            // If Live Shift: only show what hasn't been closed AND is newer than the last shift wipe.
            // If History: show everything for that selected date.
            const matchesShift = isLiveShift ? (!i.isZReported && rTime >= shiftCutoff) : true;

            // DYNAMIC ROLLING TOTALS
            const isInRange = (rTime >= startBound && (endBound === Infinity || rTime <= endBound));

            let refundAmt = parseFloat(i.refundAmount || 0);
            if (i.isCancelled) refundAmt = amt; // if fully cancelled previously without refundAmount prop
            const netAmt = amt - refundAmt;
            const isUnpaid = i.paymentStatus === 'unpaid';

            // Today's sales honors the Z-Report wipe (matchesShift) per user preference
            if (isInRange && matchesShift) {
                salesToday += netAmt; // ✅ Total Sales ALWAYS includes everything (Cash + Card + Pay Later)
                if (!isUnpaid) {
                    totalCollected += netAmt;   // ✅ Collected (Paid amounts only)
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
    }