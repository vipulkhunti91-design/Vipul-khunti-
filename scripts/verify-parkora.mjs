import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9236;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=' + PORT, '--headless=new', '--disable-gpu',
  '--window-size=1400,900',
  '--user-data-dir=' + process.env.TEMP + '\\chrome_ss_' + Date.now(),
  'about:blank'
]);

let targets;
for (let i = 0; i < 15; i++) {
  await sleep(400);
  try { targets = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); if (targets?.length) break; } catch {}
}

if (!targets?.length) { console.error('No Chrome targets'); chrome.kill(); process.exit(1); }

const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });

let msgId = 1;
const pending = new Map();
ws.onmessage = e => { const d = JSON.parse(e.data); if (d.id && pending.has(d.id)) { pending.get(d.id).resolve(d.result); pending.delete(d.id); } };
const send = (method, params) => new Promise(r => { const id = msgId++; pending.set(id, { resolve: r }); ws.send(JSON.stringify({ id, method, params: params || {} })); });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 5000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:5173/work/parkora' });
await sleep(4000);

// Scroll to trigger lazy loading
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
await sleep(2000);
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
await sleep(1000);

// Check content
const result = await send('Runtime.evaluate', {
  expression: `(function() {
    var sections = document.querySelectorAll('h2, h3');
    var titles = Array.from(sections).map(function(s) { return s.textContent.trim(); });
    var imgs = document.querySelectorAll('img[src*="final-"]');
    var imgInfo = Array.from(imgs).map(function(i) { return i.src + ' loaded:' + i.complete + ' w:' + i.naturalWidth; });
    var wireImgs = document.querySelectorAll('img[src*="wire-"]');
    var wireInfo = Array.from(wireImgs).map(function(i) { return i.src + ' loaded:' + i.complete + ' w:' + i.naturalWidth; });
    var links = document.querySelectorAll('a[href*="figma.com/proto"]');
    var linkInfo = Array.from(links).map(function(l) { return l.textContent.trim(); });
    return JSON.stringify({ titles: titles, finalImgs: imgInfo, wireImgs: wireInfo, protoLinks: linkInfo }, null, 2);
  })()`,
  returnByValue: true
});

console.log(result.value);

// Take screenshot
const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
fs.writeFileSync('d:\\VIPUL_1\\VIPUL.1\\parkora-verify.png', Buffer.from(screenshot.data, 'base64'));
console.log('Screenshot saved to parkora-verify.png');

ws.close();
chrome.kill();
