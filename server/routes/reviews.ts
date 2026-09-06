import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: GET /api/reviews
router.get('/reviews', async (_req: Request, res: Response) => {
  try {
    const reviews = await db.getReviews({ status: 'APPROVED' });
    const stats = await db.getReviewStats();
    return res.json({
      success: true,
      data: reviews,
      stats
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve reviews' });
  }
});

// PUBLIC: POST /api/reviews
router.post('/reviews', async (req: Request, res: Response) => {
  try {
    const { customerName, rating, reviewText, diningPreference, dishLoved } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name' });
    }
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Please select a star rating from 1 to 5' });
    }
    if (!reviewText || reviewText.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Please write at least a few words about your dining experience' });
    }

    // Basic anti-spam check (length cap)
    if (reviewText.trim().length > 1000) {
      return res.status(400).json({ success: false, message: 'Review must be under 1000 characters' });
    }

    const created = await db.createReview({
      customerName: customerName.trim(),
      rating: numRating,
      reviewText: reviewText.trim(),
      diningPreference: diningPreference ? diningPreference.trim() : undefined,
      dishLoved: dishLoved ? dishLoved.trim() : undefined
    });

    return res.status(201).json({
      success: true,
      message: 'Shukriya! Your review has been submitted successfully.',
      data: created
    });
  } catch (err) {
    console.error('Review submit error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit review. Please try again.' });
  }
});

// ADMIN: GET /api/admin/reviews
router.get('/admin/reviews', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter = status && typeof status === 'string' ? { status } : undefined;
    const reviews = await db.getReviews(filter);
    const stats = await db.getReviewStats();
    return res.json({ success: true, data: reviews, stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load reviews' });
  }
});

// ADMIN: PUT /api/admin/reviews/:id/status
router.put('/admin/reviews/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['APPROVED', 'PENDING', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid review status' });
    }

    const updated = await db.updateReviewStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, data: updated, message: `Review status set to ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update review status' });
  }
});

// ADMIN: DELETE /api/admin/reviews/:id
router.delete('/admin/reviews/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteReview(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

export default router;
