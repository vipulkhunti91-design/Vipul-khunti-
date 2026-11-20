import fs from 'fs'
import path from 'path'

const uploads = [
  'media_1795180385981_04bf31cd.png',
  'media_1795180385994_349c43d9.png',
  'media_1795180386057_32adc5c2.png',
  'media_1795180386139_ec33cdf2.png',
  'media_1795180386159_32727e16.png',
  'media_1795180386167_1094b5e1.png',
  'media_1795180386171_1aff6ebd.png',
  'media_1795180386160_63387f35.png',
  'media_1795180386193_871f7a1d.png',
]

const srcDir = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\84ee198a-dfc9-46eb-a411-bd1184639bd5\\.user_uploaded'
const dstDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\indu-cafe'
fs.mkdirSync(dstDir, { recursive: true })

uploads.forEach((file, index) => {
  const num = String(index + 1).padStart(2, '0')
  const src = path.join(srcDir, file)
  const dst = path.join(dstDir, `wire-${num}.png`)
  fs.copyFileSync(src, dst)
  console.log(`Copied wire-${num}.png, size: ${fs.statSync(dst).size}`)
})
