"use client";

import { useState, useEffect } from "react";
import { updatePageHeader, getPageHeader } from "@/app/actions/page-headers";

interface PageHeaderFormProps {
  pageIdentifier: string;
}

export default function PageHeaderForm({ pageIdentifier }: PageHeaderFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchHeader() {
      const res = await getPageHeader(pageIdentifier);
      if (res.success && res.data) {
        setTitle(res.data.title);
        setDescription(res.data.description);
      }
    }
    fetchHeader();
  }, [pageIdentifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    const res = await updatePageHeader(pageIdentifier, title, description);
    
    if (res.success) {
      setMessage({ text: "Sayfa başlık bilgisi başarıyla güncellendi.", type: "success" });
    } else {
      setMessage({ text: res.message || "Bir hata oluştu.", type: "error" });
    }
    
    setIsLoading(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 mb-12">
      <h2 className="text-xl font-serif font-bold text-stone-900 mb-6 pb-2 border-b border-stone-100 uppercase">
        Sayfa Başlık & Açıklama Bilgileri
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Başlık *</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Ürünlerimiz"
            className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Açıklama (İsteğe Bağlı)</label>
          <textarea 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Başlığın altında görüntülenecek açıklama metni..."
            className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded resize-y" 
          />
        </div>

        {message.text && (
          <div className={`p-4 rounded text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded shadow hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </section>
  );
}

