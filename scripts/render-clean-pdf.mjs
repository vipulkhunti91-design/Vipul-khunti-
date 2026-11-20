import { spawn } from 'child_process'
import fs from 'fs'
import http from 'http'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9256
const HTTP_PORT = 8089
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const pdfBytes = fs.readFileSync('d:/VIPUL_1/covers.pdf')
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; background:#333; overflow:hidden;">
<canvas id="c"></canvas>
<script type="module">
  import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs';
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

  async function load() {
    const resp = await fetch('/covers.pdf');
    const arrayBuffer = await resp.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log('PDF pages:', pdf.numPages);
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.getElementById('c');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    window.pdfReady = { width: viewport.width, height: viewport.height, numPages: pdf.numPages };
  }
  load().catch(e => { window.pdfError = e.message; });
</script>
</body>
</html>
`

  const server = http.createServer((req, res) => {
    if (req.url === '/covers.pdf') {
      res.writeHead(200, { 'Content-Type': 'application/pdf' })
      res.end(pdfBytes)
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)
    }
  })

  await new Promise((resolve) => server.listen(HTTP_PORT, resolve))
  console.log('Server listening on port', HTTP_PORT)

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
  await send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` })

  let ready = null
  for (let i = 0; i < 30; i++) {
    await sleep(500)
    const res = await send('Runtime.evaluate', {
      expression: '({ ready: window.pdfReady, error: window.pdfError })',
      returnByValue: true,
    })
    console.log('Poll:', res.result.value)
    if (res.result.value.ready || res.result.value.error) {
      ready = res.result.value
      break
    }
  }

  if (ready && ready.ready) {
    const cWidth = ready.ready.width
    const cHeight = ready.ready.height
    console.log('Canvas rendered dimensions:', cWidth, 'x', cHeight)

    await send('Emulation.setDeviceMetricsOverride', {
      width: Math.ceil(cWidth),
      height: Math.ceil(cHeight),
      deviceScaleFactor: 1,
      mobile: false,
    })

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: cWidth, height: cHeight, scale: 1 },
    })
    fs.writeFileSync('d:/VIPUL_1/clean_pdf_render.png', Buffer.from(shot.data, 'base64'))
    console.log('Saved d:/VIPUL_1/clean_pdf_render.png successfully!')
  }

  ws.close()
  p.kill()
  server.close()
}

run().catch(console.error)
