import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9224
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const ARTIFACTS_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5'
const WORKSPACE_SCREENSHOTS = 'd:\\VIPUL_1\\VIPUL.1\\qa-screenshots'

if (!fs.existsSync(WORKSPACE_SCREENSHOTS)) {
  fs.mkdirSync(WORKSPACE_SCREENSHOTS, { recursive: true })
}

async function captureFirefliesQA() {
  console.log('--- Capturing Fireflies & Golden Effects Across Dark and Light Sections ---')

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_ff_' + Date.now(),
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
    // 1. Desktop: Light Selected Projects section showing Fireflies & golden accents
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(2000)

    // Move cursor over Selected Projects to generate particle trail on light background
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 1100);`,
    })
    await sleep(800)

    for (let x = 300; x <= 850; x += 30) {
      const y = 350 + Math.sin(x / 40) * 40
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
      await sleep(25)
    }
    await sleep(300)
    await saveScreenshot('qa-light-section-fireflies.png')

    // 2. Desktop: Transition boundary between Light Projects and Dark About
    await send('Runtime.evaluate', {
      expression: `
        const about = document.getElementById('about');
        if (about) {
          const y = about.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, y - 250);
        }
      `,
    })
    await sleep(1000)
    await saveScreenshot('qa-dark-light-boundary-transition.png')

    // 3. Desktop: Dark Skills section showing Bento Grid & Fireflies
    await send('Runtime.evaluate', {
      expression: `
        const skills = document.getElementById('skills');
        if (skills) {
          const y = skills.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, y - 60);
        }
      `,
    })
    await sleep(1000)
    await saveScreenshot('qa-dark-skills-fireflies.png')

    // 4. Case Study page with Light content section
    await send('Page.navigate', { url: 'http://localhost:5173/work/parkora' })
    await sleep(1500)
    await send('Runtime.evaluate', {
      expression: `
        const content = document.getElementById('case-study-content');
        if (content) {
          content.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      `,
    })
    await sleep(800)
    await saveScreenshot('qa-casestudy-light-fireflies.png')

  } finally {
    ws.close()
    chromeProcess.kill()
  }
  console.log('--- Finished Fireflies QA screenshots ---')
}

captureFirefliesQA().catch((e) => {
  console.error(e)
  process.exit(1)
})
