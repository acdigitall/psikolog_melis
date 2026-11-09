"use client";

import { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService } from '@/app/actions/services';
import { uploadImageAction } from '@/app/actions/upload';
import Image from 'next/image';
import PageHeaderForm from '@/components/admin/PageHeaderForm';

interface ServiceItem {
  id: number;
  slug: string;
  title: string;
  desc: string;
  longDesc: string;
  features: string;
  steps: string;
  img: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  metaKeys?: string | null;
  isFeatured?: boolean;
  createdAt: Date;
}

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form States
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [features, setFeatures] = useState('');
  const [steps, setSteps] = useState('');
  const [img, setImg] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeys, setMetaKeys] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchServices = async () => {
    const res = await getServices();
    if (res.success && res.data) {
      setServices(res.data as any[]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddNewClick = () => {
    setEditingId(null);
    setSlug('');
    setTitle('');
    setDesc('');
    setLongDesc('');
    setFeatures('');
    setSteps('');
    setImg('');
    setMetaTitle('');
    setMetaDesc('');
    setMetaKeys('');
    setIsFeatured(false);
    setShowForm(true);
    setMessage(null);
  };

  const handleEditClick = (service: any) => {
    setEditingId(service.id);
    setSlug(service.slug);
    setTitle(service.title);
    setDesc(service.desc);
    setLongDesc(service.longDesc);
    setFeatures(service.features);
    setSteps(service.steps);
    setImg(service.img);
    setMetaTitle(service.metaTitle || '');
    setMetaDesc(service.metaDesc || '');
    setMetaKeys(service.metaKeys || '');
    setIsFeatured(service.isFeatured || false);
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
      setMessage({ type: 'success', text: 'Görsel yüklendi.' });
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    const res = await deleteService(id);
    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Hizmet silindi.' });
      fetchServices();
    } else {
      setMessage({ type: 'error', text: res.error || 'Hizmet silinemedi.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !img) {
      setMessage({ type: 'error', text: 'Lütfen zorunlu alanları doldurup bir görsel yükleyin.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const data = {
      slug, title, desc, longDesc, features, steps, img, metaTitle, metaDesc, metaKeys, isFeatured
    };

    let res;
    if (editingId) {
      res = await updateService(editingId, data);
    } else {
      res = await createService(data);
    }

    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: editingId ? 'Hizmet güncellendi.' : 'Hizmet eklendi.' });
      setShowForm(false);
      setEditingId(null);
      fetchServices();
    } else {
      setMessage({ type: 'error', text: res.error || 'Bir hata oluştu.' });
    }
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  return (
    <div className="space-y-6">
      <PageHeaderForm pageIdentifier="services" />
      {message && (
        <div className={`p-4 border text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900 font-bold">Hizmetler</h1>
        </div>
        <button 
          onClick={showForm ? () => setShowForm(false) : handleAddNewClick}
          className="px-6 py-2.5 bg-stone-900 text-white font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-amber-800 transition-colors cursor-pointer rounded shrink-0"
        >
          {showForm ? 'Listeye Dön' : '+ Yeni hizmet ekle'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm rounded">
          <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            {editingId ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Hizmet adı *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingId) setSlug(generateSlug(e.target.value));
                  }}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                  placeholder="ör. Çift ve İlişki Terapisi" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Sayfa adresi (slug) *</label>
                <input 
                  type="text" 
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                  placeholder="ör. cift-ve-iliski-terapisi" 
                />
                <p className="text-xs text-stone-500">Adres çubuğunda görünecek ad. Boşluksuz ve Türkçe karaktersiz yazın.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-stone-50 border border-stone-200 rounded">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-amber-800 border-stone-300 rounded focus:ring-amber-700"
              />
              <label htmlFor="isFeatured" className="text-sm font-bold text-stone-900 uppercase tracking-wider cursor-pointer">
                Ana sayfada öne çıkar
              </label>
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
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
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
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                  placeholder="ör. çift terapisi, izmir" 
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
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                placeholder="Arama motorları için kısa açıklama..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Kısa açıklama (özet)</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                placeholder="Hizmet listesinde görünecek kısa özet..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Uzun açıklama (detay sayfası için)</label>
              <textarea 
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                rows={4}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                placeholder="Detay sayfasında görünecek ayrıntılı açıklama..." 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Çalışılan konular (virgülle ayırın)</label>
                <textarea 
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                  placeholder="ör. Kaygı, Panik atak, Sosyal kaygı" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Süreç adımları (virgülle ayırın)</label>
                <textarea 
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
                  placeholder="ör. Tanışma görüşmesi, Değerlendirme, Hedef belirleme" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Hizmet görseli seç / yükle *</label>
              
              {img ? (
                <div className="relative aspect-[4/3] w-full max-w-md bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded">
                  <Image 
                    src={img} 
                    alt="Yüklenen görselin önizlemesi" 
                    fill 
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setImg('')}
                      className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Görseli Değiştir / Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <label 
                  htmlFor="group-file-input"
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
                    id="group-file-input"
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
                    {uploading ? 'Görsel hazırlanıyor...' : isDragging ? 'Yüklemek için bırakın' : 'Kapak görseli seçmek için tıklayın ya da sürükleyin'}
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
                className="px-8 py-3 bg-stone-200 text-stone-700 font-bold uppercase tracking-wider text-sm hover:bg-stone-300 transition-colors cursor-pointer rounded"
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={loading || uploading || !img || !slug}
                className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : (editingId ? 'Değişiklikleri Kaydet' : 'Hizmeti Kaydet')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto rounded">
          {services.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              Henüz hizmet eklenmedi.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-stone-50 text-stone-900 uppercase tracking-wider font-bold border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Hizmet adı</th>
                  <th className="px-6 py-4">Sayfa adresi</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900">{service.title}</td>
                    <td className="px-6 py-4">/{service.slug}</td>
                    <td className="px-6 py-4">
                      {service.isFeatured && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-1 rounded font-bold uppercase">Öne çıkan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                      <button 
                        onClick={() => handleEditClick(service)}
                        className="text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
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

