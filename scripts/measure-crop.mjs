import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9234
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const outDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\parkora'

const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; background:#fff;">
<img id="pdf" src="/projects/parkora/pdf_full_render.png" />
<canvas id="c"></canvas>
<script>
window.measureScreens = async function() {
  const img = document.getElementById('pdf');
  await new Promise(r => { if (img.complete) r(); else img.onload = r; });
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const canvas = document.getElementById('c');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  function getPixel(x, y) {
    const d = ctx.getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  }

  // Find exact left and right of each screen by scanning horizontally
  // Each screen has a dark blue/navy header and background
  // Profile (screen 2) is around x = 800, y = 300
  // Let's find exact x boundaries for screen 2
  let s2_x1 = 0, s2_x2 = 0;
  for (let x = 650; x < 750; x++) {
    const [r, g, b] = getPixel(x, 400);
    if (b > 50 && r < 50) { s2_x1 = x; break; }
  }
  for (let x = s2_x1 + 300; x < s2_x1 + 450; x++) {
    const [r, g, b] = getPixel(x, 400);
    if (r > 240 && g > 240 && b > 240) { s2_x2 = x; break; }
  }

  // Check height of screen 2
  let s2_y1 = 0, s2_y2 = 0;
  for (let y = 100; y < 200; y++) {
    const [r, g, b] = getPixel(s2_x1 + 50, y);
    if (b > 50 && r < 50) { s2_y1 = y; break; }
  }
  for (let y = s2_y1 + 600; y < s2_y1 + 950; y++) {
    const [r, g, b] = getPixel(s2_x1 + 50, y);
    if (r > 240 && g > 240 && b > 240) { s2_y2 = y; break; }
  }

  const screenW = s2_x2 - s2_x1;
  const screenH = s2_y2 - s2_y1;

  // Now scan other screens:
  // Screen 1: Nearby Parking (around x ~ 310)
  let s1_x1 = 0;
  for (let x = 300; x < 400; x++) {
    const [r, g, b] = getPixel(x, 400);
    if (b > 50 && r < 50) { s1_x1 = x; break; }
  }
  let s1_y1 = 0, s1_y2 = 0;
  for (let y = 50; y < 200; y++) {
    const [r, g, b] = getPixel(s1_x1 + 50, y);
    if (b > 50 && r < 50) { s1_y1 = y; break; }
  }
  for (let y = s1_y1 + 600; y < s1_y1 + 950; y++) {
    const [r, g, b] = getPixel(s1_x1 + 50, y);
    if (r > 240 && g > 240 && b > 240) { s1_y2 = y; break; }
  }

  // Screen 3: Booking Details (around x ~ 1060)
  let s3_x1 = 0;
  for (let x = 1000; x < 1150; x++) {
    const [r, g, b] = getPixel(x, 400);
    if (b > 50 && r < 50) { s3_x1 = x; break; }
  }

  // Screen 4: Profile Edit (around x ~ 1440)
  let s4_x1 = 0;
  for (let x = 1400; x < 1550; x++) {
    const [r, g, b] = getPixel(x, 400);
    if (b > 50 && r < 50) { s4_x1 = x; break; }
  }

  // Screen 5: History (around x ~ 2200)
  let s5_x1 = 0;
  for (let x = 2150; x < 2300; x++) {
    const [r, g, b] = getPixel(x, 400);
    if (b > 50 && r < 50) { s5_x1 = x; break; }
  }

  // Screen 6: Details (around x ~ 1820, y ~ 900)
  let s6_x1 = 0, s6_y1 = 0, s6_y2 = 0;
  for (let x = 1750; x < 1900; x++) {
    const [r, g, b] = getPixel(x, 1100);
    if (b > 50 && r < 50) { s6_x1 = x; break; }
  }
  for (let y = 800; y < 1000; y++) {
    const [r, g, b] = getPixel(s6_x1 + 50, y);
    if (b > 50 && r < 50) { s6_y1 = y; break; }
  }
  for (let y = s6_y1 + 600; y < s6_y1 + 950; y++) {
    const [r, g, b] = getPixel(s6_x1 + 50, y);
    if (r > 240 && g > 240 && b > 240) { s6_y2 = y; break; }
  }

  return {
    screenW,
    screenH,
    s1: { x: s1_x1, y: s1_y1, w: screenW, h: (s1_y2 ? s1_y2 - s1_y1 : screenH) },
    s2: { x: s2_x1, y: s2_y1, w: screenW, h: screenH },
    s3: { x: s3_x1, y: s2_y1, w: screenW, h: screenH },
    s4: { x: s4_x1, y: s2_y1, w: screenW, h: screenH },
    s5: { x: s5_x1, y: s2_y1, w: screenW, h: screenH },
    s6: { x: s6_x1, y: s6_y1, w: screenW, h: (s6_y2 ? s6_y2 - s6_y1 : screenH) }
  };
};

window.cropRegions = function(boxes) {
  const img = document.getElementById('pdf');
  const results = {};
  for (const [name, b] of Object.entries(boxes)) {
    const oc = document.createElement('canvas');
    oc.width = b.w;
    oc.height = b.h;
    const octx = oc.getContext('2d');
    octx.drawImage(img, b.x, b.y, b.w, b.h, 0, 0, b.w, b.h);
    results[name] = oc.toDataURL('image/png').replace(/^data:image\\/png;base64,/, '');
  }
  return results;
};
</script>
</body>
</html>
`

fs.writeFileSync(path.join(outDir, 'measure.html'), html)

async function runMeasure() {
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_measure_' + Date.now(),
    'about:blank',
  ])

  let targets = null
  for (let i = 0; i < 20; i++) {
    await sleep(300)
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`)
      targets = await res.json()
      if (targets && targets.length > 0) break
    } catch {}
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0]
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl)
  await new Promise((resolve) => (ws.onopen = resolve))

  let msgId = 1
  const pending = new Map()
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id)
      pending.delete(data.id)
      if (data.error) reject(data.error)
      else resolve(data.result)
    }
  }

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params }))
    })
  }

  await send('Page.enable')
  await send('Page.navigate', { url: 'http://localhost:5173/projects/parkora/measure.html' })
  await sleep(2500)

  const measured = await send('Runtime.evaluate', {
    expression: 'window.measureScreens()',
    awaitPromise: true,
    returnByValue: true,
  })

  console.log('Measured boxes:', JSON.stringify(measured.result.value, null, 2))

  const m = measured.result.value
  const boxes = {
    'final-nearby': m.s1,
    'final-profile': m.s2,
    'final-booking': m.s3,
    'final-profile-edit': m.s4,
    'final-history': m.s5,
    'final-details': m.s6,
  }

  const cropped = await send('Runtime.evaluate', {
    expression: `window.cropRegions(${JSON.stringify(boxes)})`,
    awaitPromise: true,
    returnByValue: true,
  })

  for (const [name, b64] of Object.entries(cropped.result.value)) {
    const filePath = path.join(outDir, `${name}.png`)
    fs.writeFileSync(filePath, Buffer.from(b64, 'base64'))
    console.log(`Successfully saved ${filePath}`)
  }

  ws.close()
  chromeProcess.kill()
}

runMeasure().catch(console.error)
