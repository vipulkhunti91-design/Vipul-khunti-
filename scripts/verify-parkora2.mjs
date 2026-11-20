import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9237;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=' + PORT, '--headless=new', '--disable-gpu',
  '--window-size=1400,900',
  '--user-data-dir=' + process.env.TEMP + '\\chrome_ss2_' + Date.now(),
  'about:blank'
]);

let targets;
for (let i = 0; i < 15; i++) {
  await sleep(400);
  try { targets = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json(); if (targets?.length) break; } catch {}
}

const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });

let msgId = 1;
const pending = new Map();
ws.onmessage = e => { const d = JSON.parse(e.data); if (d.id && pending.has(d.id)) { pending.get(d.id).resolve(d.result); pending.delete(d.id); } };
const send = (method, params) => new Promise(r => { const id = msgId++; pending.set(id, { resolve: r }); ws.send(JSON.stringify({ id, method, params: params || {} })); });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:5173/work/parkora' });
await sleep(4000);

// Scroll to Final UI section
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight - 1200)' });
await sleep(2000);

const ss1 = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('d:\\VIPUL_1\\VIPUL.1\\parkora-finalui.png', Buffer.from(ss1.data, 'base64'));
console.log('Saved parkora-finalui.png');

// Scroll to wireframes
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight - 2200)' });
await sleep(2000);

const ss2 = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('d:\\VIPUL_1\\VIPUL.1\\parkora-wireframes.png', Buffer.from(ss2.data, 'base64'));
console.log('Saved parkora-wireframes.png');

// Also check homepage card
await send('Page.navigate', { url: 'http://localhost:5173/' });
await sleep(3000);

// Scroll to Selected Projects
await send('Runtime.evaluate', { expression: 'document.querySelector("[id*=project], [class*=project]")?.scrollIntoView({behavior:"instant"})' });
await sleep(1000);

const ss3 = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('d:\\VIPUL_1\\VIPUL.1\\parkora-homepage.png', Buffer.from(ss3.data, 'base64'));
console.log('Saved parkora-homepage.png');

ws.close();
chrome.kill();
