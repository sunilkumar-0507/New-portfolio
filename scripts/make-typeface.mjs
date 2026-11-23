// Converts a TTF into a three.js typeface JSON containing only the needed glyphs.
// Usage: node scripts/make-typeface.mjs <font.ttf> <out.json> "<chars>"
import fs from 'node:fs';
import opentype from 'opentype.js';

const [, , input, output, chars = 'K76'] = process.argv;
const buf = fs.readFileSync(input);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);
const r = (n) => Math.round(n * scale);
const glyphs = {};
for (const ch of new Set(chars)) {
  const g = font.charToGlyph(ch);
  const token = { ha: r(g.advanceWidth), x_min: r(g.xMin ?? 0), x_max: r(g.xMax ?? 0), o: '' };
  for (const c of g.path.commands) {
    if (c.type === 'M') token.o += `m ${r(c.x)} ${r(c.y)} `;
    else if (c.type === 'L') token.o += `l ${r(c.x)} ${r(c.y)} `;
    else if (c.type === 'Q') token.o += `q ${r(c.x)} ${r(c.y)} ${r(c.x1)} ${r(c.y1)} `;
    else if (c.type === 'C') token.o += `b ${r(c.x)} ${r(c.y)} ${r(c.x1)} ${r(c.y1)} ${r(c.x2)} ${r(c.y2)} `;
  }
  glyphs[ch] = token;
}
const out = {
  glyphs,
  familyName: font.names.fontFamily?.en ?? 'Font',
  ascender: r(font.ascender),
  descender: r(font.descender),
  underlinePosition: r(font.tables.post.underlinePosition),
  underlineThickness: r(font.tables.post.underlineThickness),
  boundingBox: { yMin: r(font.tables.head.yMin), xMin: r(font.tables.head.xMin), yMax: r(font.tables.head.yMax), xMax: r(font.tables.head.xMax) },
  resolution: 1000,
  original_font_information: font.tables.name,
};
fs.writeFileSync(output, JSON.stringify(out));
console.log('wrote', output, Object.keys(glyphs).join(''));
