import React, { useState } from 'react';
import { MenuItem, MenuCategory } from '../../types';
import { adminCreateMenuItem, adminUpdateMenuItem, adminDeleteMenuItem, adminUploadImage } from '../../lib/api';
import { Plus, Edit2, Trash2, Search, Sparkles, X, AlertTriangle, Upload } from 'lucide-react';

interface Props {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  onRefresh: () => void;
}

export const AdminMenu: React.FC<Props> = ({ menuItems, categories, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(
    (categories[0] as any)?._id || (categories[0] as any)?.id || ''
  );
  const [formPrice, setFormPrice] = useState<string>('');
  const [formDescription, setFormDescription] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formImage, setFormImage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory(categories[0]?._id || (categories[0] as any)?.id || '');
    setFormPrice('');
    setFormDescription('');
    setFormAvailable(true);
    setFormFeatured(false);
    setFormDisplayOrder(menuItems.length + 1);
    setFormImage('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.categoryId);
    setFormPrice(item.price !== null && item.price !== undefined ? String(item.price) : '');
    setFormDescription(item.description || '');
    setFormAvailable(item.available);
    setFormFeatured(item.featured);
    setFormDisplayOrder(item.displayOrder);
    setFormImage(item.image || '');
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError('Item name is required');
      return;
    }
    if (!formCategory) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const priceVal = formPrice.trim() !== '' ? Number(formPrice) : null;
      if (editingItem) {
        await adminUpdateMenuItem(editingItem._id || (editingItem as any).id, {
          name: formName.trim(),
          categoryId: formCategory,
          price: priceVal,
          description: formDescription.trim(),
          image: formImage.trim() || undefined,
          available: formAvailable,
          featured: formFeatured,
          displayOrder: Number(formDisplayOrder) || 1,
        });
      } else {
        await adminCreateMenuItem({
          name: formName.trim(),
          categoryId: formCategory,
          price: priceVal,
          description: formDescription.trim(),
          image: formImage.trim() || undefined,
          available: formAvailable,
          featured: formFeatured,
          displayOrder: Number(formDisplayOrder) || 1,
        });
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await adminDeleteMenuItem(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      await adminUpdateMenuItem(item._id || (item as any).id, {
        available: !item.available
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    try {
      await adminUpdateMenuItem(item._id || (item as any).id, {
        featured: !item.featured
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchCat = selectedCat === 'all' || item.categoryId === selectedCat;
    const q = search.toLowerCase().trim();
    const matchSearch = !q || item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c._id === catId || (c as any).id === catId);
    return cat ? cat.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-royal text-2xl font-bold text-[#f5f0e6]">
            Menu Management
          </h2>
          <p className="text-xs text-[#a8a396] mt-1">
            Configure dishes, update prices, manage availability, and mark featured items.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#c5a869] to-[#d4af37] text-[#0b0b0c] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a869]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#121216] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-xs text-[#f5f0e6] placeholder-[#66625a] focus:outline-none"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full sm:w-60 px-3 py-2.5 bg-[#121216] border border-[#c5a869]/20 focus:border-[#c5a869] rounded-lg text-xs text-[#f5f0e6] focus:outline-none"
        >
          <option value="all">All Categories ({menuItems.length})</option>
          {categories.map((c) => (
            <option key={c._id || (c as any).id} value={c._id || (c as any).id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items Table */}
      <div className="bg-[#121216] border border-[#c5a869]/20 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17171d] border-b border-[#25252e] text-[#8c887f] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Dish Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price (₹)</th>
                <th className="py-3 px-4 font-semibold text-center">Available</th>
                <th className="py-3 px-4 font-semibold text-center">Featured</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c24] text-[#d0cbc0]">
              {filteredItems.map((item) => {
                const itemId = item._id || (item as any).id;
                return (
                  <tr key={itemId} className="hover:bg-[#181820]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-royal text-sm font-semibold text-[#f5f0e6]">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-[#8c887f] line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#c5a869]">
                      {getCategoryName(item.categoryId)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {item.price !== null && item.price !== undefined ? (
                        <span className="text-[#f5f0e6]">₹{item.price}</span>
                      ) : (
                        <span className="text-[#716d63] italic">Not Set</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleAvailable(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          item.available
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                            : 'bg-red-950/70 text-red-300 border border-red-800/40'
                        }`}
                      >
                        {item.available ? 'In Stock' : 'Unavailable'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          item.featured ? 'text-[#c5a869]' : 'text-[#4e4a42] hover:text-[#c5a869]'
                        }`}
                        title="Toggle featured status"
                      >
                        <Sparkles className="w-4 h-4 mx-auto" />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-[#a8a396] hover:text-[#c5a869] transition-colors cursor-pointer"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(itemId)}
                        className="p-1.5 text-[#a8a396] hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog (Section 65) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#141418] border border-red-800/50 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-royal text-lg text-[#f5f0e6] font-bold mb-2">
              Delete Menu Item?
            </h3>
            <p className="text-xs text-[#a8a396] mb-6 leading-relaxed">
              Are you sure you want to delete this dish? This action will immediately remove it from the digital menu.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#1f1f26] text-[#d0cbc0] rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141418] border border-[#c5a869]/40 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#25252e]">
              <h3 className="font-royal text-xl text-[#f5f0e6] font-bold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#8c887f] hover:text-[#f5f0e6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 text-red-200 text-xs rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  Dish Name <span className="text-[#c5a869]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Mutton Biryani"
                  className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                    Category <span className="text-[#c5a869]">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id || (c as any).id} value={c._id || (c as any).id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                    Price in ₹ (Optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Leave empty if not set"
                    className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  Dish Photo (Optional)
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/30 hover:border-[#c5a869] rounded text-sm text-[#f5f0e6] cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#c5a869]" />
                      <span>{imageUploading ? 'Uploading to Cloudinary...' : 'Browse Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={imageUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.currentTarget.value = '';
                          if (!file) return;
                          setImageUploading(true);
                          setError(null);
                          try {
                            const result = await adminUploadImage(file);
                            setFormImage(result.url);
                          } catch (err: any) {
                            setError(err.message || 'Image upload failed');
                          } finally {
                            setImageUploading(false);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[11px] text-[#716d63]">or paste a direct image URL</span>
                  </div>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                  />
                  {formImage && (
                    <div className="relative overflow-hidden rounded-lg border border-[#c5a869]/20 bg-[#0f0f12]">
                      <img src={formImage} alt="Dish preview" className="w-full h-40 object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-[#716d63]">Uploaded photos are stored in Cloudinary and the secure Cloudinary URL is saved with the dish.</p>
                </div>
              </div>

              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Preparation details, ingredients or notes"
                  className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#1a1a22] rounded border border-[#c5a869]/15">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={(e) => setFormAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-[#c5a869]"
                  />
                  <span className="text-[#f5f0e6] font-medium">In Stock & Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#1a1a22] rounded border border-[#c5a869]/15">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#c5a869]"
                  />
                  <span className="text-[#f5f0e6] font-medium">Chef's Feature</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#25252e]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-[#1f1f26] text-[#d0cbc0] rounded font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#c5a869] hover:bg-[#d4af37] text-[#0b0b0c] rounded font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
