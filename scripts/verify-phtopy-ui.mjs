import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9285
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const p = spawn(CHROME_PATH, [
    '--remote-debugging-port=' + PORT,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_phtopy_' + Date.now(),
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
  await send('Page.navigate', { url: 'http://localhost:5173/work/phtopy' })
  await sleep(1500)

  const check = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const headings = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim());
        const links = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('vercel.app')).map(a => ({ text: a.textContent.trim(), href: a.href }));
        const imgs = Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src.includes('/projects/phtopy/'));
        return { headings, links, imgsCount: imgs.length, sampleImgs: imgs };
      })()
    `,
    returnByValue: true,
  })
  console.log('Phtopy check result:', JSON.stringify(check.result.value, null, 2))

  ws.close()
  p.kill()
}

run().catch(console.error)
