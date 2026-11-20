import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9225
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5'
const WORKSPACE_SCREENSHOTS = 'd:\\VIPUL_1\\VIPUL.1\\qa-screenshots'

if (!fs.existsSync(WORKSPACE_SCREENSHOTS)) {
  fs.mkdirSync(WORKSPACE_SCREENSHOTS, { recursive: true })
}

async function captureProjects() {
  console.log('--- Capturing Selected Projects Dark Theme Screenshots ---')

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_proj_' + Date.now(),
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

  // Desktop capture
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })

  await send('Page.navigate', { url: 'http://localhost:5173/' })
  await sleep(2500)

  // Scroll to #work
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('work');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    `,
  })
  await sleep(1500)

  const desktopShot = await send('Page.captureScreenshot', { format: 'png' })
  const desktopBuf = Buffer.from(desktopShot.data, 'base64')
  fs.writeFileSync(path.join(WORKSPACE_SCREENSHOTS, 'selected-projects-dark-desktop.png'), desktopBuf)
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'selected-projects-dark-desktop.png'), desktopBuf)
  console.log('Saved selected-projects-dark-desktop.png')

  // Mobile capture
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  })
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('work');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    `,
  })
  await sleep(1500)

  const mobileShot = await send('Page.captureScreenshot', { format: 'png' })
  const mobileBuf = Buffer.from(mobileShot.data, 'base64')
  fs.writeFileSync(path.join(WORKSPACE_SCREENSHOTS, 'selected-projects-dark-mobile.png'), mobileBuf)
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'selected-projects-dark-mobile.png'), mobileBuf)
  console.log('Saved selected-projects-dark-mobile.png')

  ws.close()
  chromeProcess.kill()
  console.log('--- Done! ---')
}

captureProjects().catch(console.error)
