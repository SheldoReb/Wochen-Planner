import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function generateThumbnail(imagePath) {
  try {
    if (imagePath.startsWith('http')) {
      // Handle URL case
      const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const thumbnailBuffer = await sharp(buffer).resize(200, 200).toBuffer();
      const thumbnailPath = path.join('thumbnails', path.basename(imagePath));
      fs.writeFileSync(thumbnailPath, thumbnailBuffer);
      return thumbnailPath;
    } else {
      // Handle local file case
      const buffer = fs.readFileSync(imagePath);
      const thumbnailBuffer = await sharp(buffer).resize(200, 200).toBuffer();
      const thumbnailPath = path.join('thumbnails', path.basename(imagePath));
      fs.writeFileSync(thumbnailPath, thumbnailBuffer);
      return thumbnailPath;
    }
  } catch (error) {
    console.error('Error generating thumbnail:', error.message, error.stack);
    throw new Error('Failed to generate thumbnail');
  }
}