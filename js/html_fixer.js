const fs = require('fs');
let html = fs.readFileSync('c:/Users/rawi1/Desktop/Sahab_POS/index.html', 'utf8');

const startMarker = '<i class="fa-solid fa-eye"></i> \u0625\u0638\u0647\u0627\u0631 \u0623\u062f\u0627\u0629 \u0627\u0644\u0627\u0633\u062a\u064a\u0631\u0627\u062f \u0627\u0644\u062c\u0645\u0627\u0639\u064a';
const endMarker = '</script>';

const startIdx = html.indexOf(startMarker);
if (startIdx === -1) { console.log('START NOT FOUND'); process.exit(1); }

// Find the line start (go back to the previous newline)
const lineStart = html.lastIndexOf('\n', startIdx) + 1;

// Find the end (the </script> after startIdx)
const endIdx = html.indexOf(endMarker, startIdx);
if (endIdx === -1) { console.log('END NOT FOUND'); process.exit(1); }
const lineEnd = endIdx + endMarker.length;

// Also consume any trailing newline after </script>
const afterScript = html.slice(lineEnd, lineEnd + 2);
const cutEnd = afterScript.startsWith('\r\n') ? lineEnd + 2 : (afterScript.startsWith('\n') ? lineEnd + 1 : lineEnd);

console.log('Removing chars', lineStart, 'to', cutEnd);
console.log('Content being removed:', JSON.stringify(html.slice(lineStart, cutEnd).substring(0, 100)));

const fixed = html.slice(0, lineStart) + html.slice(cutEnd);
fs.writeFileSync('c:/Users/rawi1/Desktop/Sahab_POS/index.html', fixed, 'utf8');
console.log('DONE! File fixed.');
