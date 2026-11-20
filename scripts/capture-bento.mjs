import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9223
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5'
const WORKSPACE_SCREENSHOTS = 'd:\\VIPUL_1\\VIPUL.1\\qa-screenshots'

if (!fs.existsSync(WORKSPACE_SCREENSHOTS)) {
  fs.mkdirSync(WORKSPACE_SCREENSHOTS, { recursive: true })
}

async function captureBentoScreenshots() {
  console.log('--- Capturing Bento Grid Screenshots ---')

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_bento_' + Date.now(),
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
    // 1. Desktop Bento Grid
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(2000)
    
    // Check positions and scroll past horizontal pin
    const scrollInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const skills = document.getElementById('skills');
          if (!skills) return 'no skills';
          // Scroll page down past horizontal section
          window.scrollTo(0, 9000);
          return {
            totalHeight: document.body.scrollHeight,
            skillsTop: skills.getBoundingClientRect().top + window.scrollY,
          };
        })()
      `,
      returnByValue: true,
    })
    console.log('Scroll info:', scrollInfo?.result?.value)
    await sleep(1500)
    
    await send('Runtime.evaluate', {
      expression: `
        const skills = document.getElementById('skills');
        if (skills) {
          const y = skills.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, y - 80);
        }
      `,
    })
    await sleep(1000)
    await saveScreenshot('bento-grid-skills-desktop.png')

    // 2. Mobile Bento Grid
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' },
    })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(1500)
    await send('Runtime.evaluate', {
      expression: `
        const skills = document.getElementById('skills');
        if (skills) {
          const rect = skills.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top);
        }
      `,
    })
    await sleep(1200)
    await saveScreenshot('bento-grid-skills-mobile.png')

  } finally {
    ws.close()
    chromeProcess.kill()
  }
  console.log('--- Finished capturing Bento Grid screenshots ---')
}

captureBentoScreenshots().catch((e) => {
  console.error(e)
  process.exit(1)
})
