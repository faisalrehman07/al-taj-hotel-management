import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: POST /api/enquiries
router.post('/enquiries', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your name' });
    }
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Please provide your phone number' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: 'Please specify the subject of your enquiry' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your enquiry details' });
    }

    const enquiry = await db.createEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting AL-TAJ HOTEL. Our team will reach out to you shortly.',
      data: enquiry
    });
  } catch (err) {
    console.error('Enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Unable to submit enquiry. Please try again or call us directly.' });
  }
});

// ADMIN: GET /api/admin/enquiries
router.get('/admin/enquiries', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status && typeof status === 'string') filter.status = status;

    const list = await db.getEnquiries(filter);
    return res.json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load enquiries' });
  }
});

// ADMIN: PUT /api/admin/enquiries/:id/status
router.put('/admin/enquiries/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['NEW', 'IN_PROGRESS', 'RESOLVED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await db.updateEnquiryStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.json({ success: true, data: updated, message: `Status updated to ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update enquiry' });
  }
});

// ADMIN: DELETE /api/admin/enquiries/:id
router.delete('/admin/enquiries/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteEnquiry(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.json({ success: true, message: 'Enquiry record deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
  }
});

export default router;
