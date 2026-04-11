const fs = require('fs');
let c = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/css/style.css', 'utf8');

// Strip the previously injected footer overhaul block
const marker = '/* =========================================================\r\n   PREMIUM CART FOOTER OVERHAUL - INJECTED VIA OVERRIDES\r\n========================================================= */';
const marker2 = '/* =========================================================\n   PREMIUM CART FOOTER OVERHAUL - INJECTED VIA OVERRIDES\n========================================================= */';

if (c.indexOf(marker) !== -1) {
    c = c.substring(0, c.indexOf(marker));
} else if (c.indexOf(marker2) !== -1) {
    c = c.substring(0, c.indexOf(marker2));
}

// Ensure the file ends with a newline
if (!c.endsWith('\n')) {
    c += '\n';
}

const newCss = `
/* =========================================================
   FULL-HEIGHT SIDEBAR & SLEEK CART FOOTER OVERRIDES
========================================================= */

/* 1. Full-Height Sidebar Architecture (Desktop mode mostly, mobile is handled via fixed footer drawer) */
@media (min-width: 900px) {
    .cart-section {
        display: flex !important;
        flex-direction: column !important;
        height: calc(100vh - 64px) !important; /* Assuming navbar is ~64px */
        margin: 0 !important;
        padding: 0 !important;
        border-right: none !important;
        border-left: 1px solid #222 !important;
        background: #121212 !important;
        position: sticky !important;
        top: 64px !important;
    }
}

/* 2. Maximize the Cart Items Area (The Middle Section) */
.cart-items#cart-items {
    flex-grow: 1 !important;
    flex-basis: 0 !important;
    overflow-y: auto !important;
    padding: 10px 15px !important;
    margin: 0 !important;
    background: transparent !important;
    min-height: 0 !important; /* CRITICAL for flexbox scrolling inside container */
}

/* Remove any dead space in the cart header */
.cart-header {
    border-bottom: 1px solid #2a2a2a !important;
    padding: 12px 15px !important;
    margin: 0 !important;
    background: #181818 !important;
}

/* 3. Pin and Refine the Footer */
.cart-footer#cart-footer {
    flex-shrink: 0 !important;
    padding: 15px !important;
    background: #161616 !important;
    border-top: 1px solid #2a2a2a !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    margin-top: 0 !important;
    /* padding-bottom: 25px !important; // remove extreme padding to keep it tight, iPad safe area is usually handled globally */
}

/* Mobile specific iPad bottom padding override */
@media (max-width: 899px) {
    .cart-footer#cart-footer {
        padding-bottom: max(15px, env(safe-area-inset-bottom)) !important;
    }
}

/* 4. Fix the Bulky Aesthetics (Totals & Inputs) */
.cart-modern-actions {
    display: flex !important;
    gap: 8px !important;
    align-items: center !important;
    margin: 0 !important;
}

.btn-trash {
    width: 44px !important;
    height: 44px !important;
    border-radius: 8px !important;
}

.btn-total-trigger {
    background: var(--primary) !important;
    color: #000 !important;
    font-weight: 800 !important;
    font-size: 1.1rem !important; /* SLEEKER size */
    border-radius: 8px !important; /* Match inputs */
    padding: 10px 15px !important; /* Compact padding */
    box-shadow: none !important; /* Remove extreme shadow */
    border: none !important;
    transition: all 0.2s ease !important;
    flex: 1 !important;
}

.btn-total-trigger:hover {
    transform: translateY(-1px) !important;
    filter: brightness(1.05) !important;
}

.fast-checkout-info {
    margin-top: 0 !important; /* Remove dead space between total and inputs */
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
}

.fast-checkout-info input[type="text"],
.fast-checkout-info input[type="tel"] {
    background: #1e1e1e !important;
    border: 1px solid #333 !important;
    border-radius: 6px !important;
    color: #fff !important;
    padding: 10px 12px !important; /* Compact comfortable typing */
    font-size: 14px !important;
    margin-bottom: 0 !important; /* Margin handled by fast-checkout-info gap */
    transition: all 0.2s ease !important;
}

.fast-checkout-info input::placeholder {
    color: #666 !important;
}

.fast-checkout-info input:focus {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 1px var(--primary) !important; /* Strict sharp sleek outline */
    outline: none !important;
}

.fast-checkout-info h4 {
    display: none !important; /* "خيارات التوصيل" is redundant, removing it cleans the UI */
}

.delivery-buttons#checkout-delivery-buttons {
    display: flex !important;
    gap: 6px !important;
    flex-wrap: wrap !important;
    margin-top: 2px !important;
}

.btn-delivery {
    background: #222 !important;
    border: 1px solid #333 !important;
    border-radius: 6px !important;
    color: #999 !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    padding: 8px 10px !important; /* Sleek pill */
    transition: all 0.2s ease !important;
    flex: 1 !important;
    text-align: center !important;
    cursor: pointer !important;
}

.btn-delivery.active {
    background: rgba(253, 184, 19, 0.1) !important;
    border-color: var(--primary) !important;
    color: var(--primary) !important;
}
`;

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/css/style.css', c + newCss);
console.log('Structural UI Overhaul Applied Successfully.');
