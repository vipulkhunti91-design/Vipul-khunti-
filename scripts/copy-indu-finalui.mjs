import fs from 'fs'
import path from 'path'

// Mapping the 9 uploaded final UI screens into logical order
// 1. Chef Dashboard / Overview (c57b4d36.jpg)
// 2. Orders list (04aac9ec.png)
// 3. Manage Menu - Food Menu in stock / out of stock (76f58234.png)
// 4. Add New Item to Menu (7a3df50a.png)
// 5. Inventory Manager (e1e2e273.png)
// 6. Add New Stock form (f7539793.png)
// 7. Business Reports / Billing (81580b1a.png)
// 8. Business Analytics overview (90fbda7b.png)
// 9. Profile settings (56b1ab6a.png)

const uploads = [
  'media_1795180719586_c57b4d36.jpg',
  'media_1795180719611_04aac9ec.png',
  'media_1795180719469_76f58234.png',
  'media_1795180719545_7a3df50a.png',
  'media_1795180719620_e1e2e273.png',
  'media_1795180719602_f7539793.png',
  'media_1795180719627_81580b1a.png',
  'media_1795180719618_90fbda7b.png',
  'media_1795180719551_56b1ab6a.png',
]

const srcDir = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\84ee198a-dfc9-46eb-a411-bd1184639bd5\\.user_uploaded'
const dstDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\indu-cafe'
fs.mkdirSync(dstDir, { recursive: true })

uploads.forEach((file, index) => {
  const num = String(index + 1).padStart(2, '0')
  const ext = path.extname(file)
  const src = path.join(srcDir, file)
  const dst = path.join(dstDir, `final-${num}${ext}`)
  fs.copyFileSync(src, dst)
  console.log(`Copied final-${num}${ext}, size: ${fs.statSync(dst).size}`)
})
