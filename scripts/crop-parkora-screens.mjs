import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9231
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const outDir = 'd:\\VIPUL_1\\VIPUL.1\\public\\projects\\parkora'
fs.mkdirSync(outDir, { recursive: true })

// Also copy the 2 wireframe images
const userUploadedDir = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b43da6cb-71c2-41f5-880c-3c939bec50f5\\.user_uploaded'
fs.copyFileSync(path.join(userUploadedDir, 'media_1795158218379_2c3dcd25.png'), path.join(outDir, 'wire-slots.png'))
fs.copyFileSync(path.join(userUploadedDir, 'media_1795158296447_e0b3526b.jpg'), path.join(outDir, 'wire-filters.jpg'))
console.log('Copied wireframe screens!')

// HTML cropping harness
const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; background:#000;">
<img id="src" src="pdf_full_render.png" style="display:none;" />
<canvas id="c"></canvas>
<script>
  window.doCrop = async function() {
    const img = document.getElementById('src');
    await new Promise(r => {
      if (img.complete) r();
      else img.onload = r;
    });

    // The image natural dimensions
    const W = img.naturalWidth;
    const H = img.naturalHeight;

    // We can define the 6 bounding boxes of the mobile screens in the rendered PDF
    // In pdf_full_render.png (2560 x 1800):
    // Let's sample pixel colors to get exact boundaries.
    const canvas = document.getElementById('c');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Dark screen background is approx #001F3F / #001730 or #0D2137
    // Let's define the screen boxes based on the visual layout
    // We have 6 mobile devices:
    // Screen 1: Nearby Parking (x approx 118 to 256 / W)
    // Screen 2: Profile View
    // Screen 3: Booking Details
    // Screen 4: Profile Edit
    // Screen 5: History
    // Screen 6: Details (bottom right)

    // Let's create an offscreen canvas for each crop
    function cropBox(box) {
      const oc = document.createElement('canvas');
      oc.width = box.w;
      oc.height = box.h;
      const octx = oc.getContext('2d');
      octx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
      return oc.toDataURL('image/png').replace(/^data:image\\/png;base64,/, '');
    }

    return {
      W, H
    };
  };
</script>
</body>
</html>
`
fs.writeFileSync(path.join(outDir, 'crop_harness.html'), htmlContent)
