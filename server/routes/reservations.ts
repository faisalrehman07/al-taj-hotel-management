import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: POST /api/reservations
router.post('/reservations', async (req: Request, res: Response) => {
  try {
    const { customerName, phone, email, date, time, guests, occasion, specialRequest } = req.body;

    // Strong server-side validation
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name' });
    }
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: 'Please select a reservation date' });
    }
    if (!time) {
      return res.status(400).json({ success: false, message: 'Please select a preferred dining time' });
    }
    const guestNum = Number(guests);
    if (!guestNum || guestNum < 1 || guestNum > 50) {
      return res.status(400).json({ success: false, message: 'Please enter a valid guest count (1 to 50)' });
    }

    const reservation = await db.createReservation({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      date,
      time,
      guests: guestNum,
      occasion: occasion?.trim(),
      specialRequest: specialRequest?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Your table reservation request has been received.',
      data: reservation
    });
  } catch (err) {
    console.error('Reservation error:', err);
    return res.status(500).json({ success: false, message: 'Unable to submit reservation. Please call us directly.' });
  }
});

// ADMIN: GET /api/admin/reservations
router.get('/admin/reservations', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status, date, search } = req.query;
    const filter: any = {};
    if (status && typeof status === 'string') filter.status = status;
    if (date && typeof date === 'string') filter.date = date;
    if (search && typeof search === 'string') filter.search = search;

    const list = await db.getReservations(filter);
    return res.json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load reservations' });
  }
});

// ADMIN: PUT /api/admin/reservations/:id/status
router.put('/admin/reservations/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid reservation status' });
    }

    const updated = await db.updateReservationStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    return res.json({ success: true, data: updated, message: `Reservation status updated to ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update reservation' });
  }
});

// ADMIN: DELETE /api/admin/reservations/:id
router.delete('/admin/reservations/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteReservation(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    return res.json({ success: true, message: 'Reservation record deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete reservation' });
  }
});

export default router;
