const fs = require('fs');

const code = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const targetStr = `            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(\`
            <html dir="rtl">
            <head>
                <title>سحاب POS - فاتورة</title>
                <style>
                    body { margin: 0; padding: 0; background: white; color: black; font-family: system-ui, sans-serif; width: 80mm; }
                    * { color: black !important; }
                    #rtl-wrapper { width: 100%; padding: 5px; box-sizing: border-box; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
                    td, th { font-size: 20px; font-weight: bold; padding: 5px 0; border-bottom: 2px dashed #000; }
                    th:nth-child(1), td:nth-child(1) { text-align: right; width: 50%; padding-right: 5px; }
                    th:nth-child(2), td:nth-child(2) { text-align: center; width: 20%; }
                    th:nth-child(3), td:nth-child(3) { text-align: left; width: 30%; padding-left: 5px; }
                    .receipt-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
                    .receipt-header div:nth-child(2) { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
                    .receipt-header p, .receipt-header div { font-size: 18px; font-weight: bold; }
                    .totals-row { display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-bottom: 5px; }
                    .grand-total { font-size: 26px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
                    .qr-container { text-align: center; margin-top: 20px; padding-bottom: 30px; }
                    .qr-container img { display: block; margin: 0 auto; width: 200px; height: 200px; }
                    #sunmi-native-qr { display: none; }
                    
                    @media print {
                        @page { margin: 0; size: 80mm auto; }
                        body { margin: 0; width: 80mm; }
                    }
                </style>
            </head>
            <body>
                <div id="rtl-wrapper">
                    \${receiptHTML}
                    <div class="qr-container">
                        <img src="\${qrDataUrl}" />
                    </div>
                </div>
            </body>
            </html>
            \`);
            doc.close();`;

const newStr = `            const doc = iframe.contentWindow.document;
            doc.open();
            const printContent = \`
            <html dir="rtl">
            <head>
                <title>فاتورة سحاب</title>
                <style>
                    @page { margin: 0; size: 80mm auto; }
                    body { margin: 0; padding: 0; background: white; display: flex; justify-content: center; font-family: system-ui, sans-serif; }
                    #receipt-wrapper { width: 300px; max-width: 100%; padding: 10px; box-sizing: border-box; color: black; margin: 0 auto; }
                    * { color: black !important; }
                    .receipt-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
                    .receipt-header div:nth-child(2) { font-size: 20px; font-weight: 900; margin-bottom: 5px; }
                    .receipt-header p, .receipt-header div { font-size: 13px; font-weight: bold; margin: 3px 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; }
                    td, th { font-size: 13px; font-weight: bold; padding: 6px 0; border-bottom: 1px dashed #ccc; }
                    th:nth-child(1), td:nth-child(1) { text-align: right; width: 45%; padding-right: 2px; }
                    th:nth-child(2), td:nth-child(2) { text-align: center; width: 15%; }
                    th:nth-child(3), td:nth-child(3) { text-align: left; width: 40%; padding-left: 2px; }
                    .totals-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-bottom: 6px; }
                    .grand-total { font-size: 18px; font-weight: 900; border-top: 2px solid #000; padding-top: 10px; margin-bottom: 10px; }
                    .qr-container { text-align: center; margin-top: 10px; padding-bottom: 20px; }
                    /* STRICTLY SMALL QR CODE */
                    .qr-container img { display: block; margin: 0 auto; width: 90px; height: 90px; }
                    #sunmi-native-qr { display: none; }
                </style>
            </head>
            <body>
                <div id="receipt-wrapper">
                    \${receiptHTML}
                    <div class="qr-container">
                        <img src="\${qrDataUrl}" />
                    </div>
                </div>
            </body>
            </html>
            \`;
            
            doc.write(printContent);
            doc.close();`;

let normalizedCode = code.replace(/\\r\\n/g, '\\n');
let normalizedTarget = targetStr.replace(/\\r\\n/g, '\\n');

if (!normalizedCode.includes(normalizedTarget)) {
    console.error("Target string not found!");
    process.exit(1);
}

const finalCode = normalizedCode.replace(normalizedTarget, newStr);
fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', finalCode, 'utf8');
console.log("REPLACED SUCCESSFULLY!");
