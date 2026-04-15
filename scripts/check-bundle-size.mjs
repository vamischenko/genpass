import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const DIST_ASSETS_DIR = join(process.cwd(), 'dist', 'assets')
const MAX_GZIP_BYTES = 50 * 1024

const formatKb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`

const assets = readdirSync(DIST_ASSETS_DIR).filter((file) => file.endsWith('.js') || file.endsWith('.css'))

if (!assets.length) {
  throw new Error('Файлы бандла не найдены. Сначала выполните npm run build.')
}

const totalGzip = assets.reduce((sum, file) => {
  const fullPath = join(DIST_ASSETS_DIR, file)
  const content = readFileSync(fullPath)
  return sum + gzipSync(content).byteLength
}, 0)

if (totalGzip > MAX_GZIP_BYTES) {
  throw new Error(
    `Размер gzip-бандла ${formatKb(totalGzip)} превышает лимит ${formatKb(MAX_GZIP_BYTES)}.`,
  )
}

console.log(`OK: gzip-бандл ${formatKb(totalGzip)} (лимит ${formatKb(MAX_GZIP_BYTES)})`)
