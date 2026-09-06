import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../auth';

const router = Router();

function isValidExternalUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

// ADMIN: POST /api/admin/upload
// Uploaded files and supplied remote image URLs are sent to Cloudinary; the returned
// secure URL is stored in the menu/gallery record. No local upload copy is created.
router.post('/admin/upload', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { image, imageUrl } = req.body;

    const source = typeof image === 'string' && image.trim()
      ? image.trim()
      : (typeof imageUrl === 'string' && isValidExternalUrl(imageUrl) ? imageUrl.trim() : '');

    if (!source) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image or provide a valid image URL.'
      });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    const folder = process.env.CLOUDINARY_FOLDER?.trim() || 'al-taj-hotel';

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your .env file.'
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const crypto = await import('crypto');
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(`${paramsToSign}${apiSecret}`)
      .digest('hex');

    const formData = new FormData();
    formData.append('file', source);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('folder', folder);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await response.json() as any;

    if (!response.ok || !data.secure_url) {
      console.error('Cloudinary upload failed:', data);
      return res.status(502).json({
        success: false,
        message: data?.error?.message || 'Cloudinary image upload failed.'
      });
    }

    return res.json({
      success: true,
      url: data.secure_url,
      storage: 'cloudinary',
      publicId: data.public_id
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Image processing failed' });
  }
});

export default router;
