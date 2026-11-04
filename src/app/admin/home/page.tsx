"use client";

import { useEffect, useState } from 'react';
import { getHomePage, updateHomePage } from '@/app/actions/home';
import { uploadImageAction } from '@/app/actions/upload';
import Image from 'next/image';

export default function HomeAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dataId, setDataId] = useState<number | null>(null);

  // Upload states
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [dragField, setDragField] = useState<string | null>(null);

  // Form states
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaKeys, setMetaKeys] = useState("");
  const [servicesTitle, setServicesTitle] = useState("");
  const [whyUsTitle, setWhyUsTitle] = useState("");
  const [whyUsItems, setWhyUsItems] = useState<{title:string, desc:string}[]>([]);
  const [whyUsImg, setWhyUsImg] = useState("");
  const [projectsTitle, setProjectsTitle] = useState("");
  const [projectsDesc, setProjectsDesc] = useState("");
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDesc, setCtaDesc] = useState("");
  const [ctaBtn1Text, setCtaBtn1Text] = useState("");
  const [ctaBtn1Link, setCtaBtn1Link] = useState("");
  const [ctaBtn2Text, setCtaBtn2Text] = useState("");
  const [ctaBtn2Link, setCtaBtn2Link] = useState("");

  async function loadData() {
    const res = await getHomePage();
    if (res.success && res.data) {
      const d = res.data;
      setDataId(d.id);
      setMetaTitle(d.metaTitle || "");
      setMetaDesc(d.metaDesc || "");
      setMetaKeys(d.metaKeys || "");
      setServicesTitle(d.servicesTitle || "");
      setWhyUsTitle(d.whyUsTitle || "");
      try {
        setWhyUsItems(typeof d.whyUsItems === 'string' ? JSON.parse(d.whyUsItems) : d.whyUsItems);
      } catch (e) {
        setWhyUsItems([]);
      }
      setWhyUsImg(d.whyUsImg || "");
      setProjectsTitle(d.projectsTitle || "");
      setProjectsDesc(d.projectsDesc || "");
      setCtaTitle(d.ctaTitle || "");
      setCtaDesc(d.ctaDesc || "");
      setCtaBtn1Text(d.ctaBtn1Text || "");
      setCtaBtn1Link(d.ctaBtn1Link || "");
      setCtaBtn2Text(d.ctaBtn2Text || "");
      setCtaBtn2Link(d.ctaBtn2Link || "");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const uploadFile = async (file: File, setUrl: (url: string) => void, fieldName: string) => {
    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadImageAction(formData);
    setUploadingField(null);
    if (res.success && res.url) {
      setUrl(res.url);
      alert('File uploaded successfully.');
    } else {
      alert(res.error || 'Failed to upload file.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file, setUrl, fieldName);
  };

  const handleDragOver = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    setDragField(fieldName);
  };

  const handleDragLeave = () => {
    setDragField(null);
  };

  const handleDrop = async (e: React.DragEvent, setUrl: (url: string) => void, fieldName: string) => {
    e.preventDefault();
    setDragField(null);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file, setUrl, fieldName);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataId) return;

    setSaving(true);
    const res = await updateHomePage(dataId, {
      metaTitle, metaDesc, metaKeys,
      servicesTitle, whyUsTitle, whyUsImg,
      whyUsItems: JSON.stringify(whyUsItems),
      projectsTitle, projectsDesc,
      ctaTitle, ctaDesc, ctaBtn1Text, ctaBtn1Link, ctaBtn2Text, ctaBtn2Link
    });
    setSaving(false);

    if (res.success) {
      alert("Home page updated successfully!");
    } else {
      alert(res.error || "An error occurred.");
    }
  };

  // Why Us Items
  const addWhyUsItem = () => setWhyUsItems([...whyUsItems, { title: "", desc: "" }]);
  const updateWhyUsItem = (index: number, field: string, value: string) => {
    const newItems = [...whyUsItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setWhyUsItems(newItems);
  };
  const removeWhyUsItem = (index: number) => {
    setWhyUsItems(whyUsItems.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-8 text-center text-stone-500 font-bold uppercase tracking-widest">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 mb-2">Home Page Management</h1>
          <p className="text-stone-500">Manage homepage text content and SEO settings.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
        {/* SEO Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">SEO Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Meta Title</label>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Meta Description</label>
              <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded h-24" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Keywords</label>
              <input type="text" value={metaKeys} onChange={(e) => setMetaKeys(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Services Section</h2>
          <div className="space-y-2 max-w-xl">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Section Title</label>
            <input type="text" value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            <p className="text-xs text-stone-500 mt-2">Service cards are automatically fetched from items created under "Services" page where "Featured on Homepage" option is checked.</p>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Why Choose Us?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Section Title</label>
              <input type="text" value={whyUsTitle} onChange={(e) => setWhyUsTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Upload Cover Image</label>
              {whyUsImg ? (
                <div className="relative aspect-[4/3] w-full max-w-sm bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded">
                  <Image src={whyUsImg} alt="Image" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setWhyUsImg('')} className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-red-700 transition-colors">Remove Image</button>
                  </div>
                </div>
              ) : (
                <label 
                  onDragOver={(e) => handleDragOver(e, 'whyUs')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, setWhyUsImg, 'whyUs')}
                  className={`block w-full max-w-sm border-2 border-dashed px-4 py-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded ${dragField === 'whyUs' ? 'border-amber-700 bg-amber-50/50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}`}
                >
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setWhyUsImg, 'whyUs')} disabled={uploadingField === 'whyUs'} className="hidden" />
                  <span className="text-sm font-bold text-stone-700">{uploadingField === 'whyUs' ? 'Uploading...' : 'Select or Drag Image'}</span>
                  <p className="text-amber-700 font-medium text-xs mt-1">Recommended Image Size: 800 x 800px (square format)</p>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider">Items List</label>
              <button type="button" onClick={addWhyUsItem} className="px-4 py-2 bg-stone-200 text-stone-900 text-xs font-bold uppercase rounded hover:bg-stone-300">Add Item</button>
            </div>
            {whyUsItems.map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-stone-50 p-4 rounded border border-stone-200">
                <div className="flex-1 space-y-4">
                  <input type="text" placeholder="Title (e.g. On-Time Delivery)" value={item.title} onChange={(e) => updateWhyUsItem(index, 'title', e.target.value)} className="w-full bg-white border border-stone-200 px-4 py-3 rounded font-bold" />
                  <textarea placeholder="Description" value={item.desc} onChange={(e) => updateWhyUsItem(index, 'desc', e.target.value)} className="w-full bg-white border border-stone-200 px-4 py-3 rounded h-20 text-sm" />
                </div>
                <button type="button" onClick={() => removeWhyUsItem(index)} className="px-3 py-3 bg-red-100 text-red-600 rounded hover:bg-red-200">Delete</button>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Blog Bölümü (Ana Sayfa)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Section Title</label>
              <input type="text" value={projectsTitle} onChange={(e) => setProjectsTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Description Text</label>
              <textarea value={projectsDesc} onChange={(e) => setProjectsDesc(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded h-24" />
            </div>
          </div>
          <p className="text-xs text-stone-500">Ana sayfada son 3 yayınlanmış blog yazısı otomatik gösterilir.</p>
        </section>

        {/* CTA Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Call to Action (CTA) Section</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Main Heading</label>
              <input type="text" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded font-serif text-lg" placeholder="e.g. Let's Design Your Dream Space Together (Use <br/> for line break)" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Description Paragraph</label>
              <textarea value={ctaDesc} onChange={(e) => setCtaDesc(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded h-24" />
            </div>

            <div className="space-y-4 p-4 border border-stone-200 rounded">
              <h4 className="font-bold text-stone-900 uppercase text-xs">Left Button (Button 1)</h4>
              <div className="space-y-2">
                <input type="text" value={ctaBtn1Text} onChange={(e) => setCtaBtn1Text(e.target.value)} placeholder="Button Text" className="w-full bg-white border border-stone-200 px-4 py-3 rounded" />
              </div>
              <div className="space-y-2">
                <input type="text" value={ctaBtn1Link} onChange={(e) => setCtaBtn1Link(e.target.value)} placeholder="Button Link (e.g. /quote)" className="w-full bg-white border border-stone-200 px-4 py-3 rounded" />
              </div>
            </div>

            <div className="space-y-4 p-4 border border-stone-200 rounded">
              <h4 className="font-bold text-stone-900 uppercase text-xs">Right Button (Button 2)</h4>
              <div className="space-y-2">
                <input type="text" value={ctaBtn2Text} onChange={(e) => setCtaBtn2Text(e.target.value)} placeholder="Button Text" className="w-full bg-white border border-stone-200 px-4 py-3 rounded" />
              </div>
              <div className="space-y-2">
                <input type="text" value={ctaBtn2Link} onChange={(e) => setCtaBtn2Link(e.target.value)} placeholder="Button Link (e.g. /contact)" className="w-full bg-white border border-stone-200 px-4 py-3 rounded" />
              </div>
            </div>
          </div>
        </section>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

