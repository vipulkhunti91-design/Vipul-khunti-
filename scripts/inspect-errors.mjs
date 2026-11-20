import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9228
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function inspectErrors() {
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_err_debug',
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
  const logs = []
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.method === 'Console.messageAdded') {
      logs.push(data.params.message)
    }
    if (data.method === 'Runtime.exceptionThrown') {
      logs.push(data.params.exceptionDetails)
    }
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
  await send('Console.enable')
  await send('Runtime.enable')

  await send('Page.navigate', { url: 'http://localhost:5173/work/phtopy' })
  await sleep(2500)

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const sections = Array.from(document.querySelectorAll('.case-study-section')).map(s => ({
          id: s.id,
          opacity: window.getComputedStyle(s).opacity,
          inlineOpacity: s.style.opacity,
          visibility: window.getComputedStyle(s).visibility
        }));
        const outer = document.querySelector('#case-study-content .reveal');
        return JSON.stringify({
          sections,
          outerReveal: outer ? {
            opacity: window.getComputedStyle(outer).opacity,
            animation: window.getComputedStyle(outer).animation
          } : null
        });
      })()
    `,
  })

  console.log('Eval result:', evalRes)
  console.log('Console logs:', logs)

  ws.close()
  chromeProcess.kill()
}

inspectErrors().catch(console.error)
