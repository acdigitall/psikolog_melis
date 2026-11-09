"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getContactSettings, updateContactSettings } from '@/app/actions/contact';
import { uploadImageAction } from '@/app/actions/upload';
import PageHeaderForm from '@/components/admin/PageHeaderForm';

export default function ContactSettingsAdmin() {
  const [formData, setFormData] = useState({
    address: '',
    phone1: '',
    phone2: '',
    email: '',
    mapIframe: '',
    logo: '',
    logoFooter: '',
  });

  const [phones, setPhones] = useState<{ label: string, value: string }[]>([]);
  const [emails, setEmails] = useState<{ label: string, value: string }[]>([]);
  const [socialLinks, setSocialLinks] = useState<{ platform: string, url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<'logo' | 'logoFooter' | null>(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchSettings = async () => {
    const res = await getContactSettings();
    if (res.success && res.data) {
      setFormData({
        address: res.data.address || '',
        phone1: res.data.phone1 || '',
        phone2: res.data.phone2 || '',
        email: res.data.email || '',
        mapIframe: res.data.mapIframe || '',
        logo: res.data.logo || '',
        logoFooter: res.data.logoFooter || '',
      });

      // Fetch dynamic phones
      let parsedPhones = [];
      try {
        parsedPhones = typeof res.data.phones === 'string'
          ? JSON.parse(res.data.phones)
          : res.data.phones;
      } catch (e) {
        console.error(e);
      }
      if (!Array.isArray(parsedPhones) || parsedPhones.length === 0) {
        parsedPhones = [];
        if (res.data.phone1) parsedPhones.push({ label: 'Randevu', value: res.data.phone1 });
        if (res.data.phone2) parsedPhones.push({ label: 'Diğer telefon', value: res.data.phone2 });
      }
      setPhones(parsedPhones);

      // Fetch dynamic emails
      let parsedEmails = [];
      try {
        parsedEmails = typeof res.data.emails === 'string'
          ? JSON.parse(res.data.emails)
          : res.data.emails;
      } catch (e) {
        console.error(e);
      }
      if (!Array.isArray(parsedEmails) || parsedEmails.length === 0) {
        parsedEmails = [];
        if (res.data.email) parsedEmails.push({ label: 'E-posta', value: res.data.email });
      }
      setEmails(parsedEmails);
      
      let parsedLinks = [];
      try {
        parsedLinks = typeof res.data.socialLinks === 'string' 
          ? JSON.parse(res.data.socialLinks) 
          : res.data.socialLinks;
      } catch (e) {
        console.error(e);
      }
      setSocialLinks(Array.isArray(parsedLinks) ? parsedLinks : []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo' | 'logoFooter') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const res = await uploadImageAction(uploadFormData);
    if (res.success && res.url) {
      setFormData(prev => ({ ...prev, [fieldName]: res.url }));
      setMessage({ text: 'Logo yüklendi. Uygulamak için "Değişiklikleri Kaydet"e tıklayın.', type: 'success' });
    } else {
      setMessage({ text: res.error || 'Logo yüklenemedi.', type: 'error' });
    }
    setUploadingField(null);
  };

  const addPhone = () => {
    setPhones([...phones, { label: 'Telefon', value: '' }]);
  };

  const removePhone = (index: number) => {
    const newPhones = [...phones];
    newPhones.splice(index, 1);
    setPhones(newPhones);
  };

  const updatePhone = (index: number, field: 'label' | 'value', value: string) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
  };

  const addEmail = () => {
    setEmails([...emails, { label: 'E-posta', value: '' }]);
  };

  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const updateEmail = (index: number, field: 'label' | 'value', value: string) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'Yeni Platform', url: 'https://' }]);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    // Sync first elements to discrete phone1, phone2, and email fields to ensure backwards compatibility
    const firstPhone = phones[0]?.value || '';
    const secondPhone = phones[1]?.value || '';
    const firstEmail = emails[0]?.value || '';

    const res = await updateContactSettings({
      ...formData,
      phone1: firstPhone,
      phone2: secondPhone,
      email: firstEmail,
      phones: phones,
      emails: emails,
      socialLinks: socialLinks
    });

    if (res.success) {
      setMessage({ text: 'Ayarlar kaydedildi.', type: 'success' });
    } else {
      setMessage({ text: res.error || 'Bir hata oluştu.', type: 'error' });
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-8 text-center text-stone-500">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <PageHeaderForm pageIdentifier="contact" />
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
          <h1 className="text-2xl font-serif text-stone-900">İletişim Ayarları</h1>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`mb-6 p-4 rounded text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Site Logo Section */}
            <div className="space-y-6 bg-stone-50 p-6 rounded-lg border border-stone-200">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Site logoları</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Menüde, yükleme ekranında, alt bilgide ve yönetim panelinde kullanılan logoları güncelleyin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Header & Loading Screen Logo */}
                <div className="bg-white p-4 rounded border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 uppercase">
                      Menü ve yükleme ekranı logosu (açık zemin)
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                      className="text-[11px] text-amber-700 hover:underline font-semibold"
                    >
                      Varsayılana dön
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="h-20 bg-stone-100 rounded border border-dashed border-stone-300 flex items-center justify-center p-3 relative overflow-hidden">
                    {formData.logo ? (
                      <Image
                        src={formData.logo}
                        alt="Üst logo önizlemesi"
                        width={180}
                        height={60}
                        className="max-h-full w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xs text-stone-400">Logo yok</span>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <label className="cursor-pointer px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded hover:bg-amber-800 transition-colors shrink-0">
                        {uploadingField === 'logo' ? 'Yükleniyor...' : 'Görsel Yükle'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'logo')}
                          disabled={uploadingField === 'logo'}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        name="logo"
                        value={formData.logo}
                        onChange={handleInputChange}
                        placeholder="/uploads/..."
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer & Yönetim paneli logosu */}
                <div className="bg-stone-900 text-white p-4 rounded border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-200 uppercase">
                      Alt bilgi ve yönetim paneli logosu (koyu zemin)
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoFooter: '' }))}
                      className="text-[11px] text-amber-400 hover:underline font-semibold"
                    >
                      Varsayılana dön
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="h-20 bg-stone-950 rounded border border-dashed border-stone-800 flex items-center justify-center p-3 relative overflow-hidden">
                    {formData.logoFooter ? (
                      <Image
                        src={formData.logoFooter}
                        alt="Alt logo önizlemesi"
                        width={180}
                        height={60}
                        className="max-h-full w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xs text-stone-600">Logo yok</span>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <label className="cursor-pointer px-4 py-2 bg-amber-700 text-white text-xs font-bold rounded hover:bg-amber-600 transition-colors shrink-0">
                        {uploadingField === 'logoFooter' ? 'Yükleniyor...' : 'Görsel Yükle'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'logoFooter')}
                          disabled={uploadingField === 'logoFooter'}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        name="logoFooter"
                        value={formData.logoFooter}
                        onChange={handleInputChange}
                        placeholder="/uploads/..."
                        className="w-full bg-stone-800 border border-stone-700 text-stone-100 px-3 py-2 text-xs rounded focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Dynamic Telefon numaraları */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Telefon numaraları</label>
                <button
                  type="button"
                  onClick={addPhone}
                  className="px-3 py-1 bg-stone-200 text-stone-700 text-xs font-bold rounded hover:bg-stone-300 transition-colors"
                >
                  + Telefon ekle
                </button>
              </div>

              {phones.length === 0 ? (
                <div className="text-sm text-stone-500 italic p-4 bg-stone-50 rounded text-center border border-dashed border-stone-300">
                  Henüz telefon numarası eklenmedi.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {phones.map((p, index) => (
                    <div key={index} className="flex gap-3 items-center bg-stone-50 p-3 rounded border border-stone-200">
                      <input
                        type="text"
                        placeholder="Etiket (ör. Randevu, WhatsApp)"
                        value={p.label}
                        onChange={(e) => updatePhone(index, 'label', e.target.value)}
                        className="w-1/3 bg-white border border-stone-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-amber-700 transition-colors"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Telefon numarası"
                        value={p.value}
                        onChange={(e) => updatePhone(index, 'value', e.target.value)}
                        className="w-full bg-white border border-stone-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-amber-700 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removePhone(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        title="Sil"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Emails */}
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">E-posta adresleri</label>
                <button
                  type="button"
                  onClick={addEmail}
                  className="px-3 py-1 bg-stone-200 text-stone-700 text-xs font-bold rounded hover:bg-stone-300 transition-colors"
                >
                  + E-posta ekle
                </button>
              </div>

              {emails.length === 0 ? (
                <div className="text-sm text-stone-500 italic p-4 bg-stone-50 rounded text-center border border-dashed border-stone-300">
                  Henüz e-posta adresi eklenmedi.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {emails.map((emailItem, index) => (
                    <div key={index} className="flex gap-3 items-center bg-stone-50 p-3 rounded border border-stone-200">
                      <input
                        type="text"
                        placeholder="Etiket (ör. Randevu, Genel bilgi)"
                        value={emailItem.label}
                        onChange={(e) => updateEmail(index, 'label', e.target.value)}
                        className="w-1/3 bg-white border border-stone-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-amber-700 transition-colors"
                        required
                      />
                      <input
                        type="email"
                        placeholder="E-posta adresi"
                        value={emailItem.value}
                        onChange={(e) => updateEmail(index, 'value', e.target.value)}
                        className="w-full bg-white border border-stone-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-amber-700 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        title="Sil"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Adres</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded focus:outline-none focus:border-amber-700 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Google Haritalar yerleştirme bağlantısı (src)</label>
              <p className="text-xs text-stone-400 mb-2">Google Haritalar’daki "Haritayı yerleştir" kodunda yalnızca src=" " içindeki adresi yapıştırın.</p>
              <textarea
                name="mapIframe"
                value={formData.mapIframe}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded focus:outline-none focus:border-amber-700 transition-colors"
                required
              />
            </div>

            {/* Dynamic Social Media */}
            <div className="pt-6 border-t border-stone-200">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-stone-800 uppercase tracking-wider block">Sosyal medya hesapları</label>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="px-3 py-1 bg-stone-200 text-stone-700 text-xs font-bold rounded hover:bg-stone-300 transition-colors"
                >
                  + Yeni ekle
                </button>
              </div>

              {socialLinks.length === 0 ? (
                <div className="text-sm text-stone-500 italic p-4 bg-stone-50 rounded text-center border border-dashed border-stone-300">
                  Henüz sosyal medya hesabı eklenmedi.
                </div>
              ) : (
                <div className="space-y-3">
                  {socialLinks.map((link, index) => {
                    const SOCIAL_PLATFORMS = [
                      "Facebook",
                      "Instagram",
                      "Twitter / X",
                      "LinkedIn",
                      "YouTube",
                      "TikTok",
                      "WhatsApp",
                      "Pinterest",
                      "Diğer"
                    ];
                    
                    const isCustom = !SOCIAL_PLATFORMS.includes(link.platform) && link.platform !== 'Yeni Platform';
                    const options = isCustom ? [...SOCIAL_PLATFORMS.slice(0, -1), link.platform, "Diğer"] : SOCIAL_PLATFORMS;

                    return (
                      <div key={index} className="flex gap-3 items-center bg-stone-50 p-3 rounded border border-stone-200">
                        <select
                          value={link.platform === 'Yeni Platform' || link.platform === 'Yeni Platform' ? "Diğer" : link.platform}
                          onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                          className="w-1/3 bg-white border border-stone-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-amber-700 transition-colors"
                        >
                          {options.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="URL (https://...)"
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          className="w-full bg-white border border-stone-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-amber-700 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                          title="Sil"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-stone-200 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
