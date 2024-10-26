import puppeteer from 'puppeteer';
import sharp from 'sharp';

export async function generateThumbnail(url: string, repositoryName: string): Promise<string> {
  console.log(`Generating thumbnail for ${url}`);
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new' as any,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    
    // Wait for any lazy-loaded content
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

    const screenshot = await page.screenshot({ type: 'png', fullPage: false });
    await browser.close();

    console.log('Screenshot captured');

    const resizedImage = await sharp(screenshot)
      .resize(600, 315, { fit: 'cover', position: 'top' })
      .toBuffer();

    console.log('Image resized');

    // For now, we'll return a data URL. In a production environment, you'd want to save this to a file or cloud storage.
    const base64Image = resizedImage.toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error(`Error generating thumbnail for ${url}:`, error);
    return '/placeholder-thumbnail.png'; // Return a placeholder image URL if thumbnail generation fails
  }
}
