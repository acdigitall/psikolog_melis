"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Production (Terapi Süreci) Info Actions ---

export async function getProductionInfo() {
  try {
    let info = await prisma.productionInfo.findFirst();
    
    if (!info) {
      info = await prisma.productionInfo.create({
        data: {
          title: "Terapi Sürecimiz Nasıl İlerler?",
          desc: "Psikoterapi, kendinizi daha derinlemesine tanıma, zorlayıcı duyguları anlama ve yaşam kalitenizi artırma yolculuğudur. Sürecimiz adım adım ve tamamen sizin temponuza uygun ilerler.",
          img: "/images/surec-yolculuk.jpg",
          metaTitle: "Terapi Süreci & Danışmanlık Yaklaşımı | Uzm. Klinik Psikolog",
          metaDesc: "İlk görüşmeden hedeflere, düzenli seanslardan sağlıklı sonlandırmaya kadar adım adım psikolojik danışmanlık süreci.",
          metaKeys: "terapi süreci, psikolog seansı nasıl geçer, terapi aşamaları"
        }
      });
    }

    return { success: true, data: info };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function upsertProductionInfo(data: {
  title: string;
  desc: string;
  img: string;
  metaTitle?: string;
  metaDesc?: string;
  metaKeys?: string;
}) {
  try {
    const existing = await prisma.productionInfo.findFirst();
    let result;

    if (existing) {
      result = await prisma.productionInfo.update({
        where: { id: existing.id },
        data
      });
    } else {
      result = await prisma.productionInfo.create({
        data
      });
    }

    revalidatePath("/production");
    revalidatePath("/admin/production");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Production (Terapi Süreci) Steps Actions ---

const defaultProductionSteps = [
  {
    order: 1,
    title: "İlk Tanışma ve Değerlendirme (Anamnez)",
    desc: "İlk seansta sizi terapiye getiren nedenler, beklentileriniz ve yaşam öykünüz ayrıntılı olarak dinlenir; terapi için güvenli bağın temelleri atılır."
  },
  {
    order: 2,
    title: "Birlikte Hedef Belirleme",
    desc: "Hangi alanlarda değişim istediğinizi (kaygı yönetimi, ilişki problemleri, özgüven, travmalar vb.) netleştirir, somut ve ulaşılabilir terapi hedefleri oluştururuz."
  },
  {
    order: 3,
    title: "Kişiye Özel Terapi Planı ve Ekol Seçimi",
    desc: "İhtiyaçlarınıza en uygun bilimsel ekol (Bilişsel Davranışçı Terapi, EMDR veya Şema Terapi) belirlenerek yapılandırılmış bir yol haritası hazırlanır."
  },
  {
    order: 4,
    title: "Düzenli Seanslar ve Farkındalık Çalışmaları",
    desc: "Haftalık veya iki haftada bir gerçekleşen 50 dakikalık seanslarla düşünce kalıpları, duygusal tetikleyiciler ve davranış döngüleri üzerinde çalışılır."
  },
  {
    order: 5,
    title: "İçsel Baş Etme Becerileri ve Güçlenme",
    desc: "Seanslarda edinilen yeni bakış açıları, gevşeme egzersizleri ve farkındalık çalışmaları günlük hayata entegre edilerek danışanın kendi rehberi olması desteklenir."
  },
  {
    order: 6,
    title: "Değerlendirme ve Sağlıklı Sonlandırma",
    desc: "Belirlenen hedeflere ulaşıldığında seans aralıkları kademeli olarak açılır; kazanılan becerilerin pekiştirilmesi ile terapi süreci başarıyla tamamlanır."
  }
];

export async function getProductionSteps() {
  try {
    let steps = await prisma.productionStep.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    if (steps.length === 0) {
      for (const step of defaultProductionSteps) {
        await prisma.productionStep.create({ data: step });
      }
      steps = await prisma.productionStep.findMany({
        orderBy: { order: 'asc' }
      });
    }

    return { success: true, data: steps };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProductionStep(data: {
  title: string;
  desc: string;
  order: number;
}) {
  try {
    const step = await prisma.productionStep.create({
      data
    });
    revalidatePath("/production");
    revalidatePath("/admin/production");
    return { success: true, data: step };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductionStep(id: number, data: {
  title: string;
  desc: string;
  order: number;
}) {
  try {
    const step = await prisma.productionStep.update({
      where: { id },
      data
    });
    revalidatePath("/production");
    revalidatePath("/admin/production");
    return { success: true, data: step };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProductionStep(id: number) {
  try {
    await prisma.productionStep.delete({
      where: { id }
    });
    revalidatePath("/production");
    revalidatePath("/admin/production");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
