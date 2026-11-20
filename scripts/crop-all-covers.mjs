import { spawn } from 'child_process'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9265
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const p = spawn(CHROME_PATH, [
    '--remote-debugging-port=' + PORT,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_crop_' + Date.now(),
    'about:blank',
  ])

  let targets = null
  for (let i = 0; i < 20; i++) {
    await sleep(300)
    try {
      const res = await fetch('http://127.0.0.1:' + PORT + '/json')
      targets = await res.json()
      if (targets && targets.length > 0) break
    } catch {}
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0]
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))

  let id = 1
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const msgId = id++
      const handler = (event) => {
        const d = JSON.parse(event.data)
        if (d.id === msgId) {
          ws.removeEventListener('message', handler)
          if (d.error) reject(d.error)
          else resolve(d.result)
        }
      }
      ws.addEventListener('message', handler)
      ws.send(JSON.stringify({ id: msgId, method, params }))
    })

  await send('Page.enable')

  // Convert all_covers_render.png to base64 inline in HTML to avoid any CORS/file:// issues
  const base64Data = fs.readFileSync('d:/VIPUL_1/all_covers_render.png').toString('base64')
  const html = `
<!DOCTYPE html>
<html>
<body>
<img id="srcImg" src="data:image/png;base64,${base64Data}" />
<script>
window.analyze = function() {
  const img = document.getElementById('srcImg');
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const w = c.width;
  const h = c.height;
  const data = ctx.getImageData(0, 0, w, h).data;

  // Viewer background color
  const bgR = data[0], bgG = data[1], bgB = data[2];

  function isBg(r, g, b) {
    return Math.abs(r - bgR) < 18 && Math.abs(g - bgG) < 18 && Math.abs(b - bgB) < 18;
  }

  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const i = (y * w + x) * 4;
      if (!isBg(data[i], data[i+1], data[i+2])) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { w, h, bg: [bgR, bgG, bgB], minX, maxX, minY, maxY, contentW: maxX - minX, contentH: maxY - minY };
};

window.crop = function(x, y, w, h) {
  const img = document.getElementById('srcImg');
  const c = document.createElement('canvas');
  c.width = Math.round(w);
  c.height = Math.round(h);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
  return c.toDataURL('image/png').replace(/^data:image\\/png;base64,/, '');
};
</script>
</body>
</html>
`
  fs.writeFileSync('d:/VIPUL_1/detect_inline.html', html)
  await send('Page.navigate', { url: 'file:///d:/VIPUL_1/detect_inline.html' })
  await sleep(1500)

  const res = await send('Runtime.evaluate', {
    expression: 'window.analyze()',
    returnByValue: true,
  })

  console.log('Detection result:', res.result.value)
  const { minX, minY, contentW, contentH } = res.result.value
  const panelW = contentW / 5

  const panels = [
    { name: 'phtopy', x: minX + 0 * panelW, y: minY, w: panelW, h: contentH },
    { name: 'parkora', x: minX + 1 * panelW, y: minY, w: panelW, h: contentH },
    { name: 'sanjivni', x: minX + 2 * panelW, y: minY, w: panelW, h: contentH },
    { name: 'red-bus-kids', x: minX + 3 * panelW, y: minY, w: panelW, h: contentH },
    { name: 'indu-cafe', x: minX + 4 * panelW, y: minY, w: panelW, h: contentH },
  ]

  for (const pnl of panels) {
    const cropRes = await send('Runtime.evaluate', {
      expression: `window.crop(${pnl.x}, ${pnl.y}, ${pnl.w}, ${pnl.h})`,
      returnByValue: true,
    })

    const buf = Buffer.from(cropRes.result.value, 'base64')
    const outDir = `d:/VIPUL_1/VIPUL.1/public/projects/${pnl.name}`
    fs.mkdirSync(outDir, { recursive: true })
    const outPath = `${outDir}/cover.png`
    fs.writeFileSync(outPath, buf)
    console.log(`Saved ${outPath}, size: ${buf.length} bytes`)
  }

  ws.close()
  p.kill()
}

run().catch(console.error)
