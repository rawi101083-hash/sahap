const fs = require('fs');
const vm = require('vm');
const path = require('path');
const appPath = path.resolve('c:/Users/rawi1/Desktop/Sahab_POS/js/app.js');
const code = fs.readFileSync(appPath, 'utf8');

const sandbox = {
  console: console,
  window: {
    addEventListener: () => {},
    location: {protocol: 'file:'},
    onerror: () => {},
    isDataInitialized: false,
    __syncingFromFirebase: false,
    appLogic: {}
  },
  document: { 
     getElementById: () => ({ style: {}, classList: {remove:()=>{}, add:()=>{}}, innerHTML: '', value: '' }), 
     querySelector: () => ({ style: {}, classList: {remove:()=>{}, add:()=>{}} }), 
     addEventListener: () => {} 
  },
  navigator: { language: 'en-US' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  setTimeout: setTimeout,
  localforage: { setItem: () => {}, getItem: () => null, config: () => {} },
  firebase: { auth: () => ({ onAuthStateChanged: () => {} }), database: () => ({ ref: () => ({ once: () => {}, on: () => {} }) }) },
  DefaultServices: [],
  DefaultDeliveryOptions: [],
  btoa: () => '',
  atob: () => '',
  alert: console.log,
  confirm: () => true
};
sandbox.window.document = sandbox.document;

const script = new vm.Script(code);
try {
  script.runInNewContext(sandbox);
  
  if (sandbox.window.appLogic && sandbox.window.appLogic.init) {
      sandbox.window.appLogic.init().then(() => {
          fs.writeFileSync('C:/Users/rawi1/Desktop/Sahab_POS/trace.txt', 'NO RUNTIME ERROR INIT');
      }).catch(e => {
          fs.writeFileSync('C:/Users/rawi1/Desktop/Sahab_POS/trace.txt', 'INIT ERROR:\n' + String(e.stack));
      });
  } else {
      fs.writeFileSync('C:/Users/rawi1/Desktop/Sahab_POS/trace.txt', 'RUN NO ERROR, BUT NO APPLOGIC');
  }

} catch (e) {
  fs.writeFileSync('C:/Users/rawi1/Desktop/Sahab_POS/trace.txt', 'MAIN SCRIPT ERROR:\n' + String(e.stack));
}
