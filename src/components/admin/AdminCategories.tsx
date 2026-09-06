import React, { useState } from 'react';
import { MenuCategory } from '../../types';
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../lib/api';
import { Plus, Edit2, Trash2, Layers, AlertTriangle, X } from 'lucide-react';

interface Props {
  categories: MenuCategory[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<Props> = ({ categories, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingCategory(null);
    setName('');
    setDisplayOrder(categories.length + 1);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDisplayOrder(cat.displayOrder);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (editingCategory) {
        await adminUpdateCategory(editingCategory._id || (editingCategory as any).id, {
          name: name.trim(),
          displayOrder: Number(displayOrder) || 1,
        });
      } else {
        await adminCreateCategory({
          name: name.trim(),
          displayOrder: Number(displayOrder) || 1,
          active: true,
        });
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await adminDeleteCategory(id);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-royal text-2xl font-bold text-[#f5f0e6]">
            Category Management
          </h2>
          <p className="text-xs text-[#a8a396] mt-1">
            Organize digital menu sections such as Tandoori, Biryani, Mutton, etc.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#c5a869] hover:bg-[#d4af37] text-[#0b0b0c] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-[#121216] border border-[#c5a869]/20 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#17171d] border-b border-[#25252e] text-[#8c887f] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Order</th>
              <th className="py-3 px-4 font-semibold">Category Name</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c24] text-[#d0cbc0]">
            {categories.map((cat) => {
              const catId = cat._id || (cat as any).id;
              return (
                <tr key={catId} className="hover:bg-[#181820]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#c5a869]">
                    #{cat.displayOrder}
                  </td>
                  <td className="py-3.5 px-4 font-royal text-base font-semibold text-[#f5f0e6]">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 text-[#a8a396] hover:text-[#c5a869] transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(catId)}
                      className="p-1.5 text-[#a8a396] hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Category"
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

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-red-800/50 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-royal text-lg text-[#f5f0e6] font-bold mb-2">
              Delete Category?
            </h3>
            <p className="text-xs text-[#a8a396] mb-6 leading-relaxed">
              Deleting this category will remove it from the digital menu. Any items inside this category will also be removed.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-[#1f1f26] text-[#d0cbc0] rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#c5a869]/40 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#25252e]">
              <h3 className="font-royal text-lg text-[#f5f0e6] font-bold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#8c887f] hover:text-[#f5f0e6] cursor-pointer">
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
                  Category Name <span className="text-[#c5a869]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tandoori, Biryani"
                  className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#25252e]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#1f1f26] text-[#d0cbc0] rounded font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#c5a869] hover:bg-[#d4af37] text-[#0b0b0c] rounded font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
