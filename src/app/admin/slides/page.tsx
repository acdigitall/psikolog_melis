"use client";

import { useState, useEffect } from 'react';
import { getSlides, createSlide, updateSlide, deleteSlide } from '@/app/actions/slides';
import { uploadImageAction } from '@/app/actions/upload';
import Image from 'next/image';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  bg: string;
  order: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
  metaKeys?: string | null;
  createdAt: Date;
}

export default function AdminSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [desc, setDesc] = useState('');
  const [bg, setBg] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeys, setMetaKeys] = useState('');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchSlides = async () => {
    const res = await getSlides();
    if (res.success && res.data) {
      setSlides(res.data as Slide[]);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleAddNewClick = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setDesc('');
    setBg('');
    setOrder(slides.length + 1);
    setMetaTitle('');
    setMetaDesc('');
    setMetaKeys('');
    setShowForm(true);
    setMessage(null);
  };

  const handleEditClick = (slide: Slide) => {
    setEditingId(slide.id);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setDesc(slide.desc);
    setBg(slide.bg);
    setOrder(slide.order);
    setMetaTitle(slide.metaTitle || '');
    setMetaDesc(slide.metaDesc || '');
    setMetaKeys(slide.metaKeys || '');
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
      setBg(res.url);
      setMessage({ type: 'success', text: 'Slide background image uploaded successfully.' });
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
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    setLoading(true);
    const res = await deleteSlide(id);
    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Slide deleted successfully.' });
      fetchSlides();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete slide.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !desc || !bg) {
      setMessage({ type: 'error', text: 'Please fill in all fields and upload a cover image.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    let res;
    if (editingId) {
      res = await updateSlide(editingId, {
        title,
        subtitle,
        desc,
        bg,
        order: Number(order),
        metaTitle,
        metaDesc,
        metaKeys
      });
    } else {
      res = await createSlide({
        title,
        subtitle,
        desc,
        bg,
        order: Number(order),
        metaTitle,
        metaDesc,
        metaKeys
      });
    }

    setLoading(false);

    if (res.success) {
      setMessage({ 
        type: 'success', 
        text: editingId ? 'Slide updated successfully.' : 'Slide added successfully.' 
      });
      setShowForm(false);
      setEditingId(null);
      fetchSlides();
    } else {
      setMessage({ type: 'error', text: res.error || 'An error occurred while performing the operation.' });
    }
  };

  return (
    <div className="space-y-6">
      
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
          <h1 className="text-2xl font-serif text-stone-900 font-bold">Hero Slider Management</h1>
          <p className="text-xs text-stone-500 mt-1">Manage and edit main banner and cover slides on homepage.</p>
        </div>
        <button 
          onClick={showForm ? () => { setShowForm(false); setEditingId(null); } : handleAddNewClick}
          className="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors cursor-pointer rounded shrink-0"
        >
          {showForm ? 'Back to List' : '+ Add New Slide'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-8 border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            {editingId ? 'Edit Slide' : 'Add New Slide'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Subtitle *</label>
                <input 
                  type="text" 
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="e.g. Corporate Manufacturer & Interior Architecture" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Main Title *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="e.g. Traditional Craftsmanship, Modern Design" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <span>Keywords (SEO)</span>
                  <span className="text-[10px] text-stone-400 normal-case font-normal">Optional</span>
                </label>
                <input 
                  type="text" 
                  value={metaKeys}
                  onChange={(e) => setMetaKeys(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="e.g. home page, wooden bed" 
                />
              </div>
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
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Description *</label>
              <textarea 
                required
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                placeholder="Summary description text to appear on slide..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Upload Background Image *</label>
              
              {bg ? (
                <div className="space-y-3">
                  <div className="relative aspect-[21/9] w-full max-w-xl bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded">
                    <Image 
                      src={bg} 
                      alt="Slide Background Preview" 
                      fill 
                      unoptimized
                      className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => setBg('')}
                        className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Remove / Change Image
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 max-w-xl">
                    <label className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Image URL / Direct Path:</label>
                    <input
                      type="text"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-stone-800 rounded focus:outline-none focus:border-amber-700"
                      placeholder="/uploads/... or https://..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label 
                    htmlFor="slide-file-input"
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
                      id="slide-file-input"
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
                      {uploading ? 'Uploading Image...' : isDragging ? 'Drop to Upload' : 'Click or Drag to Select Image'}
                    </p>
                    <p className="text-amber-700 font-medium text-xs mt-2">Recommended Image Size: 1920 x 1080px (16:9 landscape aspect). Images are centered automatically.</p>
                  </label>

                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Or Enter Image URL Directly:</label>
                    <input
                      type="text"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-stone-800 rounded focus:outline-none focus:border-amber-700"
                      placeholder="e.g. /uploads/banner.png or https://..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditingId(null); }} 
                className="px-8 py-3 bg-stone-200 text-stone-700 font-bold uppercase tracking-wider text-sm hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || uploading || !bg}
                className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Save Slide'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {slides.length === 0 ? (
            <div className="bg-white p-10 text-center border border-stone-200 text-stone-500">
              No slides added yet.
            </div>
          ) : (
            slides.map((slide, idx) => (
              <div key={slide.id} className="bg-white border border-stone-200 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6 rounded">
                {/* Background Image Preview */}
                <div className="relative w-full md:w-64 aspect-[16/9] bg-stone-100 rounded overflow-hidden flex-shrink-0">
                  <Image 
                    src={slide.bg} 
                    alt={slide.title} 
                    fill 
                    unoptimized
                    className="object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/80 text-amber-500 font-bold text-xs px-2.5 py-1 rounded">
                    Slide #{idx + 1}
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex-grow space-y-2">
                  <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">
                    {slide.subtitle}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-stone-900">
                    {slide.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                    {slide.desc}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  <button 
                    onClick={() => handleEditClick(slide)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs uppercase tracking-wider rounded border border-stone-300 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(slide.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 font-medium text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

