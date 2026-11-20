import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9226
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5'
const WORKSPACE_SCREENSHOTS = 'd:\\VIPUL_1\\VIPUL.1\\qa-screenshots'

const slugs = ['parkora', 'sanjivni', 'indu-cafe', 'red-bus-kids', 'phtopy']

async function captureAllCaseStudies() {
  console.log('--- Capturing All 5 Case Study Pages ---')

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_cs_' + Date.now(),
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })

  for (const slug of slugs) {
    console.log(`Navigating to /work/${slug}...`)
    await send('Page.navigate', { url: `http://localhost:5173/work/${slug}` })
    await sleep(1500)

    // Capture Hero
    const heroShot = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(path.join(ARTIFACTS_DIR, `cs-${slug}-hero.png`), Buffer.from(heroShot.data, 'base64'))

    // Scroll into content
    await send('Runtime.evaluate', {
      expression: `
        const content = document.getElementById('case-study-content');
        if (content) {
          content.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      `,
    })
    await sleep(1000)

    const contentShot = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(path.join(ARTIFACTS_DIR, `cs-${slug}-content.png`), Buffer.from(contentShot.data, 'base64'))
    console.log(`Captured ${slug}`)
  }

  ws.close()
  chromeProcess.kill()
  console.log('--- Done! ---')
}

captureAllCaseStudies().catch(console.error)
