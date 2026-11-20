/**
 * Crop 6 final UI screens from pdf_full_render.png using Chrome headless.
 * Uses the exact bounding boxes measured in the previous session.
 */
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9235
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const outDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\parkora'

// Exact bounding boxes from measurement (the full render is 2560x1800)
const BOXES = {
  'final-nearby':       { x: 312, y: 114, w: 350, h: 764 },
  'final-profile':      { x: 686, y: 150, w: 350, h: 764 },
  'final-booking':      { x: 1066, y: 150, w: 350, h: 764 },
  'final-profile-edit': { x: 1445, y: 150, w: 350, h: 764 },
  'final-history':      { x: 2204, y: 150, w: 350, h: 764 },
  'final-details':      { x: 1825, y: 917, w: 350, h: 764 },
}

const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; background:#fff;">
<img id="pdf" src="/projects/parkora/pdf_full_render.png" />
<script>
window.cropAll = function() {
  const img = document.getElementById('pdf');
  const boxes = ${JSON.stringify(BOXES)};
  const results = {};
  for (const [name, b] of Object.entries(boxes)) {
    const c = document.createElement('canvas');
    c.width = b.w;
    c.height = b.h;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, b.x, b.y, b.w, b.h, 0, 0, b.w, b.h);
    results[name] = c.toDataURL('image/png').replace(/^data:image\\/png;base64,/, '');
  }
  return results;
};
</script>
</body>
</html>
`

fs.writeFileSync(path.join(outDir, 'crop.html'), html)

async function run() {
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_crop_' + Date.now(),
    'about:blank',
  ])

  let targets = null
  for (let i = 0; i < 20; i++) {
    await sleep(400)
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`)
      targets = await res.json()
      if (targets?.length > 0) break
    } catch {}
  }

  if (!targets || targets.length === 0) {
    console.error('Could not connect to Chrome')
    chromeProcess.kill()
    process.exit(1)
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
  await send('Page.navigate', { url: 'http://localhost:5173/projects/parkora/crop.html' })
  await sleep(3000) // wait for image to load

  // Verify image loaded
  const imgCheck = await send('Runtime.evaluate', {
    expression: 'document.getElementById("pdf").naturalWidth',
    returnByValue: true,
  })
  console.log('Image natural width:', imgCheck.result.value)

  const cropped = await send('Runtime.evaluate', {
    expression: 'window.cropAll()',
    returnByValue: true,
  })

  for (const [name, b64] of Object.entries(cropped.result.value)) {
    const filePath = path.join(outDir, `${name}.png`)
    fs.writeFileSync(filePath, Buffer.from(b64, 'base64'))
    const stats = fs.statSync(filePath)
    console.log(`Saved ${name}.png (${Math.round(stats.size / 1024)} KB)`)
  }

  ws.close()
  chromeProcess.kill()
  console.log('Done!')
}

run().catch(console.error)
