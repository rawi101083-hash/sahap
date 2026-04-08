const fs = require('fs');
let html = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/index.html', 'utf8');

const errorCatcher = `
<script>
window.addEventListener('error', function(e) {
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:rgba(255,0,0,0.9);color:#fff;z-index:999999;padding:20px;font-size:24px;font-family:monospace;white-space:pre-wrap;box-sizing:border-box;max-height:100vh;overflow:auto;';
    errDiv.innerHTML = "<h1>💥 CRITICAL ERROR CAUGHT 💥</h1><br><b>Message:</b> " + e.message + "<br><br><b>Stack:</b> " + (e.error ? e.error.stack : 'N/A');
    document.body.appendChild(errDiv);
});
window.addEventListener('unhandledrejection', function(event) {
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:rgba(255,0,0,0.9);color:#fff;z-index:999999;padding:20px;font-size:24px;font-family:monospace;white-space:pre-wrap;box-sizing:border-box;max-height:100vh;overflow:auto;';
    errDiv.innerHTML = "<h1>💥 UNHANDLED PROMISE REJECTION 💥</h1><br><b>Reason:</b> " + (event.reason ? (event.reason.stack || event.reason) : 'No reason provided');
    document.body.appendChild(errDiv);
});
</script>
`;

if (!html.includes('CRITICAL ERROR CAUGHT')) {
    html = html.replace('</head>', errorCatcher + '\n</head>');
    fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/index.html', html, 'utf8');
}
