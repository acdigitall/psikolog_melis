// Sitenin CSS dosyasını üretir: npm run build:css
// Yalnızca php/ içindeki sınıflar değiştiğinde gerekir; sunucuda Node gerekmez.
import fs from 'node:fs';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const from = 'php/app/css/site.css';
const to = 'php/assets/site.css';
const result = await postcss([tailwind({ optimize: { minify: true } })]).process(fs.readFileSync(from, 'utf8'), { from, to });
fs.writeFileSync(to, result.css);
console.log(`${to}: ${(result.css.length / 1024).toFixed(1)} KB`);
