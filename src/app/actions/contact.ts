"use server";

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// İletişim ayarlarını getir (Yoksa varsayılan değerlerle oluşturur)
export async function getContactSettings() {
  try {
    let settings = await prisma.contactSettings.findFirst();

    if (!settings) {
      settings = await prisma.contactSettings.create({
        data: {
          address: "Kıbrıs Şehitleri Caddesi No: 00/0, Alsancak, 35220 Konak / İzmir",
          phone1: "+90 (555) 000 00 00",
          phone2: "+90 (555) 000 00 01",
          email: "bilgi@psikolog.com",
          phones: [
            { label: "Randevu", value: "+90 (555) 000 00 00" },
            { label: "WhatsApp", value: "+90 (555) 000 00 01" }
          ],
          emails: [
            { label: "Randevu & Danışma", value: "bilgi@psikolog.com" }
          ],
          socialLinks: [
            { name: "Instagram", url: "https://instagram.com" },
            { name: "LinkedIn", url: "https://linkedin.com" }
          ],
          mapIframe: "",
          logo: "",
          logoFooter: ""
        }
      });
    }

    return { success: true, data: settings };
  } catch (error) {
    console.error("getContactSettings error:", error);
    return { success: false, error: "İletişim bilgileri alınamadı." };
  }
}

// İletişim ayarlarını güncelle
export async function updateContactSettings(formData: {
  address: string;
  phone1: string;
  phone2?: string;
  email: string;
  phones?: any;
  emails?: any;
  socialLinks: any;
  mapIframe: string;
  logo?: string;
  logoFooter?: string;
}) {
  try {
    const settings = await prisma.contactSettings.findFirst();

    if (settings) {
      await prisma.contactSettings.update({
        where: { id: settings.id },
        data: {
          address: formData.address,
          phone1: formData.phone1,
          phone2: formData.phone2,
          email: formData.email,
          phones: formData.phones,
          emails: formData.emails,
          socialLinks: formData.socialLinks,
          mapIframe: formData.mapIframe,
          logo: formData.logo,
          logoFooter: formData.logoFooter,
        }
      });
    } else {
      await prisma.contactSettings.create({
        data: {
          address: formData.address,
          phone1: formData.phone1,
          phone2: formData.phone2,
          email: formData.email,
          phones: formData.phones,
          emails: formData.emails,
          socialLinks: formData.socialLinks,
          mapIframe: formData.mapIframe,
          logo: formData.logo,
          logoFooter: formData.logoFooter,
        }
      });
    }

    // Cache'i temizle
    revalidatePath('/', 'layout');
    revalidatePath('/contact');

    return { success: true };
  } catch (error) {
    console.error("updateContactSettings error:", error);
    return { success: false, error: "İletişim bilgileri güncellenirken hata oluştu." };
  }
}
