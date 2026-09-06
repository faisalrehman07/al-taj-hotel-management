import React, { useState } from 'react';
import { GalleryImage } from '../../types';
import { adminCreateGalleryImage, adminDeleteGalleryImage, adminUploadImage } from '../../lib/api';
import { Plus, Trash2, Image, Sparkles, Upload, X, AlertTriangle } from 'lucide-react';

interface Props {
  images: GalleryImage[];
  onRefresh: () => void;
}

export const AdminGallery: React.FC<Props> = ({ images, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'food' | 'restaurant' | 'ambiance'>('food');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await adminUploadImage(file);
      setImageUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. You can paste an image URL directly.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await adminCreateGalleryImage({
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
        featured,
        displayOrder: images.length + 1,
      });
      setModalOpen(false);
      setTitle('');
      setImageUrl('');
      setCaption('');
      setFeatured(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save gallery photo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteGalleryImage(id);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete photo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-royal text-2xl font-bold text-[#f5f0e6]">
            Gallery Management
          </h2>
          <p className="text-xs text-[#a8a396] mt-1">
            Upload and organize restaurant photos, dining hall, and food specialties.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setImageUrl('');
            setCaption('');
            setFeatured(false);
            setError(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-[#c5a869] to-[#d4af37] text-[#0b0b0c] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((img) => {
          const imgId = img._id || (img as any).id;
          return (
            <div
              key={imgId}
              className="bg-[#121216] border border-[#c5a869]/20 rounded-xl overflow-hidden shadow-lg group relative flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-[#0c0c0e] relative overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] bg-[#0b0b0c]/80 text-[#c5a869] uppercase font-semibold border border-[#c5a869]/30">
                  {img.category}
                </div>
                {img.featured && (
                  <div className="absolute top-2.5 right-2.5 p-1 rounded bg-[#c5a869] text-[#0b0b0c]" title="Featured photo">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-royal text-sm font-semibold text-[#f5f0e6]">
                    {img.title}
                  </h4>
                  {img.caption && (
                    <p className="text-[11px] text-[#8c887f] line-clamp-1 mt-0.5">
                      {img.caption}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setDeleteId(imgId)}
                  className="p-1.5 text-[#8c887f] hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-red-800/50 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-royal text-lg text-[#f5f0e6] font-bold mb-2">
              Delete Photo?
            </h3>
            <p className="text-xs text-[#a8a396] mb-6 leading-relaxed">
              Are you sure you want to remove this image from the public gallery?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141418] border border-[#c5a869]/40 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#25252e]">
              <h3 className="font-royal text-lg text-[#f5f0e6] font-bold">
                Add Showcase Photo
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
                  Photo Title <span className="text-[#c5a869]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Tandoori Chicken Tikka Platter"
                  className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                  >
                    <option value="food">Food & Specialties</option>
                    <option value="restaurant">Restaurant / Dining Hall</option>
                    <option value="ambiance">Ambiance</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#c5a869]"
                    />
                    <span className="text-[#f5f0e6] font-medium">Highlight / Featured</span>
                  </label>
                </div>
              </div>

              {/* Upload file or enter URL */}
              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  Upload Image File or Enter Image URL <span className="text-[#c5a869]">*</span>
                </label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 bg-[#1f1f28] hover:bg-[#282834] text-[#faedd0] border border-[#c5a869]/30 rounded cursor-pointer transition-colors text-xs">
                      <Upload className="w-3.5 h-3.5 text-[#c5a869]" />
                      <span>{uploading ? 'Processing...' : 'Browse Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-[#78746c]">or paste direct web link below</span>
                  </div>

                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none"
                  />
                </div>

                {/* Preview if URL present */}
                {imageUrl && (
                  <div className="mt-2.5 h-28 rounded overflow-hidden border border-[#c5a869]/20 bg-black">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#d0cbc0] font-semibold uppercase tracking-wider mb-1.5">
                  Caption / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Notes about preparation or setting"
                  className="w-full px-3.5 py-2.5 bg-[#1a1a22] border border-[#c5a869]/20 focus:border-[#c5a869] rounded text-sm text-[#f5f0e6] focus:outline-none resize-none"
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
                  disabled={loading || uploading}
                  className="px-6 py-2 bg-[#c5a869] hover:bg-[#d4af37] text-[#0b0b0c] rounded font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
