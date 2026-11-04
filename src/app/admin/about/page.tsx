"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAboutPage, updateAboutPage } from '@/app/actions/about';
import { uploadImageAction } from '@/app/actions/upload';
import PageHeaderForm from '@/components/admin/PageHeaderForm';

export default function AboutAdmin() {
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

  const [storyImg, setStoryImg] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDesc1, setStoryDesc1] = useState("");
  const [storyDesc2, setStoryDesc2] = useState("");

  const [visionTitle, setVisionTitle] = useState("");
  const [visionText, setVisionText] = useState("");
  const [missionTitle, setMissionTitle] = useState("");
  const [missionText, setMissionText] = useState("");

  const [bridgeLabel, setBridgeLabel] = useState("");
  const [bridgeTitle, setBridgeTitle] = useState("");
  const [bridgeDesc1, setBridgeDesc1] = useState("");
  const [bridgeDesc2, setBridgeDesc2] = useState("");
  const [bridgeImg, setBridgeImg] = useState("");

  const [brochureLabel, setBrochureLabel] = useState("");
  const [brochureTitle, setBrochureTitle] = useState("");
  const [brochureDesc, setBrochureDesc] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  
  const [brochureHighlights, setBrochureHighlights] = useState<any[]>([]);
  const [materialsTitle, setMaterialsTitle] = useState("");
  const [materials, setMaterials] = useState("");

  const [policyTitle, setPolicyTitle] = useState("");
  const [policies, setPolicies] = useState<any[]>([]);

  async function fetchData() {
    setLoading(true);
    const res = await getAboutPage();
    if (res.success && res.data) {
      const d = res.data;
      setDataId(d.id);
      
      setMetaTitle(d.metaTitle || "");
      setMetaDesc(d.metaDesc || "");
      setMetaKeys(d.metaKeys || "");

      setStoryImg(d.storyImg || "");
      setStoryTitle(d.storyTitle || "");
      setStoryDesc1(d.storyDesc1 || "");
      setStoryDesc2(d.storyDesc2 || "");

      setVisionTitle(d.visionTitle || "");
      setVisionText(d.visionText || "");
      setMissionTitle(d.missionTitle || "");
      setMissionText(d.missionText || "");

      setBridgeLabel(d.bridgeLabel || "");
      setBridgeTitle(d.bridgeTitle || "");
      setBridgeDesc1(d.bridgeDesc1 || "");
      setBridgeDesc2(d.bridgeDesc2 || "");
      setBridgeImg(d.bridgeImg || "");

      setBrochureLabel(d.brochureLabel || "");
      setBrochureTitle(d.brochureTitle || "");
      setBrochureDesc(d.brochureDesc || "");
      setBrochureUrl(d.brochureUrl || "");
      
      try { setBrochureHighlights(typeof d.brochureHighlights === 'string' ? JSON.parse(d.brochureHighlights) : d.brochureHighlights); } catch(e) {}
      setMaterialsTitle(d.materialsTitle || "");
      setMaterials(d.materials || "");

      setPolicyTitle(d.policyTitle || "");
      try { setPolicies(typeof d.policies === 'string' ? JSON.parse(d.policies) : d.policies); } catch(e) {}
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
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
    const res = await updateAboutPage(dataId, {
      metaTitle, metaDesc, metaKeys,
      storyImg, storyTitle, storyDesc1, storyDesc2,
      visionTitle, visionText, missionTitle, missionText,
      bridgeLabel, bridgeTitle, bridgeDesc1, bridgeDesc2, bridgeImg,
      brochureLabel, brochureTitle, brochureDesc, brochureUrl,
      brochureHighlights: JSON.stringify(brochureHighlights),
      materialsTitle, materials,
      policyTitle,
      policies: JSON.stringify(policies)
    });
    setSaving(false);

    if (res.success) {
      alert("About page updated successfully.");
    } else {
      alert("Error: " + res.error);
    }
  };

  // Generic JSON Array Handler
  const handleArrayChange = (setter: any, array: any[], index: number, field: string, value: string) => {
    const newArr = [...array];
    newArr[index][field] = value;
    setter(newArr);
  };
  const addArrayItem = (setter: any, array: any[]) => setter([...array, { title: "", desc: "" }]);
  const removeArrayItem = (setter: any, array: any[], index: number) => {
    const newArr = [...array];
    newArr.splice(index, 1);
    setter(newArr);
  };

  if (loading) return <div className="p-8 text-stone-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <PageHeaderForm pageIdentifier="about" />
      <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">About Page Content</h1>
          <p className="text-sm text-stone-500 mt-1">Manage all sections on your website's About page.</p>
        </div>
      </div>

      <form className="space-y-12 pb-24" onSubmit={handleSave}>
        
        {/* SEO Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">SEO Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Meta Title</label>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Keywords</label>
              <input type="text" value={metaKeys} onChange={(e) => setMetaKeys(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Meta Description</label>
            <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Our Story Section</h2>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Upload Cover Image</label>
            {storyImg ? (
              <div className="relative aspect-[4/3] w-full max-w-sm bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded">
                <Image src={storyImg} alt="Cover Image" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => setStoryImg('')} className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-red-700 transition-colors">Remove Image</button>
                </div>
              </div>
            ) : (
              <label 
                onDragOver={(e) => handleDragOver(e, 'story')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, setStoryImg, 'story')}
                className={`block w-full max-w-sm border-2 border-dashed px-4 py-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded ${dragField === 'story' ? 'border-amber-700 bg-amber-50/50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}`}
              >
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setStoryImg, 'story')} disabled={uploadingField === 'story'} className="hidden" />
                <span className="text-sm font-bold text-stone-700">{uploadingField === 'story' ? 'Uploading...' : 'Select or Drag Image'}</span>
                <p className="text-amber-700 font-medium text-xs mt-1">Recommended Image Size: 800 x 800px (square format)</p>
              </label>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Title</label>
            <input type="text" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Paragraph 1</label>
            <textarea value={storyDesc1} onChange={(e) => setStoryDesc1(e.target.value)} rows={3} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Paragraph 2</label>
            <textarea value={storyDesc2} onChange={(e) => setStoryDesc2(e.target.value)} rows={3} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Vision Title</label>
                <input type="text" value={visionTitle} onChange={(e) => setVisionTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" placeholder="e.g. Our Vision" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Vision Text</label>
                <textarea value={visionText} onChange={(e) => setVisionText(e.target.value)} rows={4} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Mission Title</label>
                <input type="text" value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" placeholder="e.g. Our Mission" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Mission Text</label>
                <textarea value={missionText} onChange={(e) => setMissionText(e.target.value)} rows={4} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
              </div>
            </div>
          </div>
        </section>

        {/* Bridge Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Bridge Section</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Top Label</label>
              <input type="text" value={bridgeLabel} onChange={(e) => setBridgeLabel(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Upload Image</label>
              {bridgeImg ? (
                <div className="relative aspect-[3/2] w-full max-w-sm bg-stone-100 border border-stone-200 shadow-sm overflow-hidden group rounded">
                  <Image src={bridgeImg} alt="Bridge Image" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setBridgeImg('')} className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-red-700 transition-colors">Remove Image</button>
                  </div>
                </div>
              ) : (
                <label 
                  onDragOver={(e) => handleDragOver(e, 'bridge')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, setBridgeImg, 'bridge')}
                  className={`block w-full border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded ${dragField === 'bridge' ? 'border-amber-700 bg-amber-50/50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}`}
                >
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setBridgeImg, 'bridge')} disabled={uploadingField === 'bridge'} className="hidden" />
                  <span className="text-sm font-bold text-stone-700">{uploadingField === 'bridge' ? 'Uploading...' : 'Select or Drag Image'}</span>
                  <p className="text-amber-700 font-medium text-xs mt-1">Recommended Image Size: 1920 x 1080px (16:9 landscape format)</p>
                </label>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Main Title (You can use HTML &lt;br/&gt;)</label>
            <input type="text" value={bridgeTitle} onChange={(e) => setBridgeTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Paragraph 1</label>
            <textarea value={bridgeDesc1} onChange={(e) => setBridgeDesc1(e.target.value)} rows={3} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Paragraph 2</label>
            <textarea value={bridgeDesc2} onChange={(e) => setBridgeDesc2(e.target.value)} rows={3} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
        </section>

        {/* Brochure Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Corporate Publications / Brochure</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Top Label</label>
              <input type="text" value={brochureLabel} onChange={(e) => setBrochureLabel(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Upload Brochure File (PDF)</label>
              {brochureUrl ? (
                <div className="flex gap-4 items-center bg-stone-100 p-4 rounded border border-stone-200">
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-stone-600">{brochureUrl}</div>
                  <button type="button" onClick={() => setBrochureUrl('')} className="px-4 py-2 bg-red-600 text-white font-bold text-xs uppercase rounded">Remove</button>
                </div>
              ) : (
                <label 
                  onDragOver={(e) => handleDragOver(e, 'brochure')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, setBrochureUrl, 'brochure')}
                  className={`block w-full border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all rounded ${dragField === 'brochure' ? 'border-amber-700 bg-amber-50/50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}`}
                >
                  <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, setBrochureUrl, 'brochure')} disabled={uploadingField === 'brochure'} className="hidden" />
                  <span className="text-sm font-bold text-stone-700">{uploadingField === 'brochure' ? 'Uploading...' : 'Select or Drag PDF'}</span>
                </label>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Title</label>
            <input type="text" value={brochureTitle} onChange={(e) => setBrochureTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Description</label>
            <textarea value={brochureDesc} onChange={(e) => setBrochureDesc(e.target.value)} rows={2} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
          
          <div className="mt-8 border-t border-stone-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Highlights List</label>
              <button type="button" onClick={() => addArrayItem(setBrochureHighlights, brochureHighlights)} className="text-xs bg-amber-700 text-white px-3 py-1 rounded">Add</button>
            </div>
            <div className="space-y-4">
              {brochureHighlights.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-stone-50 p-4 rounded border border-stone-200">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={item.title} onChange={(e) => handleArrayChange(setBrochureHighlights, brochureHighlights, idx, 'title', e.target.value)} className="w-full bg-white border border-stone-200 px-3 py-2 rounded text-sm" placeholder="Title" />
                    <textarea value={item.desc} onChange={(e) => handleArrayChange(setBrochureHighlights, brochureHighlights, idx, 'desc', e.target.value)} className="w-full bg-white border border-stone-200 px-3 py-2 rounded text-sm" placeholder="Description" rows={2} />
                  </div>
                  <button type="button" onClick={() => removeArrayItem(setBrochureHighlights, brochureHighlights, idx)} className="text-red-500 font-bold px-2 py-1">X</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Materials Used Title</label>
              <input type="text" value={materialsTitle} onChange={(e) => setMaterialsTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" placeholder="e.g. High Quality Wood & Panels We Use" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Materials Used (Separate with commas)</label>
              <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} rows={3} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" placeholder="MDF, Solid Wood, ..." />
            </div>
          </div>
        </section>

        {/* Policy Section */}
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-stone-200 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Our Quality Policy</h2>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Title</label>
            <input type="text" value={policyTitle} onChange={(e) => setPolicyTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded" />
          </div>
          <div className="mt-6 border-t border-stone-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-stone-900 uppercase tracking-wider block">Policy Items</label>
              <button type="button" onClick={() => addArrayItem(setPolicies, policies)} className="text-xs bg-amber-700 text-white px-3 py-1 rounded">Add</button>
            </div>
            <div className="space-y-4">
              {policies.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-stone-50 p-4 rounded border border-stone-200">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={item.title} onChange={(e) => handleArrayChange(setPolicies, policies, idx, 'title', e.target.value)} className="w-full bg-white border border-stone-200 px-3 py-2 rounded text-sm" placeholder="Title" />
                    <textarea value={item.desc} onChange={(e) => handleArrayChange(setPolicies, policies, idx, 'desc', e.target.value)} className="w-full bg-white border border-stone-200 px-3 py-2 rounded text-sm" placeholder="Description" rows={2} />
                  </div>
                  <button type="button" onClick={() => removeArrayItem(setPolicies, policies, idx)} className="text-red-500 font-bold px-2 py-1">X</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-6 border-t border-stone-200">
          <button 
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

