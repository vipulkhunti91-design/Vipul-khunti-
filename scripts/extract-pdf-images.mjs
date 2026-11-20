import fs from 'fs'

const pdfPath = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5\\.user_uploaded\\media_1795158865370_d497cc15.pdf'
const buf = fs.readFileSync(pdfPath)

console.log('PDF size:', buf.length)

// Search for image streams
let jpegCount = 0
let offset = 0
const jpegs = []

while (offset < buf.length - 4) {
  // Look for JPEG SOI marker: 0xFF, 0xD8, 0xFF
  if (buf[offset] === 0xff && buf[offset + 1] === 0xd8 && buf[offset + 2] === 0xff) {
    // Find EOI marker: 0xFF, 0xD9
    let end = offset + 2
    while (end < buf.length - 1) {
      if (buf[end] === 0xff && buf[end + 1] === 0xd9) {
        end += 2
        break
      }
      end++
    }
    const len = end - offset
    if (len > 5000) {
      // Meaningful image
      jpegs.push({ start: offset, end, len })
    }
    offset = end
  } else {
    offset++
  }
}

console.log(`Found ${jpegs.length} embedded JPEGs:`, jpegs.map(j => j.len))

const outDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\parkora'
fs.mkdirSync(outDir, { recursive: true })

jpegs.forEach((j, i) => {
  const imgData = buf.subarray(j.start, j.end)
  const filename = `${outDir}\\extracted_${i + 1}.jpg`
  fs.writeFileSync(filename, imgData)
  console.log(`Saved ${filename} (${imgData.length} bytes)`)
})
