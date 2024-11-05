import type { Browser } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import sharp from 'sharp';

const getBrowser = async () => {
  // Local development
  if (process.env.NODE_ENV === 'development') {
    return puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }
  // Production - use chromium
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
};

export async function generateThumbnail(url: string, repositoryName: string): Promise<string> {
  let browser: Browser | null = null;
  
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    });

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const screenshot = await page.screenshot({
      type: 'png',
    });

    // Optimize the image using sharp
    const optimizedImage = await sharp(screenshot)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return `data:image/jpeg;base64,${optimizedImage.toString('base64')}`;
  } catch (error) {
    console.error(`Error generating thumbnail for ${repositoryName}:`, error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}
