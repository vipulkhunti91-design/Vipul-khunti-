import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9272
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const p = spawn(CHROME_PATH, [
    '--remote-debugging-port=' + PORT,
    '--headless=new',
    '--disable-gpu',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_test_' + Date.now(),
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

  // Let's test the entire sequence: Parkora -> Sanjivni -> Indu Cafe -> RedBus Kids -> Phtopy -> Parkora
  const slugs = ['parkora', 'sanjivni', 'indu-cafe', 'red-bus-kids', 'phtopy']

  await send('Page.navigate', { url: 'http://localhost:5173/work/parkora' })
  await sleep(1500)

  for (let i = 0; i < slugs.length; i++) {
    const info = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('a'));
          const nextBtn = btns.find(a => a.textContent.includes('Next Project'));
          const backBtn = btns.find(a => a.textContent.includes('Back to Selected Projects'));
          return {
            currentUrl: window.location.href,
            scrollY: window.scrollY,
            title: document.title,
            h1: document.querySelector('h1') ? document.querySelector('h1').textContent : null,
            nextHref: nextBtn ? nextBtn.getAttribute('href') : null,
            nextText: nextBtn ? nextBtn.textContent.trim() : null,
            backHref: backBtn ? backBtn.getAttribute('href') : null
          };
        })()
      `,
      returnByValue: true,
    })
    console.log(`Step ${i + 1}:`, info.result.value)

    // Click Next Project
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('a'));
          const nextBtn = btns.find(a => a.textContent.includes('Next Project'));
          if (nextBtn) nextBtn.click();
        })()
      `,
    })
    await sleep(1000)
  }

  // Also test clicking "Back to Selected Projects"
  console.log('Testing "Back to Selected Projects" click...')
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('a'));
        const backBtn = btns.find(a => a.textContent.includes('Back to Selected Projects'));
        if (backBtn) backBtn.click();
      })()
    `,
  })
  await sleep(1500)

  const finalCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const workSec = document.getElementById('work');
        const rect = workSec ? workSec.getBoundingClientRect() : null;
        return {
          url: window.location.href,
          scrollY: window.scrollY,
          workRect: rect
        };
      })()
    `,
    returnByValue: true,
  })
  console.log('After Back to Selected Projects click:', finalCheck.result.value)

  ws.close()
  p.kill()
}

run().catch(console.error)
