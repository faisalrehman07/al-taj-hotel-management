import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: GET /api/settings
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await db.getSettings();
    return res.json({ success: true, data: settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load website settings' });
  }
});

// ADMIN: PUT /api/admin/settings
router.put('/admin/settings', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await db.updateSettings(req.body);
    return res.json({ success: true, data: updated, message: 'Website settings updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update website settings' });
  }
});

export default router;
