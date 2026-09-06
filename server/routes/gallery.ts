import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: GET /api/gallery
router.get('/gallery', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const list = await db.getGallery(typeof category === 'string' ? category : undefined);
    return res.json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load gallery' });
  }
});

// ADMIN: POST /api/admin/gallery
router.post('/admin/gallery', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { title, category, imageUrl, caption, featured, displayOrder } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Image title and URL are required' });
    }
    const created = await db.createGalleryImage({
      title: title.trim(),
      category: category || 'food',
      imageUrl: imageUrl.trim(),
      caption,
      featured: !!featured,
      displayOrder: displayOrder ? Number(displayOrder) : undefined,
    });
    return res.status(201).json({ success: true, data: created, message: 'Gallery image added' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add gallery image' });
  }
});

// ADMIN: PUT /api/admin/gallery/:id
router.put('/admin/gallery/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await db.updateGalleryImage(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    return res.json({ success: true, data: updated, message: 'Gallery image updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update gallery image' });
  }
});

// ADMIN: DELETE /api/admin/gallery/:id
router.delete('/admin/gallery/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteGalleryImage(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    return res.json({ success: true, message: 'Gallery image removed' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete gallery image' });
  }
});

export default router;
