import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9230
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const pdfUrl = 'file:///C:/Users/DELL/.gemini/antigravity/brain/b43da6cb-71c2-41f5-880c-3c939bec50f5/.user_uploaded/media_1795158865370_d497cc15.pdf'
const outDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\parkora'

async function renderPdf() {
  console.log('Rendering PDF in Chrome...')

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_pdf_render_' + Date.now(),
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

  // Set high resolution viewport to capture sharp screens
  await send('Emulation.setDeviceMetricsOverride', {
    width: 2560,
    height: 1800,
    deviceScaleFactor: 1,
    mobile: false,
  })

  await send('Page.navigate', { url: pdfUrl })
  await sleep(3000)

  const shot = await send('Page.captureScreenshot', { format: 'png' })
  const buf = Buffer.from(shot.data, 'base64')
  fs.writeFileSync(path.join(outDir, 'pdf_full_render.png'), buf)
  console.log('Saved pdf_full_render.png, size:', buf.length)

  ws.close()
  chromeProcess.kill()
}

renderPdf().catch(console.error)
