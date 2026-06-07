// Generates minimal PNG icons using only Node.js built-ins (no native deps)
import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length);
  const comb = Buffer.concat([t, data]);
  const cs = Buffer.allocUnsafe(4);
  cs.writeUInt32BE(crc32(comb));
  return Buffer.concat([len, comb, cs]);
}

function hex(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function createPng(size) {
  const bg = hex('#2C1810');
  const ring = hex('#FAF7F2');
  const inner = hex('#8B5E3C');

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const row = 1 + size * 3;
  const raw = Buffer.allocUnsafe(size * row);
  const cx = size / 2, cy = size / 2;
  const r1 = size * 0.46, r2 = size * 0.30;

  for (let y = 0; y < size; y++) {
    raw[y * row] = 0;
    for (let x = 0; x < size; x++) {
      const px = y * row + 1 + x * 3;
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      let col = bg;
      if (d <= r1) col = ring;
      if (d <= r2) col = inner;
      raw[px] = col[0]; raw[px + 1] = col[1]; raw[px + 2] = col[2];
    }
  }

  const compressed = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync('public', { recursive: true });
writeFileSync('public/pwa-192x192.png', createPng(192));
writeFileSync('public/pwa-512x512.png', createPng(512));
writeFileSync('public/apple-touch-icon.png', createPng(180));
writeFileSync('public/favicon.ico', createPng(32));
console.log('Icons generated.');
