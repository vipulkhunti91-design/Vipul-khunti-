import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9298
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const p = spawn(CHROME_PATH, [
    '--remote-debugging-port=' + PORT,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_test_indu_' + Date.now(),
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
  await send('Page.navigate', { url: 'http://localhost:5173/work/indu-cafe' })
  await sleep(1500)

  const check = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const wireImgs = Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src.includes('/projects/indu-cafe/wire-'));
        const finalImgs = Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src.includes('/projects/indu-cafe/final-'));
        return { wireImgsCount: wireImgs.length, finalImgsCount: finalImgs.length };
      })()
    `,
    returnByValue: true,
  })
  console.log('Verification result:', check.result.value)

  ws.close()
  p.kill()
}

run().catch(console.error)
