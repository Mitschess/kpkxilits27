// Convert PNG/JPG images to resized WebP for public/images.
//
// Usage:
//   node scripts/optimize-images.mjs <input file|dir> <output dir> [--width=1200] [--quality=80]
//
// Example (new kabinet photos):
//   npm run images -- raw/kabinet public/images/kabinet --width=480
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [input, output, ...flags] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/optimize-images.mjs <input> <output> [--width=1200] [--quality=80]");
  process.exit(1);
}

const opt = Object.fromEntries(
  flags.map((f) => f.replace(/^--/, "").split("=")).map(([k, v]) => [k, Number(v)]),
);
const width = opt.width || 1200;
const quality = opt.quality || 80;

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_]+/g, "-")
    .replace(/^-|-$/g, "");

async function convert(file, outDir) {
  const out = path.join(outDir, `${slug(path.basename(file))}.webp`);
  const info = await sharp(file)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(out);
  const before = (await stat(file)).size;
  console.log(
    `${path.basename(file)} -> ${path.relative(process.cwd(), out)} ` +
      `(${Math.round(before / 1024)}KB -> ${Math.round(info.size / 1024)}KB)`,
  );
}

const isImage = (f) => /\.(png|jpe?g|webp)$/i.test(f);

await mkdir(output, { recursive: true });
if ((await stat(input)).isDirectory()) {
  for (const f of await readdir(input)) {
    if (isImage(f)) await convert(path.join(input, f), output);
  }
} else {
  await convert(input, output);
}
