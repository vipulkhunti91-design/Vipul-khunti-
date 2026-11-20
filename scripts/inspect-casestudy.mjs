import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9227
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function inspectCaseStudy() {
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_cs_debug',
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
  await send('Page.navigate', { url: 'http://localhost:5173/work/phtopy' })
  await sleep(2000)

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const sections = document.querySelectorAll('.case-study-section');
        const results = [];
        sections.forEach(s => {
          const comp = window.getComputedStyle(s);
          const rect = s.getBoundingClientRect();
          results.push({
            id: s.id,
            opacity: comp.opacity,
            visibility: comp.visibility,
            display: comp.display,
            color: comp.color,
            top: rect.top,
            height: rect.height,
            inlineOpacity: s.style.opacity
          });
        });
        const outerReveal = document.querySelector('#case-study-content .reveal');
        const outerComp = outerReveal ? window.getComputedStyle(outerReveal) : null;
        return {
          sections: results,
          outerReveal: outerComp ? { opacity: outerComp.opacity, transform: outerComp.transform } : null
        };
      })()
    `,
    returnByValue: true,
  })

  console.log('Inspection result:', JSON.stringify(res.value, null, 2))

  ws.close()
  chromeProcess.kill()
}

inspectCaseStudy().catch(console.error)
