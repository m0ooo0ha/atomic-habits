// Script to generate PWA icons
// This creates simple placeholder icons that can be replaced with custom designs later

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create SVG icon template
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="central" fill="white">⚽</text>
</svg>`;

console.log('Generating PWA icons...\n');

sizes.forEach(size => {
  const svg = createSVG(size);
  const filename = `icon-${size}x${size}.png`;
  const svgFilename = `icon-${size}x${size}.svg`;
  const filepath = path.join(publicDir, svgFilename);

  // Write SVG file (can be converted to PNG using external tools if needed)
  fs.writeFileSync(filepath, svg);
  console.log(`✓ Created ${svgFilename}`);
});

// Create a placeholder screenshot
const screenshotSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="540" height="720" viewBox="0 0 540 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="540" height="720" fill="#f9fafb"/>
  <rect x="20" y="20" width="500" height="100" rx="10" fill="#2563eb"/>
  <text x="270" y="75" font-size="32" text-anchor="middle" fill="white" font-weight="bold">⚽ متابع الانتقالات</text>

  <rect x="20" y="140" width="500" height="250" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
  <text x="270" y="180" font-size="24" text-anchor="middle" fill="#2563eb" font-weight="bold">إضافة متابعة جديدة</text>

  <rect x="20" y="410" width="500" height="290" rx="10" fill="white" stroke="#e5e7eb" stroke-width="2"/>
  <text x="270" y="450" font-size="24" text-anchor="middle" fill="#2563eb" font-weight="bold">متابعاتك</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'screenshot1.svg'), screenshotSVG);
console.log('✓ Created screenshot1.svg');

console.log('\n✅ All icons generated!');
console.log('\nNote: SVG files created. For production, convert to PNG using:');
console.log('  - Online tools like cloudconvert.com');
console.log('  - Or install sharp/imagemagick for automatic conversion');
console.log('\nFor now, browsers will use the SVG files which work fine for PWA.\n');
