"use client";

import { useState, useEffect } from 'react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/app/actions/blog';
import { getCategories } from '@/app/actions/categories';
import { uploadImageAction } from '@/app/actions/upload';
import Image from 'next/image';
import PageHeaderForm from '@/components/admin/PageHeaderForm';

interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string | null;
  status: string;
  views: number;
  createdAt: Date;
  metaTitle?: string | null;
  metaDesc?: string | null;
  metaKeys?: string | null;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Trendler');
  const [status, setStatus] = useState('Yayında');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeys, setMetaKeys] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch data from database
  const fetchPosts = async () => {
    const res = await getBlogPosts();
    if (res.success && res.data) {
      setPosts(res.data as Post[]);
    }
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    if (res.success && res.data) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setStatus(post.status);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setImage(post.image || '');
    setMetaTitle(post.metaTitle || '');
    setMetaDesc(post.metaDesc || '');
    setMetaKeys(post.metaKeys || '');
    setShowForm(true);
    setMessage(null);
  };

  const handleAddNewClick = () => {
    setEditingPost(null);
    setTitle('');
    setCategory(categories.length > 0 ? categories[0].name : '');
    setStatus('Yayında');
    setExcerpt('');
    setContent('');
    setImage('');
    setMetaTitle('');
    setMetaDesc('');
    setMetaKeys('');
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
      setImage(res.url);
      setMessage({ type: 'success', text: 'Kapak görseli yüklendi.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Görsel yüklenemedi.' });
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

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    const res = await deleteBlogPost(id);
    setLoading(false);
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Yazı silindi.' });
      fetchPosts();
    } else {
      setMessage({ type: 'error', text: res.error || 'Yazı silinemedi.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !image) {
      setMessage({ type: 'error', text: 'Lütfen başlık, özet ve içeriği doldurup bir görsel yükleyin.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = {
      title,
      category,
      excerpt,
      content,
      status,
      image: image || undefined,
      metaTitle,
      metaDesc,
      metaKeys
    };

    let res;
    if (editingPost) {
      res = await updateBlogPost(editingPost.id, formData);
    } else {
      res = await createBlogPost(formData);
    }

    setLoading(false);

    if (res.success) {
      setMessage({ 
        type: 'success', 
        text: editingPost ? 'Yazı güncellendi.' : 'Yazı eklendi.' 
      });
      setShowForm(false);
      fetchPosts();
    } else {
      setMessage({ type: 'error', text: res.error || 'İşlem başarısız oldu.' });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeaderForm pageIdentifier="blog" />

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
          <h1 className="text-2xl font-serif text-stone-900 font-bold">Blog Yazıları</h1>
        </div>
        <button 
          onClick={showForm ? () => setShowForm(false) : handleAddNewClick}
          className="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors cursor-pointer rounded shrink-0"
        >
          {showForm ? 'Listeye Dön' : '+ Yeni yazı ekle'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-8 border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            {editingPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Yazı başlığı *</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                placeholder="Yazı başlığını yazın..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Kategori *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && <option value="">Kategori bulunamadı</option>}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Durum *</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700"
                >
                  <option value="Yayında">Yayında</option>
                  <option value="Taslak">Taslak</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block flex items-center justify-between">
                  <span>Meta başlık (SEO)</span>
                  <span className="text-[10px] text-stone-400 normal-case font-normal">İsteğe bağlı</span>
                </label>
                <input 
                  type="text" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="Arama sonuçlarında görünecek başlık..." 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block flex items-center justify-between">
                  <span>Anahtar kelimeler (SEO)</span>
                  <span className="text-[10px] text-stone-400 normal-case font-normal">İsteğe bağlı</span>
                </label>
                <input 
                  type="text" 
                  value={metaKeys}
                  onChange={(e) => setMetaKeys(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                  placeholder="ör. panik atak, kaygı, izmir psikolog" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block flex items-center justify-between">
                <span>Meta açıklama (SEO)</span>
                <span className="text-[10px] text-stone-400 normal-case font-normal">İsteğe bağlı</span>
              </label>
              <textarea 
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                placeholder="Arama motorları için kısa açıklama..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Özet * (kartlarda ve arama sonuçlarında görünür)</label>
              <input 
                type="text" 
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                placeholder="Kısa bir özet yazın..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">İçerik *</label>
              <textarea 
                rows={10} 
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700" 
                placeholder="Yazınızı buraya yazın..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Kapak görseli seç / yükle *</label>
              
              {image ? (
                <div className="relative aspect-[16/10] w-full max-w-md bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded">
                  <Image 
                    src={image} 
                    alt="Yüklenen görselin önizlemesi" 
                    fill 
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setImage('')}
                      className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Görseli Değiştir / Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <label 
                  htmlFor="blog-file-input"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`block w-full border-2 border-dashed px-4 py-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded ${
                    isDragging 
                      ? 'border-amber-700 bg-amber-50/50' 
                      : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-amber-700'
                  }`}
                >
                  <input 
                    id="blog-file-input"
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden" 
                  />
                  <svg className={`w-12 h-12 mb-3 ${isDragging ? 'text-amber-700' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  <p className="text-stone-700 font-bold text-sm">
                    {uploading ? 'Görsel hazırlanıyor...' : isDragging ? 'Yüklemek için bırakın' : 'Yazı kapak görseli seçmek için tıklayın ya da sürükleyin'}
                  </p>
                  <p className="text-stone-400 text-xs mt-2">En fazla 8 MB (JPG, PNG, WEBP, GIF)</p>
                  <p className="text-amber-700 font-medium text-xs mt-1">Önerilen görsel boyutu: 800 x 600 px (ya da benzer yatay oran)</p>
                </label>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-8 py-3 bg-stone-200 text-stone-700 font-bold uppercase tracking-wider text-sm hover:bg-stone-300 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading || uploading || !image}
                className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : 'Yazıyı Kaydet'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto rounded">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              Henüz blog yazısı eklenmedi.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-stone-50 text-stone-900 uppercase tracking-wider font-bold border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Başlık</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Okunma</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900">{post.title}</td>
                    <td className="px-6 py-4">{post.category}</td>
                    <td className="px-6 py-4">{post.views}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded-sm ${
                        post.status === 'Yayında' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {post.status === 'Yayında' ? 'Yayında' : post.status === 'Taslak' ? 'Taslak' : post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <button 
                        onClick={() => handleEditClick(post)} 
                        className="text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(post.id)} 
                        className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

