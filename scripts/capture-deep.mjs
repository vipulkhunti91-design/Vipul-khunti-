import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9229
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5'
const slugs = ['parkora', 'sanjivni', 'indu-cafe', 'red-bus-kids', 'phtopy']

async function captureDeepScreens() {
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_deep_' + Date.now(),
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })

  for (const slug of slugs) {
    await send('Page.navigate', { url: `http://localhost:5173/work/${slug}` })
    await sleep(1500)

    // Scroll to screens section if present, or midway down
    await send('Runtime.evaluate', {
      expression: `
        const screens = document.getElementById('final-ui') || document.getElementById('people') || document.getElementById('solution') || document.querySelector('.case-study-section:nth-of-type(3)');
        if (screens) {
          screens.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
          window.scrollBy(0, 1200);
        }
      `,
    })
    await sleep(800)

    const shot = await send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(path.join(ARTIFACTS_DIR, `cs-${slug}-deep.png`), Buffer.from(shot.data, 'base64'))
    console.log(`Captured deep for ${slug}`)
  }

  ws.close()
  chromeProcess.kill()
}

captureDeepScreens().catch(console.error)
