import { spawn } from 'child_process'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9248
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const p = spawn(CHROME_PATH, [
    '--remote-debugging-port=' + PORT,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_measure_' + Date.now(),
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 3200,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false,
  })

  // We can load an HTML page that displays all_covers_render.png on a canvas and analyzes pixel columns
  const html = `
    <!DOCTYPE html>
    <html><body>
    <img id="img" src="file:///d:/VIPUL_1/all_covers_render.png" />
    <canvas id="c"></canvas>
    </body></html>
  `
  fs.writeFileSync('d:/VIPUL_1/analyze.html', html)
  await send('Page.navigate', { url: 'file:///d:/VIPUL_1/analyze.html' })
  await sleep(1500)

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const img = document.getElementById('img');
        const c = document.getElementById('c');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Find the bounding box of the non-dark/non-background content
        const w = c.width;
        const h = c.height;
        const data = ctx.getImageData(0, 0, w, h).data;

        // Find top, bottom bounds of the strip
        // Find left and right bounds of the whole PDF strip
        let minX = w, maxX = 0, minY = h, maxY = 0;
        
        // Scan a grid to find content boundaries
        for (let y = 0; y < h; y += 4) {
          for (let x = 0; x < w; x += 4) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            // Chrome PDF viewer background is usually #525659 or similar gray (rgb around 82, 86, 89)
            // or white/transparent. Let's sample the top-left corner as viewer background
            const isBg = (r > 70 && r < 95 && g > 75 && g < 100 && b > 80 && b < 105);
            if (!isBg && a > 0) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        return { w, h, minX, maxX, minY, maxY };
      })()
    `,
    returnByValue: true,
  })

  console.log('Analysis result:', res.result.value)
  ws.close()
  p.kill()
}

run().catch(console.error)
