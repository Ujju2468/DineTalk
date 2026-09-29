#!/usr/bin/env node
/**
 * optimize-category-images.js
 * ----------------------------
 * Drop a raw photo (any size/format) into:
 *   assets-raw/items/<category>/<iconKey>.<ext>
 * Run:
 *   npm run optimize:images
 * Get an optimized, size-budgeted JPEG written to:
 *   public/images/items/<category>/<iconKey>.jpg
 * which KitchenIcon.js will automatically pick up (it tries the real photo
 * first and falls back to the SVG icon if none exists).
 *
 * <category> must be one of: vegetable, fruit, spice, herb, dairy, vessel,
 * pan, wok, utensil, equipment, other — matching ICON_CATEGORY in
 * src/icons/KitchenIcons.js.
 * <iconKey> should match an existing icon key (e.g. "carrot", "tomato") so
 * it lines up with items already using that icon — but any name works.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const RAW_DIR = path.join(__dirname, '..', 'assets-raw', 'items');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'items');

// Target the 2KB–10KB inventory image budget requested for the app
const DIMENSION = 128;       // px, square
const MAX_BYTES = 10 * 1024; // 10KB hard ceiling
const MIN_BYTES = 2 * 1024;  // 2KB floor (informational — we don't degrade below readable quality to hit this)
const QUALITY_STEPS = [82, 74, 66, 58, 50, 42, 35];

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

async function compress(inputPath) {
  const base = sharp(inputPath).resize(DIMENSION, DIMENSION, { fit: 'cover', position: 'attention' });
  let buffer = await base.jpeg({ quality: QUALITY_STEPS[0], mozjpeg: true }).toBuffer();
  let used = QUALITY_STEPS[0];

  for (const q of QUALITY_STEPS.slice(1)) {
    if (buffer.length <= MAX_BYTES) break;
    buffer = await sharp(inputPath)
      .resize(DIMENSION, DIMENSION, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: q, mozjpeg: true })
      .toBuffer();
    used = q;
  }

  return { buffer, quality: used };
}

async function run() {
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`No raw input folder found at ${RAW_DIR}`);
    process.exit(1);
  }

  const categories = fs.readdirSync(RAW_DIR).filter(f => fs.statSync(path.join(RAW_DIR, f)).isDirectory());
  let processed = 0;
  let skipped = 0;

  for (const category of categories) {
    const rawCatDir = path.join(RAW_DIR, category);
    const outCatDir = path.join(OUT_DIR, category);
    fs.mkdirSync(outCatDir, { recursive: true });

    const files = fs.readdirSync(rawCatDir).filter(f => IMAGE_EXT.test(f));
    for (const file of files) {
      const iconKey = path.basename(file, path.extname(file));
      const inputPath = path.join(rawCatDir, file);
      const outputPath = path.join(outCatDir, `${iconKey}.jpg`);

      try {
        const { buffer, quality } = await compress(inputPath);
        fs.writeFileSync(outputPath, buffer);
        const kb = (buffer.length / 1024).toFixed(1);
        const flag = buffer.length > MAX_BYTES ? '  ⚠ over 10KB budget' : buffer.length < MIN_BYTES ? '  (very small, fine)' : '';
        console.log(`✓ ${category}/${iconKey}.jpg — ${kb}KB @ q${quality}${flag}`);
        processed++;
      } catch (err) {
        console.error(`✗ Failed on ${category}/${file}:`, err.message);
        skipped++;
      }
    }
  }

  console.log(`\nDone. ${processed} image(s) optimized, ${skipped} failed.`);
  if (processed === 0) {
    console.log(`Tip: drop photos into assets-raw/items/<category>/<iconKey>.jpg first, e.g.\n  assets-raw/items/vegetable/carrot.jpg`);
  }
}

run();
