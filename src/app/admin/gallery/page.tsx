"use client";

import { useState, useEffect } from 'react';

import { getGalleryItems, createGalleryItem, deleteGalleryItem, updateGalleryItem } from '@/app/actions/gallery';
import { getCategories, createCategory } from '@/app/actions/categories';
import { uploadImageAction } from '@/app/actions/upload';
import Image from 'next/image';
import PageHeaderForm from '@/components/admin/PageHeaderForm';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  img: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  metaKeys?: string | null;
  order: number;
  createdAt: Date;
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [img, setImg] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeys, setMetaKeys] = useState('');
  const [order, setOrder] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const availableCategories = categories.map(cat => typeof cat === 'string' ? cat : cat.name);

  const fetchItems = async () => {
    const res = await getGalleryItems();
    if (res.success && res.data) {
      setItems(res.data as GalleryItem[]);
    }
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    if (res.success && res.data) {
      setCategories(res.data);
      if (res.data.length > 0 && !category && !isNewCategory) {
        setCategory(res.data[0].name);
      }
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleAddNewClick = () => {
    setEditingId(null);
    setTitle('');
    setImg('');
    setMetaTitle('');
    setMetaDesc('');
    setMetaKeys('');
    setOrder(items.length > 0 ? items[items.length - 1].order + 1 : 1);
    
    if (categories.length > 0) {
      setIsNewCategory(false);
      setCategory(categories[0].name);
    } else {
      setIsNewCategory(true);
    }
    
    setNewCategoryName('');
    setShowForm(true);
    setMessage(null);
  };

  const handleEditClick = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setIsNewCategory(false);
    setNewCategoryName('');
    setImg(item.img);
    setMetaTitle(item.metaTitle || '');
    setMetaDesc(item.metaDesc || '');
    setMetaKeys(item.metaKeys || '');
    setOrder(item.order);
    setShowForm(true);
    setMessage(null);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadImageAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setImg(res.url);
      setMessage({ type: 'success', text: 'Image uploaded successfully.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to upload image.' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    setLoading(true);
    const res = await deleteGalleryItem(id);
    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Image deleted successfully.' });
      fetchItems();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete image.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !img) {
      setMessage({ type: 'error', text: 'Please enter an image title and upload an image.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    let finalCategory = category;
    if (isNewCategory && newCategoryName.trim() !== '') {
      finalCategory = newCategoryName.trim();
      await createCategory(finalCategory);
    }

    let res;
    if (editingId) {
      res = await updateGalleryItem(editingId, {
        title,
        metaTitle,
        metaDesc,
        metaKeys,
        category: finalCategory,
        img,
        order
      });
    } else {
      res = await createGalleryItem({
        title,
        metaTitle,
        metaDesc,
        metaKeys,
        category: finalCategory,
        img,
        order
      });
    }

    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: editingId ? 'Image updated successfully.' : 'Image added to gallery successfully.' });
      setShowForm(false);
      setEditingId(null);
      fetchItems();
      fetchCategories();
    } else {
      setMessage({ type: 'error', text: res.error || (editingId ? 'An error occurred while updating the image.' : 'An error occurred while adding the image.') });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeaderForm pageIdentifier="gallery" />
      
      {/* Alert Message */}
      {message && (
        <div className={`p-4 border text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900 font-bold">Gallery Management</h1>
          <p className="text-xs text-stone-500 mt-1">Upload and manage gallery photos.</p>
        </div>
        <button 
          onClick={showForm ? () => setShowForm(false) : handleAddNewClick}
          className="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors cursor-pointer rounded shrink-0"
        >
          {showForm ? 'Back to Gallery' : '+ Add New Image'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-8 border border-stone-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            {editingId ? 'Edit Image' : 'Add New Image'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Image Title *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="e.g. Modern Kitchen Cabinet" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block flex items-center justify-between">
                  <span>Meta Title (SEO)</span>
                  <span className="text-[10px] text-stone-400 normal-case font-normal">Optional</span>
                </label>
                <input 
                  type="text" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="Enter subtitle or detailed title..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block flex items-center justify-between">
                  <span>Meta Description (SEO)</span>
                  <span className="text-[10px] text-stone-400 normal-case font-normal">Optional</span>
                </label>
                <textarea 
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="Summary description for search engines..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block flex items-center justify-between">
                  <span>Keywords (SEO)</span>
                  <span className="text-[10px] text-stone-400 normal-case font-normal">Optional</span>
                </label>
                <input 
                  type="text" 
                  value={metaKeys}
                  onChange={(e) => setMetaKeys(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="e.g. wooden table, office design" 
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Sorting (Optional)</label>
                <input 
                  type="number" 
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 999)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                  placeholder="1, 2, 3... (e.g. 1 on top)" 
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Category *</label>
                {isNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded"
                      placeholder="New category name..."
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-4 py-3 bg-stone-200 text-stone-700 font-bold uppercase tracking-wider text-xs hover:bg-stone-300 transition-colors rounded whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select 
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === 'YENI_EKLE') {
                        setIsNewCategory(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="YENI_EKLE" className="font-bold text-amber-700">+ Add New Category...</option>
                  </select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Select / Upload Image *</label>
              
              {img ? (
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] w-full max-w-sm bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded">
                    <Image 
                      src={img} 
                      alt="Uploaded Image Preview" 
                      fill 
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => setImg('')}
                        className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Change / Remove Image
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <label className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Image URL / Direct Path:</label>
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => setImg(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-stone-800 rounded focus:outline-none focus:border-amber-700"
                      placeholder="/uploads/... or https://..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label 
                    htmlFor="gallery-file-input"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`block w-full border-2 border-dashed px-4 py-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded ${
                      isDragging 
                        ? 'border-amber-700 bg-amber-50/50 scale-[1.01]' 
                        : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-amber-700'
                    }`}
                  >
                    <input 
                      id="gallery-file-input"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden" 
                    />
                    {uploading ? (
                      <svg className="w-12 h-12 text-amber-700 mb-3 animate-hammer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15 5 4 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.5 4.5 19.5 2.5a1 1 0 0 0-1.4 0l-6.5 6.5 4 4 6.5-6.5a1 1 0 0 0 0-1.4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m11.5 9.5-8.5 8.5v3h3l8.5-8.5" />
                      </svg>
                    ) : (
                      <svg className={`w-12 h-12 mb-3 transition-transform ${isDragging ? 'text-amber-700 scale-110' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    <p className="text-stone-700 font-bold text-sm">
                      {uploading ? 'Preparing Image... Hammers at Work!' : isDragging ? 'Drop to Upload' : 'Click or Drag to Select Image'}
                    </p>
                    <p className="text-stone-400 text-xs mt-2">Max size 5MB (JPG, PNG, WEBP, SVG)</p>
                    <p className="text-amber-700 font-medium text-xs mt-1">Recommended Image Size: 800 x 600px (or similar landscape format)</p>
                  </label>

                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Or Enter Image URL Directly:</label>
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => setImg(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-stone-800 rounded focus:outline-none focus:border-amber-700"
                      placeholder="e.g. /uploads/image.png or https://..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-8 py-3 bg-stone-200 text-stone-700 font-bold uppercase tracking-wider text-sm hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || uploading || !img}
                className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Save Image')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white border border-stone-200 text-stone-500">
              No images in gallery yet.
            </div>
          ) : (
            items.map((img) => (
              <div key={img.id} className="bg-white border border-stone-200 group shadow-sm flex flex-col h-full rounded">
                <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center text-stone-400">
                  <Image 
                    src={img.img || "/images/klinik-oturma.jpg"} 
                    alt={img.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                    <button 
                      onClick={() => handleEditClick(img)} 
                      className="p-3 bg-white text-amber-600 rounded-full hover:bg-amber-600 hover:text-white transition-colors cursor-pointer shadow-md" 
                      title="Edit"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(img.id)} 
                      className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors cursor-pointer shadow-md" 
                      title="Delete"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4 border-t border-stone-100 flex-grow relative">
                  <h3 className="font-bold text-stone-900 text-sm truncate">{img.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-stone-500 uppercase tracking-wider">{img.category}</p>
                    <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-bold">Sorting: {img.order}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

