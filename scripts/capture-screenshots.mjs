import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9222
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5'
const WORKSPACE_SCREENSHOTS = 'd:\\VIPUL_1\\VIPUL.1\\qa-screenshots'

if (!fs.existsSync(WORKSPACE_SCREENSHOTS)) {
  fs.mkdirSync(WORKSPACE_SCREENSHOTS, { recursive: true })
}

async function captureScreenshotsAndVerify() {
  console.log('--- Starting Screenshot Capture & Complete Verification ---')

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_qa_shots_' + Date.now(),
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

  await new Promise((resolve) => {
    ws.onopen = resolve
  })

  let msgId = 1
  const pending = new Map()

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result)
      pending.delete(data.id)
    }
  }

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = msgId++
      pending.set(id, resolve)
      ws.send(JSON.stringify({ id, method, params }))
    })
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('DOM.enable')

  const evaluate = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
    return res?.result?.value
  }

  const saveScreenshot = async (filename) => {
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    const buffer = Buffer.from(shot.data, 'base64')
    const wsPath = path.join(WORKSPACE_SCREENSHOTS, filename)
    fs.writeFileSync(wsPath, buffer)
    const artPath = path.join(ARTIFACTS_DIR, filename)
    fs.writeFileSync(artPath, buffer)
    console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`)
    return wsPath
  }

  try {
    // 1. Desktop: Homepage with Firefly Trail
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(1500)

    // Move cursor across hero and buttons to generate trail
    for (let x = 300; x <= 850; x += 25) {
      const y = 350 + Math.sin(x / 40) * 60
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
      await sleep(25)
    }
    await sleep(100)
    await saveScreenshot('desktop-homepage-firefly-trail.png')

    // 2. Tablet: 768x1024
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: false,
    })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(1200)
    await saveScreenshot('tablet-homepage-768px.png')

    // 3. Mobile: 390x844 (iPhone)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' },
    })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(1200)
    await saveScreenshot('mobile-homepage-390px.png')

    // 4. Case Study Page: /work/parkora
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Page.navigate', { url: 'http://localhost:5173/work/parkora' })
    await sleep(1200)
    await saveScreenshot('desktop-casestudy-parkora.png')

  } finally {
    ws.close()
    chromeProcess.kill()
  }
  console.log('--- Screenshot capture completed ---')
}

captureScreenshotsAndVerify().catch((e) => {
  console.error(e)
  process.exit(1)
})
