"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  getProductionInfo, 
  upsertProductionInfo, 
  getProductionSteps, 
  createProductionStep, 
  updateProductionStep, 
  deleteProductionStep 
} from '@/app/actions/production';
import { uploadImageAction } from '@/app/actions/upload';

export default function ProductionAdmin() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Production Info State
  const [infoId, setInfoId] = useState<number | null>(null);
  const [infoTitle, setInfoTitle] = useState("Terapi Sürecimiz Nasıl İlerler?");
  const [infoDesc, setInfoDesc] = useState("Psikoterapi, kendinizi daha derinlemesine tanıma ve yaşam kalitenizi artırma yolculuğudur.");
  const [infoImg, setInfoImg] = useState("/images/surec-yolculuk.jpg");
  const [infoMetaTitle, setInfoMetaTitle] = useState("");
  const [infoMetaDesc, setInfoMetaDesc] = useState("");
  const [infoMetaKeys, setInfoMetaKeys] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);

  // Production Steps State
  const [steps, setSteps] = useState<any[]>([]);
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [stepId, setStepId] = useState<number | null>(null);
  const [stepTitle, setStepTitle] = useState("");
  const [stepDesc, setStepDesc] = useState("");
  const [stepOrder, setStepOrder] = useState(0);
  const [stepSaving, setStepSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [infoRes, stepsRes] = await Promise.all([
      getProductionInfo(),
      getProductionSteps()
    ]);

    if (infoRes.success && infoRes.data) {
      setInfoId(infoRes.data.id);
      setInfoTitle(infoRes.data.title);
      setInfoDesc(infoRes.data.desc);
      setInfoImg(infoRes.data.img);
      setInfoMetaTitle(infoRes.data.metaTitle || "");
      setInfoMetaDesc(infoRes.data.metaDesc || "");
      setInfoMetaKeys(infoRes.data.metaKeys || "");
    }

    if (stepsRes.success && stepsRes.data) {
      setSteps(stepsRes.data);
    }
    setLoading(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImageAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setInfoImg(res.url);
    } else {
      alert("Yükleme hatası: " + (res.error || "Görsel yüklenemedi"));
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel dosyası yükleyin.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImageAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setInfoImg(res.url);
    } else {
      alert("Yükleme hatası: " + (res.error || "Görsel yüklenemedi"));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    setInfoSaving(true);

    const res = await upsertProductionInfo({
      title: infoTitle,
      desc: infoDesc,
      img: infoImg,
      metaTitle: infoMetaTitle,
      metaDesc: infoMetaDesc,
      metaKeys: infoMetaKeys,
    });

    if (res.success) {
      alert("Terapi süreci bilgileri kaydedildi.");
      fetchData();
    } else {
      alert("Hata: " + res.error);
    }
    setInfoSaving(false);
  }

  function handleAddStep() {
    setStepId(null);
    setStepTitle("");
    setStepDesc("");
    setStepOrder(steps.length + 1);
    setIsEditingStep(true);
  }

  function handleEditStep(step: any) {
    setStepId(step.id);
    setStepTitle(step.title);
    setStepDesc(step.desc);
    setStepOrder(step.order);
    setIsEditingStep(true);
  }

  async function handleSaveStep(e: React.FormEvent) {
    e.preventDefault();
    setStepSaving(true);

    let res;
    if (stepId) {
      res = await updateProductionStep(stepId, {
        title: stepTitle,
        desc: stepDesc,
        order: Number(stepOrder),
      });
    } else {
      res = await createProductionStep({
        title: stepTitle,
        desc: stepDesc,
        order: Number(stepOrder),
      });
    }

    if (res.success) {
      alert("Aşama kaydedildi.");
      setIsEditingStep(false);
      fetchData();
    } else {
      alert("Hata: " + res.error);
    }
    setStepSaving(false);
  }

  async function handleDeleteStep(id: number) {
    if (confirm("Bu terapi aşamasını silmek istediğinize emin misiniz?")) {
      const res = await deleteProductionStep(id);
      if (res.success) {
        fetchData();
      } else {
        alert("Hata: " + res.error);
      }
    }
  }

  if (loading) return <div className="p-8 text-stone-500">Yükleniyor...</div>;

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-serif text-stone-900">Terapi Süreci</h1>
      {/* Production Info Form */}
      <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-stone-200">
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-6 pb-2 border-b border-stone-100">
          Sayfa bilgileri
        </h2>
        
        <form onSubmit={handleSaveInfo} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Sayfa Başlığı *</label>
            <input 
              type="text" 
              required
              value={infoTitle}
              onChange={(e) => setInfoTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Sayfa Açıklaması *</label>
            <textarea 
              required
              rows={3}
              value={infoDesc}
              onChange={(e) => setInfoDesc(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Kapak Görseli *</label>
            
            {infoImg ? (
              <div className="relative aspect-[16/9] w-full max-w-lg bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded-xl">
                <Image 
                  src={infoImg} 
                  alt="Kapak Görseli" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 512px"
                  className="object-cover" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => setInfoImg('')}
                    className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Görseli Değiştir / Kaldır
                  </button>
                </div>
              </div>
            ) : (
              <label 
                htmlFor="production-hero-file"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`block w-full max-w-lg border-2 border-dashed px-4 py-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded-xl ${
                  isDragging 
                    ? 'border-amber-700 bg-amber-50/50' 
                    : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-amber-700'
                }`}
              >
                <input 
                  id="production-hero-file"
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden" 
                />
                <span className="text-sm font-bold text-stone-700">
                  {uploading ? 'Görsel Yükleniyor...' : 'Görsel Seçin veya Buraya Sürükleyin'}
                </span>
                <span className="text-xs text-stone-500 mt-1">PNG, JPG, WEBP (en fazla 8 MB)</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Meta Başlık (SEO)</label>
              <input 
                type="text" 
                value={infoMetaTitle}
                onChange={(e) => setInfoMetaTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Anahtar Kelimeler (SEO)</label>
              <input 
                type="text" 
                value={infoMetaKeys}
                onChange={(e) => setInfoMetaKeys(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Meta Açıklama (SEO)</label>
            <textarea 
              value={infoMetaDesc}
              onChange={(e) => setInfoMetaDesc(e.target.value)}
              rows={2}
              className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
            />
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button 
              type="submit" 
              disabled={infoSaving}
              className="px-8 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              {infoSaving ? 'Kaydediliyor...' : 'Genel Bilgileri Kaydet'}
            </button>
          </div>
        </form>
      </section>

      {/* Production Steps Section */}
      <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-stone-200">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Terapi Aşamaları
          </h2>
          {!isEditingStep && (
            <button 
              onClick={handleAddStep}
              className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Aşama Ekle
            </button>
          )}
        </div>

        {isEditingStep ? (
          <form onSubmit={handleSaveStep} className="bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-6">
            <h3 className="font-bold text-stone-900 uppercase tracking-widest text-xs mb-4">
              {stepId ? 'Aşamayı Düzenle' : 'Yeni Aşama Ekle'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Aşama Başlığı *</label>
                <input 
                  type="text" 
                  required
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Sıra No *</label>
                <input 
                  type="number" 
                  required
                  value={stepOrder}
                  onChange={(e) => setStepOrder(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">Açıklama *</label>
              <textarea 
                required
                rows={3}
                value={stepDesc}
                onChange={(e) => setStepDesc(e.target.value)}
                className="w-full bg-white border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded-lg text-sm" 
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-stone-200">
              <button 
                type="button" 
                onClick={() => setIsEditingStep(false)}
                className="px-6 py-3 bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider hover:bg-stone-300 transition-colors rounded-lg"
              >
                Vazgeç
              </button>
              <button 
                type="submit" 
                disabled={stepSaving}
                className="px-8 py-3 bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                {stepSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {steps.length === 0 ? (
              <p className="text-stone-500 text-center py-8 text-sm">Henüz aşama eklenmedi.</p>
            ) : (
              steps.map((step) => (
                <div key={step.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl gap-4 hover:border-amber-700/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-700/10 text-amber-800 font-bold flex flex-col items-center justify-center shrink-0 rounded-lg">
                      <span className="text-[9px] uppercase leading-none opacity-60">Sıra</span>
                      <span className="text-base leading-none mt-0.5">{step.order}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">{step.title}</h4>
                      <p className="text-sm text-stone-600 line-clamp-2 mt-1">{step.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 self-end md:self-center">
                    <button 
                      onClick={() => handleEditStep(step)}
                      className="px-3 py-1.5 bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-stone-300 transition-colors"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDeleteStep(step.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
