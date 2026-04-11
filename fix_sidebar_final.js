const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/css/style.css', 'utf8');

// Strip ALL previously injected override blocks so we start clean
const markers = [
    '/* =========================================================\r\n   PREMIUM CART FOOTER OVERHAUL - INJECTED VIA OVERRIDES\r\n========================================================= */',
    '/* =========================================================\n   PREMIUM CART FOOTER OVERHAUL - INJECTED VIA OVERRIDES\n========================================================= */',
    '/* =========================================================\r\n   FULL-HEIGHT SIDEBAR & SLEEK CART FOOTER OVERRIDES\r\n========================================================= */',
    '/* =========================================================\n   FULL-HEIGHT SIDEBAR & SLEEK CART FOOTER OVERRIDES\n========================================================= */',
];
for (const m of markers) {
    const idx = c.indexOf(m);
    if (idx !== -1) {
        c = c.substring(0, idx);
    }
}
if (!c.endsWith('\n')) c += '\n';

// === DEFINITIVE FINAL SIDEBAR BLOCK ===
// Navbar height is 50px (confirmed from .main-header { height: 50px; })
const finalBlock = `
/* ================================================================
   DEFINITIVE SIDEBAR STRUCTURAL FIX - DO NOT ADD MORE OVERRIDES
================================================================ */

/* ── DESKTOP SIDEBAR (≥900px) ─────────────────────────────────── */
@media (min-width: 900px) {
    /* The cart column itself */
    .cart-section {
        margin: 0 !important;
        padding: 0 !important;
        height: calc(100vh - 50px) !important;
        top: 50px !important;
        position: sticky !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        background: #111 !important;
        border-right: 1px solid #252525 !important;
        border-left: none !important;
    }

    /* Header – zero gap at top */
    .cart-section .cart-header {
        flex-shrink: 0 !important;
        margin: 0 !important;
        padding: 12px 15px !important;
        background: #171717 !important;
        border-bottom: 1px solid #252525 !important;
    }

    /* Items middle – takes ALL remaining space */
    .cart-section .cart-items {
        flex: 1 1 auto !important;
        min-height: 0 !important;
        overflow-y: auto !important;
        padding: 12px !important;
        background: #111 !important;
    }

    /* Footer – pinned to bottom, never clips */
    .cart-section .cart-footer {
        flex-shrink: 0 !important;
        margin: 0 !important;
        padding: 12px !important;
        padding-bottom: 25px !important;
        background: #161616 !important;
        border-top: 1px solid #252525 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
    }
}

/* ── TOTAL BUTTON (sleek, not bulky) ───────────────────────────── */
.btn-total-trigger {
    flex: 1 !important;
    background: var(--primary) !important;
    color: #000 !important;
    font-weight: 800 !important;
    font-size: 1rem !important;
    border-radius: 8px !important;
    padding: 12px !important;
    box-shadow: none !important;
    border: none !important;
    transition: filter 0.2s ease !important;
}
.btn-total-trigger:hover {
    filter: brightness(1.08) !important;
    transform: none !important;
}

/* ── CUSTOMER INPUTS ───────────────────────────────────────────── */
#checkout-customer-name,
#checkout-customer-phone {
    background: #1c1c1c !important;
    border: 1px solid #303030 !important;
    border-radius: 7px !important;
    color: #fff !important;
    padding: 10px 12px !important;
    font-size: 14px !important;
    margin: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}
#checkout-customer-name::placeholder,
#checkout-customer-phone::placeholder {
    color: #555 !important;
}
#checkout-customer-name:focus,
#checkout-customer-phone:focus {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 1px rgba(253,184,19,0.35) !important;
    outline: none !important;
}

/* ── FAST CHECKOUT WRAPPER ─────────────────────────────────────── */
.fast-checkout-info {
    display: flex !important;
    flex-direction: column !important;
    gap: 7px !important;
    margin: 0 !important;
}

/* Hide the redundant "خيارات التوصيل" label */
.fast-checkout-info h4 {
    display: none !important;
}

/* ── DELIVERY BUTTONS ──────────────────────────────────────────── */
.delivery-buttons,
#checkout-delivery-buttons {
    display: flex !important;
    gap: 6px !important;
    flex-wrap: wrap !important;
}
.btn-delivery {
    flex: 1 !important;
    background: #1c1c1c !important;
    border: 1px solid #303030 !important;
    border-radius: 7px !important;
    color: #888 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    padding: 9px 6px !important;
    text-align: center !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    min-height: 36px !important;
}
.btn-delivery.active {
    background: rgba(253,184,19,0.1) !important;
    border-color: var(--primary) !important;
    color: var(--primary) !important;
}
`;

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/css/style.css', c + finalBlock);
console.log('DEFINITIVE sidebar fix applied. Old overrides stripped.');
