const fs = require('fs');
let content = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', 'utf8');

const newHTML = `            <html dir="rtl">
            <head>
                <title>فاتورة سحاب</title>
                <style>
                    /* Force browser to recognize this as thermal roll paper */
                    @page { 
                        margin: 0; 
                        size: 80mm auto; 
                    }
                    
                    body { 
                        margin: 0; 
                        padding: 0; 
                        background: white; 
                        display: flex;
                        justify-content: center; /* Force centering */
                        font-family: system-ui, -apple-system, sans-serif; 
                    }
                    
                    /* The main receipt container - strictly mimics 80mm paper */
                    #receipt-wrapper { 
                        width: 300px; /* ~80mm width */
                        max-width: 100%;
                        padding: 10px; 
                        box-sizing: border-box;
                        color: black;
                        margin: 0 auto;
                    }
                    
                    * { color: black !important; }
                    
                    .receipt-header { 
                        text-align: center; 
                        border-bottom: 2px dashed #000; 
                        padding-bottom: 10px; 
                        margin-bottom: 15px; 
                    }
                    .receipt-header div:nth-child(2) { font-size: 20px; font-weight: 900; margin-bottom: 5px; }
                    .receipt-header p, .receipt-header div { font-size: 13px; font-weight: bold; margin: 3px 0; }
                    
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 15px; 
                        table-layout: fixed; 
                    }
                    td, th { 
                        font-size: 13px; 
                        font-weight: bold; 
                        padding: 8px 0; 
                        border-bottom: 1px dashed #ccc; 
                    }
                    th:nth-child(1), td:nth-child(1) { text-align: right; width: 45%; padding-right: 2px; }
                    th:nth-child(2), td:nth-child(2) { text-align: center; width: 15%; }
                    th:nth-child(3), td:nth-child(3) { text-align: left; width: 40%; padding-left: 2px; }
                    
                    .totals-row { 
                        display: flex; 
                        justify-content: space-between; 
                        font-size: 14px; 
                        font-weight: bold; 
                        margin-bottom: 6px; 
                    }
                    .grand-total { 
                        font-size: 18px; 
                        font-weight: 900; 
                        border-top: 2px solid #000; 
                        padding-top: 10px; 
                        margin-top: 10px; 
                    }
                    
                    .qr-container { 
                        text-align: center; 
                        margin-top: 20px; 
                        padding-bottom: 20px; 
                    }
                    .qr-container img { 
                        display: block; 
                        margin: 0 auto; 
                        width: 130px; 
                        height: 130px; 
                    }
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
            </html>`;

content = content.replace(/<html dir="rtl">[\s\S]*?<\/html>/, newHTML);

fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js', content, 'utf8');
console.log('REPLACING UI IN INVOICE HTML DONE');
