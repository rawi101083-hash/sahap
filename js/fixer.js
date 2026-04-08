const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const replacement = `
            // Remove old frame if exists instead of auto-deleting it on timer
            const oldFrame = document.getElementById('universal-print-frame');
            if (oldFrame) oldFrame.remove();

            const iframe = document.createElement('iframe');
            iframe.id = 'universal-print-frame';
            // Make it 1px to bypass PC blocks, but invisible to the user
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.style.opacity = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow.document;
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
            doc.close();

            // Give it half a second to render, then open PC print dialog
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                if (originalBtn) originalBtn.innerHTML = origHTML;
            }, 500);
`;

const regex = /\/\/\s*Remove old frame if exists instead of auto-deleting it on timer[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 500\);/;

if (regex.test(content)) {
    content = content.replace(regex, replacement.trim());
    fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
    console.log("REPLACED EXACTLY");
} else {
    console.log("REGEX FAILED");
}
