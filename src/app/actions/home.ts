"use server";

import { requireAdmin } from '@/lib/auth';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

const defaultWhyUsItems = [
  { title: "Güvenli ve Yargısız Alan", desc: "Tüm seanslarımızda gizlilik ve etik ilkeler temelinde, kendinizi rahatça ifade edebileceğiniz güvenli bir alan sunulur." },
  { title: "Kanıta Dayalı Terapi Ekolleri", desc: "Bilişsel Davranışçı Terapi (BDT), Şema Terapi ve EMDR gibi bilimsel geçerliliği kanıtlanmış yöntemler uygulanır." },
  { title: "Bireye Özgü Yaklaşım", desc: "Her bireyin içsel dünyası, ihtiyaçları ve geçmiş deneyimleri benzersizdir; terapi süreci tamamen size özel şekillendirilir." },
  { title: "Sürekli Mesleki Gelişim", desc: "Klinik uygulamalar düzenli süpervizyonlar ve uluslararası akredite eğitimlerle sürekli desteklenir." }
];

export async function getHomePage() {
  try {
    let homePage = await prisma.homePage.findFirst();

    if (!homePage) {
      homePage = await prisma.homePage.create({
        data: {
          metaTitle: "melis Sağlam | Bireysel, Çift ve Online Terapi",
          metaDesc: "Kaygı, depresyon, ilişki sorunları ve kişisel gelişim alanlarında bilimsel ekoller ile profesyonel psikolojik danışmanlık.",
          metaKeys: "psikolog, klinik psikolog, bireysel terapi, çift terapisi, online terapi, emdr",
          servicesTitle: "Terapi ve Danışmanlık Hizmetlerimiz",
          whyUsTitle: "Neden Terapi & Neden Bu Yaklaşım?",
          whyUsItems: JSON.stringify(defaultWhyUsItems),
          whyUsImg: "/images/anasayfa-yaklasim.jpg",
          projectsTitle: "Blogdan Son Yazılar",
          projectsDesc: "Ruh sağlığı, ilişkiler ve kendini anlama üzerine sade ve uygulanabilir yazılar.",
          ctaTitle: "Kendinize Bir Adım Atın, <br/>İçsel Yolculuğunuza Başlayın",
          ctaDesc: "Zorlayıcı yaşam olayları, kaygı, ilişki problemleri veya kişisel gelişim hedefleriniz için profesyonel destek almaya bugün karar verin.",
          ctaBtn1Text: "Randevu Alın",
          ctaBtn1Link: "/quote",
          ctaBtn2Text: "İletişime Geçin",
          ctaBtn2Link: "/contact",
        }
      });
    }

    return { success: true, data: homePage };
  } catch (error: any) {
    console.error("getHomePage error:", error);
    return { success: false, error: error.message || "Ana Sayfa verileri çekilemedi." };
  }
}

export async function updateHomePage(
  id: number,
  formData: {
    metaTitle?: string;
    metaDesc?: string;
    metaKeys?: string;
    servicesTitle?: string;
    whyUsTitle?: string;
    whyUsItems?: string;
    whyUsImg?: string;
    projectsTitle?: string;
    projectsDesc?: string;
    ctaTitle?: string;
    ctaDesc?: string;
    ctaBtn1Text?: string;
    ctaBtn1Link?: string;
    ctaBtn2Text?: string;
    ctaBtn2Link?: string;
  }
) {
  try {
    await requireAdmin();
    const updated = await prisma.homePage.update({
      where: { id },
      data: formData
    });

    revalidatePath('/');
    revalidatePath('/admin/home');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("updateHomePage error:", error);
    return { success: false, error: error.message || "Ana Sayfa güncellenemedi." };
  }
}
