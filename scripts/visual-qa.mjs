import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9222

// Helper to wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runVisualQA() {
  console.log('--- Starting Automated Visual QA for Mouse Firefly Trail ---')

  // Launch headless Chrome with CDP
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_qa_' + Date.now(),
    'about:blank',
  ])

  // Wait for Chrome CDP port to be ready
  let targets = null
  for (let i = 0; i < 20; i++) {
    await sleep(300)
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`)
      targets = await res.json()
      if (targets && targets.length > 0) break
    } catch {}
  }

  if (!targets || targets.length === 0) {
    console.error('Failed to connect to headless Chrome CDP')
    chromeProcess.kill()
    process.exit(1)
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

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true })
    return res?.result?.value
  }

  const results = {
    checks: [],
    passed: 0,
    failed: 0,
  }

  function report(name, success, details = '') {
    results.checks.push({ name, success, details })
    if (success) {
      results.passed++
      console.log(`[PASS] ${name} ${details ? '(' + details + ')' : ''}`)
    } else {
      results.failed++
      console.log(`[FAIL] ${name}: ${details}`)
    }
  }

  try {
    // 1. Load Homepage on Desktop Viewport
    console.log('\nTesting 1: Desktop Viewport (1440x900)...')
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })

    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(1500)

    // Check canvas element existence
    const canvasExists = await evaluate(`!!document.querySelector('.firefly-cursor canvas')`)
    report('Canvas element exists inside .firefly-cursor', canvasExists)

    // Check pointer-events: none on container and canvas
    const pointerEventsCheck = await evaluate(`
      (() => {
        const container = document.querySelector('.firefly-cursor');
        const canvas = document.querySelector('.firefly-cursor canvas');
        const cStyle = container ? window.getComputedStyle(container).pointerEvents : null;
        const cvStyle = canvas ? window.getComputedStyle(canvas).pointerEvents : null;
        return cStyle === 'none' && cvStyle === 'none';
      })()
    `)
    report('Pointer-events is strictly "none" (never blocks clicks/scroll)', pointerEventsCheck)

    // Move mouse across the screen to trigger firefly trail
    console.log('\nTesting 2: Mouse Movement & Particle Generation...')
    for (let x = 200; x <= 800; x += 30) {
      const y = 300 + Math.sin(x / 50) * 80
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x,
        y,
      })
      await sleep(35)
    }

    // Inspect if canvas has non-transparent pixels (particles drawn)
    const particleDrawnCheck = await evaluate(`
      (() => {
        const canvas = document.querySelector('.firefly-cursor canvas');
        if (!canvas) return { drawn: false, reason: 'no canvas' };
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let nonZero = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] > 10) nonZero++;
        }
        return { drawn: nonZero > 20, nonZeroPixels: nonZero, width: canvas.width, height: canvas.height };
      })()
    `)
    report('Particles actively rendered on canvas during movement', particleDrawnCheck.drawn, `${particleDrawnCheck.nonZeroPixels} glowing pixels`)

    // Check that buttons are interactive and clickable under the cursor
    console.log('\nTesting 3: Button Interactivity & Click-Through...')
    const buttonClickable = await evaluate(`
      (() => {
        const btn = document.querySelector('a[href="/#work"]');
        if (!btn) return false;
        const rect = btn.getBoundingClientRect();
        const topEl = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        // elementFromPoint should hit the button or its children, NOT .firefly-cursor
        return btn.contains(topEl) || topEl === btn;
      })()
    `)
    report('Buttons and links are directly hit by pointer (elementFromPoint passes through cursor layer)', buttonClickable)

    // Check idle behavior (wait 3.5s for trail to fade out and canvas to settle)
    console.log('\nTesting 4: Idle Behavior & Fade-Out Timing...')
    await sleep(3600)
    const idleCheck = await evaluate(`
      (() => {
        const canvas = document.querySelector('.firefly-cursor canvas');
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let nonZero = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] > 10) nonZero++;
        }
        return nonZero === 0;
      })()
    `)
    report('Idle behavior: all particles gracefully faded out after cursor rests', idleCheck)

    // Check Visual Effects toggle
    console.log('\nTesting 5: Visual Effects Toggle Compatibility...')
    // Toggle off
    await evaluate(`
      (() => {
        const toggleBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fireflies'));
        if (toggleBtn) toggleBtn.click();
      })()
    `)
    await sleep(300)

    const disabledAttr = await evaluate(`document.documentElement.getAttribute('data-visual-effects') === 'disabled'`)
    report('Visual effects toggle applies data-visual-effects="disabled"', disabledAttr)

    // Move mouse while disabled: should NOT draw any particles
    for (let x = 300; x <= 600; x += 40) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y: 400 })
      await sleep(30)
    }

    const disabledNoParticles = await evaluate(`
      (() => {
        const canvas = document.querySelector('.firefly-cursor canvas');
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let nonZero = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] > 10) nonZero++;
        }
        return nonZero === 0;
      })()
    `)
    report('Zero particles drawn when visual effects are toggled off', disabledNoParticles)

    // Toggle back on
    await evaluate(`
      (() => {
        const toggleBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fireflies'));
        if (toggleBtn) toggleBtn.click();
      })()
    `)
    await sleep(300)

    // Check Reduced Motion
    console.log('\nTesting 6: Prefers-Reduced-Motion Setting...')
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    })
    await sleep(300)

    for (let x = 300; x <= 600; x += 40) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y: 400 })
      await sleep(30)
    }

    const reducedMotionCheck = await evaluate(`
      (() => {
        const canvas = document.querySelector('.firefly-cursor canvas');
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let nonZero = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] > 10) nonZero++;
        }
        return nonZero === 0;
      })()
    `)
    report('Respects prefers-reduced-motion: reduce (particles suppressed)', reducedMotionCheck)

    // Reset reduced motion
    await send('Emulation.setEmulatedMedia', { features: [] })

    // Check All 5 Case Study Pages
    console.log('\nTesting 7: Case Study Pages Verification...')
    const caseStudies = ['parkora', 'sanjivni', 'indu-cafe', 'red-bus-kids', 'phtopy']

    for (const slug of caseStudies) {
      await send('Page.navigate', { url: `http://localhost:5173/work/${slug}` })
      await sleep(800)

      const pageCheck = await evaluate(`
        (() => {
          const h1 = document.querySelector('#case-study-hero h1');
          const canvas = document.querySelector('.firefly-cursor canvas');
          const cursor = document.querySelector('.firefly-cursor');
          return {
            hasH1: !!h1,
            title: h1 ? h1.textContent.trim() : null,
            hasCanvas: !!canvas,
            cursorPresent: !!cursor
          };
        })()
      `)

      report(`Case study /work/${slug}: canvas & cursor loaded cleanly`, pageCheck.hasCanvas && pageCheck.hasH1, `Title: "${pageCheck.title}"`)
    }

    // Check Mobile & Tablet Viewports
    console.log('\nTesting 8: Mobile Viewport (iPhone 14 - 390x844)...')
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' },
    })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await sleep(1000)

    const mobileCheck = await evaluate(`
      (() => {
        const cursor = document.querySelector('.firefly-cursor');
        const style = cursor ? window.getComputedStyle(cursor).display : null;
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        return { display: style, finePointer };
      })()
    `)
    report('Mobile viewport: firefly cursor appropriately disabled or styled for touch', mobileCheck.display === 'none' || !mobileCheck.finePointer, `display: ${mobileCheck.display}`)

    console.log('\nTesting 9: Tablet Viewport (iPad - 768x1024)...')
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: false,
    })
    await sleep(600)

    const tabletNoOverflow = await evaluate(`
      document.documentElement.scrollWidth <= window.innerWidth
    `)
    report('Tablet viewport: no horizontal layout overflow', tabletNoOverflow)

  } finally {
    ws.close()
    chromeProcess.kill()
  }

  console.log('\n==========================================')
  console.log(`Visual QA Summary: ${results.passed} Passed, ${results.failed} Failed`)
  console.log('==========================================\n')

  if (results.failed > 0) {
    process.exit(1)
  }
}

runVisualQA().catch((err) => {
  console.error('QA script error:', err)
  process.exit(1)
})
