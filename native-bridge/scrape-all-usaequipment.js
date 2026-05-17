const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Use stealth plugin to avoid Cloudflare and Odoo detection
puppeteer.use(StealthPlugin());

const TARGETS = [
  { name: 'Home Page', url: 'https://www.usaequipmentdirect.com/', file: 'usaequipmentdirect.com_clone.html' },
  { name: 'Shop Directory', url: 'https://www.usaequipmentdirect.com/shop', file: 'usaequipmentdirect.com_shop.html' },
  { name: 'Restaurant Equipment', url: 'https://www.usaequipmentdirect.com/shop/category/restaurant-equipment-1', file: 'usaequipmentdirect.com_restaurant_equipment.html' },
  { name: 'Commercial Refrigeration', url: 'https://www.usaequipmentdirect.com/shop/category/commercial-refrigeration-1073', file: 'usaequipmentdirect.com_commercial_refrigeration.html' },
  { name: 'Janitorial Supplies', url: 'https://www.usaequipmentdirect.com/shop/category/janitorial-supplies-102', file: 'usaequipmentdirect.com_janitorial_supplies.html' },
  { name: 'Smallwares', url: 'https://www.usaequipmentdirect.com/shop/category/smallwares-24', file: 'usaequipmentdirect.com_smallwares.html' },
  { name: 'Tabletop', url: 'https://www.usaequipmentdirect.com/shop/category/tabletop-79', file: 'usaequipmentdirect.com_tabletop.html' },
  { name: 'Furniture', url: 'https://www.usaequipmentdirect.com/shop/category/furniture-157', file: 'usaequipmentdirect.com_furniture.html' },
  { name: 'Brands Showcase', url: 'https://www.usaequipmentdirect.com/all-brands', file: 'usaequipmentdirect.com_brands.html' }
];

const vaultDir = path.join(__dirname, 'vault', 'Equipment');
const mediaDir = path.join(vaultDir, 'media');

const publicVaultDir = path.join(__dirname, '..', 'public', 'vault', 'Equipment');
const publicMediaDir = path.join(publicVaultDir, 'media');

// Ensure directories exist
if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

if (!fs.existsSync(publicVaultDir)) fs.mkdirSync(publicVaultDir, { recursive: true });
if (!fs.existsSync(publicMediaDir)) fs.mkdirSync(publicMediaDir, { recursive: true });

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Basic protocol checking
    if (!url.startsWith('http')) return reject(new Error('Invalid URL protocol'));
    
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : require('http');
    
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        file.close(() => fs.unlink(dest, () => {}));
        return reject(new Error(`Server returned status: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function scrapeAll() {
  console.log('🤖 Starting Deep Harvest Sequence for USA Equipment Direct...');
  
  // Find local Chrome or Edge path
  const chromePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  let executablePath;
  for (const p of chromePaths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  console.log(`[HARVEST] Using browser binary at: ${executablePath || 'Puppeteer Default'}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  // Spoof dynamic properties
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {} };
  });

  for (let idx = 0; idx < TARGETS.length; idx++) {
    const target = TARGETS[idx];
    console.log(`\n[HARVEST] [${idx + 1}/${TARGETS.length}] Fetching ${target.name} → ${target.url}`);
    
    try {
      // Go to target page
      await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Delay slightly to ensure client side scripts finish running
      await new Promise(r => setTimeout(r, 2000));
      
      // Get raw page HTML
      const html = await page.content();
      const filePath = path.join(vaultDir, target.file);
      fs.writeFileSync(filePath, html);
      
      const publicFilePath = path.join(publicVaultDir, target.file);
      fs.writeFileSync(publicFilePath, html);
      
      console.log(`[HARVEST] ✓ Cloned and saved to: ${target.file} (${Math.round(html.length / 1024)} KB)`);

      // Extract new images to enrich our media assets vault
      const imageUrls = await page.evaluate(() => {
        return Array.from(document.images, img => img.src)
          .filter(src => src && src.startsWith('http') && !src.includes('logo') && !src.includes('favicon'))
          .slice(0, 10); // Capture up to 10 unique product/marketing images per page
      });

      console.log(`[HARVEST] Found ${imageUrls.length} candidate media assets on page.`);
      for (let i = 0; i < imageUrls.length; i++) {
        const imgUrl = imageUrls[i];
        try {
          const u = new URL(imgUrl);
          const ext = path.extname(u.pathname) || '.jpg';
          const fileIndex = idx * 10 + i;
          const imgFileName = `asset_${fileIndex}${ext}`;
          const destPath = path.join(mediaDir, imgFileName);
          const publicDestPath = path.join(publicMediaDir, imgFileName);
          
          await downloadFile(imgUrl, destPath);
          try {
            fs.copyFileSync(destPath, publicDestPath);
          } catch(err) {}
          console.log(`[HARVEST]   ↳ media asset cached: ${imgFileName}`);
        } catch (e) {
          // Fail silently for single images to not break crawler flow
        }
      }
      
    } catch (err) {
      console.error(`[HARVEST] ❌ Failed scraping ${target.name}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n🎉 Deep Harvest Complete! All files populated successfully.');
}

scrapeAll().catch(err => {
  console.error('[CRITICAL] Harvest crashed:', err);
});