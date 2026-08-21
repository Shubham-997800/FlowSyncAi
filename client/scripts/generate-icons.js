// Regenerates every app icon from public/favicon.svg (the README logo).
// - Regular icons keep the rounded-square design.
// - Maskable + apple-touch icons use a full-bleed variant (rx=0) so Android/iOS
//   masks never crop the artwork; all strokes sit inside the 80% safe zone.
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const publicDir = path.join(root, 'public')
const iconsDir = path.join(publicDir, 'icons')

const svgRaw = readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8')
const svgFullBleed = svgRaw.replace(/rx="116"/g, 'rx="0"')

const SIZES = [48, 72, 96, 128, 144, 152, 192, 384, 512]
const MASKABLE = [192, 512]

async function render(svg, size, out) {
  const buf = Buffer.from(svg)
  await sharp(buf, { density: 512 }).resize(size, size).png().toFile(out)
}

for (const s of SIZES) {
  await render(svgRaw, s, path.join(iconsDir, `icon-${s}x${s}.png`))
}
for (const s of MASKABLE) {
  await render(svgFullBleed, s, path.join(iconsDir, `icon-${s}x${s}-maskable.png`))
}
await render(svgFullBleed, 180, path.join(publicDir, 'apple-touch-icon.png'))
await render(svgRaw, 32, path.join(publicDir, 'favicon-32x32.png'))
await render(svgRaw, 16, path.join(publicDir, 'favicon-16x16.png'))
const icoBuf = await pngToIco([
  await sharp(Buffer.from(svgRaw), { density: 512 }).resize(16, 16).png().toBuffer(),
  await sharp(Buffer.from(svgRaw), { density: 512 }).resize(32, 32).png().toBuffer(),
  await sharp(Buffer.from(svgRaw), { density: 512 }).resize(48, 48).png().toBuffer(),
])
writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf)
writeFileSync(path.join(publicDir, 'maskable.svg'), svgFullBleed)
console.log('Icons regenerated:', SIZES.join(', '), '+ maskable + favicons + favicon.ico')
