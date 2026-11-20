import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9233
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const outDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\parkora'

const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; background:#fff;">
<img id="pdf" src="/projects/parkora/pdf_full_render.png" />
<canvas id="c"></canvas>
<script>
window.getCropData = async function() {
  const img = document.getElementById('pdf');
  await new Promise(r => { if (img.complete) r(); else img.onload = r; });
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const canvas = document.getElementById('c');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const idata = ctx.getImageData(0, 0, W, H);
  const data = idata.data;

  console.log('Image dimensions:', W, H);

  // Top screens: sample x at y = 400
  const yTop = 400;
  const topColumns = [];
  for (let x = 0; x < W; x++) {
    const idx = (yTop * W + x) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const isContent = !(r > 245 && g > 245 && b > 245);
    topColumns.push(isContent);
  }

  const topSpans = [];
  let inSpan = false;
  let startX = 0;
  for (let x = 0; x < W; x++) {
    if (topColumns[x] && !inSpan) {
      inSpan = true;
      startX = x;
    } else if (!topColumns[x] && inSpan) {
      if (x - startX > 80) {
        topSpans.push({ startX, endX: x, width: x - startX });
      }
      inSpan = false;
    }
  }
  if (inSpan && W - startX > 80) {
    topSpans.push({ startX, endX: W, width: W - startX });
  }

  // Bottom screen: sample x at y = 1200
  const yBottom = 1200;
  const bottomColumns = [];
  for (let x = 0; x < W; x++) {
    const idx = (yBottom * W + x) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const isContent = !(r > 245 && g > 245 && b > 245);
    bottomColumns.push(isContent);
  }
  const bottomSpans = [];
  inSpan = false;
  startX = 0;
  for (let x = 0; x < W; x++) {
    if (bottomColumns[x] && !inSpan) {
      inSpan = true;
      startX = x;
    } else if (!bottomColumns[x] && inSpan) {
      if (x - startX > 80) {
        bottomSpans.push({ startX, endX: x, width: x - startX });
      }
      inSpan = false;
    }
  }

  function getVerticalBounds(x1, x2, yMin, yMax) {
    let topY = yMax;
    let bottomY = yMin;
    for (let y = yMin; y < yMax; y++) {
      let hasContent = false;
      for (let x = x1; x < x2; x += 4) {
        const idx = (y * W + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (!(r > 245 && g > 245 && b > 245)) {
          hasContent = true;
          break;
        }
      }
      if (hasContent) {
        if (y < topY) topY = y;
        if (y > bottomY) bottomY = y;
      }
    }
    return { topY, bottomY, height: bottomY - topY };
  }

  const topBoxes = topSpans.map(s => {
    const v = getVerticalBounds(s.startX, s.endX, 50, Math.floor(H * 0.6));
    return { x: s.startX, y: v.topY, w: s.width, h: v.height };
  });

  const bottomBoxes = bottomSpans.map(s => {
    const v = getVerticalBounds(s.startX, s.endX, Math.floor(H * 0.45), H);
    return { x: s.startX, y: v.topY, w: s.width, h: v.height };
  });

  return { W, H, topBoxes, bottomBoxes };
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

fs.writeFileSync(path.join(outDir, 'detect.html'), html)

async function detectAndCrop() {
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_detect_' + Date.now(),
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
  await send('Page.navigate', { url: 'http://localhost:5173/projects/parkora/detect.html' })
  await sleep(3000)

  const detected = await send('Runtime.evaluate', {
    expression: 'window.getCropData()',
    awaitPromise: true,
    returnByValue: true,
  })

  console.log('Detection results:', JSON.stringify(detected.result.value, null, 2))

  const { topBoxes, bottomBoxes } = detected.result.value

  const boxes = {
    'final-nearby': topBoxes[0],
    'final-profile': topBoxes[1],
    'final-booking': topBoxes[2],
    'final-profile-edit': topBoxes[3],
    'final-history': topBoxes[4],
    'final-details': bottomBoxes[0],
  }

  console.log('Cropping boxes:', boxes)

  const cropped = await send('Runtime.evaluate', {
    expression: `window.cropRegions(${JSON.stringify(boxes)})`,
    awaitPromise: true,
    returnByValue: true,
  })

  for (const [name, b64] of Object.entries(cropped.result.value)) {
    const filePath = path.join(outDir, `${name}.png`)
    fs.writeFileSync(filePath, Buffer.from(b64, 'base64'))
    console.log(`Saved ${filePath}`)
  }

  ws.close()
  chromeProcess.kill()
}

detectAndCrop().catch(console.error)
