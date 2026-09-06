import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../auth';

const router = Router();

// PUBLIC: GET /api/categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await db.getCategories();
    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Restaurant data is temporarily unavailable. Please try again.' });
  }
});

// PUBLIC: GET /api/menu
router.get('/menu', async (req: Request, res: Response) => {
  try {
    const { categoryId, featured, available, search } = req.query;
    const filter: any = {};
    if (categoryId && typeof categoryId === 'string') filter.categoryId = categoryId;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (available !== undefined) filter.available = available === 'true';
    if (search && typeof search === 'string') filter.search = search;

    const items = await db.getMenuItems(filter);
    return res.json({ success: true, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Restaurant data is temporarily unavailable. Please try again.' });
  }
});

// ADMIN: POST /api/admin/categories
router.post('/admin/categories', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { name, description, image, displayOrder, active } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const created = await db.createCategory({
      name: name.trim(),
      description,
      image,
      displayOrder: Number(displayOrder) || undefined,
      active: active !== undefined ? !!active : true
    });
    return res.status(201).json({ success: true, data: created, message: 'Category created successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// ADMIN: PUT /api/admin/categories/:id
router.put('/admin/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await db.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, data: updated, message: 'Category updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// ADMIN: DELETE /api/admin/categories/:id
router.delete('/admin/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// ADMIN: POST /api/admin/menu
router.post('/admin/menu', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { categoryId, name, description, price, image, available, featured, displayOrder } = req.body;
    if (!categoryId || !name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Item name and category are required' });
    }
    const created = await db.createMenuItem({
      categoryId,
      name: name.trim(),
      description,
      price: price !== undefined && price !== '' && price !== null ? Number(price) : null,
      image,
      available: available !== undefined ? !!available : true,
      featured: featured !== undefined ? !!featured : false,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
    });
    return res.status(201).json({ success: true, data: created, message: 'Menu item created successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create menu item' });
  }
});

// ADMIN: PUT /api/admin/menu/:id
router.put('/admin/menu/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.price !== undefined) {
      updates.price = updates.price === '' || updates.price === null ? null : Number(updates.price);
    }
    const updated = await db.updateMenuItem(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    return res.json({ success: true, data: updated, message: 'Menu item updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update menu item' });
  }
});

// ADMIN: DELETE /api/admin/menu/:id
router.delete('/admin/menu/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteMenuItem(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    return res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete menu item' });
  }
});

export default router;
