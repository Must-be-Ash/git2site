import sharp from 'sharp';
import { toPng } from 'html-to-image';

export async function generatePreviewImage(element: HTMLElement): Promise<Buffer> {
  try {
    const dataUrl = await toPng(element);
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    return await sharp(buffer)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 }
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error('Image processing failed:', error);
    return getDefaultImage();
  }
}

async function getDefaultImage(): Promise<Buffer> {
  return await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .jpeg()
    .toBuffer();
}

export async function optimizeImage(buffer: Buffer, width: number, height: number): Promise<Buffer> {
  return await sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}