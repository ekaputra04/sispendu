import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionPayload } from "./definitions";
import { jwtVerify, SignJWT } from "jose";
import { toast } from "sonner";
import {
  collection,
  documentId,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@/config/firebase-init";
import {
  FirestoreResponse,
  IAnggotaKeluarga,
  IKartuKeluarga,
  TBanjar,
} from "@/types/types";
import * as XLSX from "xlsx";
import { StatusHubunganDalamKeluarga } from "@/consts/dataDefinitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function handleCopy(text: string) {
  try {
    if (!text) {
      toast.error("Tidak ada teks untuk disalin");
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success("Teks berhasil disalin ke clipboard");
  } catch (error: any) {
    console.error("Gagal menyalin teks:", error);
    toast.error("Gagal menyalin teks");
  }
}

export function calculateAge(birthDate: string): {
  years: number;
  months: number;
  days: number;
} {
  const parseDate = (dateStr: string): Date => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateStr)) {
      return new Date(dateStr);
    }

    const altRegex = /^(\d{2})[/-](\d{2})[/-](\d{4})$/;
    const match = dateStr.match(altRegex);
    if (match) {
      const reformatted = `${match[3]}-${match[2]}-${match[1]}`;
      return new Date(reformatted);
    }

    return new Date(dateStr);
  };

  if (!birthDate) {
    return { years: 0, months: 0, days: 0 };
  }

  const birth = parseDate(birthDate);

  if (isNaN(birth.getTime())) {
    throw new Error("Tanggal lahir tidak valid");
  }

  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export const formatWitaDate = (timestamp?: Timestamp | Date | null): string => {
  if (!timestamp) return "Tidak tersedia";

  let date: Date;
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return "Tidak tersedia"; // Tangani tipe data tidak valid
  }

  if (isNaN(date.getTime())) return "Tidak tersedia"; // Tangani tanggal tidak valid
  return format(date, "d MMMM yyyy, HH:mm", { locale: id }) + " WITA";
};

export function capitalizeWords(sentence: string): string {
  if (!sentence) return "";

  return sentence
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const downloadExcelData = async (
  banjar: TBanjar | "Semua" = "Semua"
): Promise<FirestoreResponse<void>> => {
  try {
    const kkCollection = collection(db, "kartu-keluarga");
    const kkQuery =
      banjar === "Semua"
        ? kkCollection
        : query(kkCollection, where("banjar", "==", banjar));
    const kkSnapshot = await getDocs(kkQuery);
    const kkDocs = kkSnapshot.docs;

    const anggotaSnapshotsPromises = kkDocs.map((kkDoc) =>
      getDocs(collection(db, "kartu-keluarga", kkDoc.id, "anggota"))
    );
    const anggotaSnapshots = await Promise.all(anggotaSnapshotsPromises);

    const pendudukIdSet = new Set<string>();
    anggotaSnapshots.forEach((snap) =>
      snap.forEach((angDoc) => {
        const ang = angDoc.data() as IAnggotaKeluarga;
        if (ang?.pendudukId) pendudukIdSet.add(ang.pendudukId);
      })
    );
    const pendudukIds = Array.from(pendudukIdSet);

    const chunkArray = <T>(arr: T[], size: number) => {
      const res: T[][] = [];
      for (let i = 0; i < arr.length; i += size)
        res.push(arr.slice(i, i + size));
      return res;
    };

    const pendudukMap = new Map<string, any>();
    if (pendudukIds.length > 0) {
      const chunks = chunkArray(pendudukIds, 10);
      for (const chunk of chunks) {
        const q = query(
          collection(db, "penduduk"),
          where(documentId(), "in", chunk)
        );
        const snap = await getDocs(q);
        snap.forEach((d) => pendudukMap.set(d.id, d.data()));
      }
    }

    const data: any[] = [];
    let no = 1;
    const currentDate = new Date();

    const getDateFromField = (field: any): Date | null => {
      if (!field) return null;
      if (typeof field === "object" && typeof field.toDate === "function")
        return field.toDate();
      const d = new Date(field);
      return isNaN(d.getTime()) ? null : d;
    };

    kkDocs.forEach((kkDoc, index) => {
      const kk = kkDoc.data() as IKartuKeluarga;
      const namaKepalaKeluarga = kk.namaKepalaKeluarga || "";
      const alamat = kk.alamat || "";
      const banjarKK = kk.banjar || "";
      const anggotaSnap = anggotaSnapshots[index];

      const anggotaWithPenduduk = anggotaSnap.docs.map((angDoc) => {
        const ang = angDoc.data() as IAnggotaKeluarga;
        const penduduk = pendudukMap.get(ang.pendudukId);
        return { ang, penduduk };
      });

      anggotaWithPenduduk.sort((a, b) => {
        const idxA = StatusHubunganDalamKeluarga.indexOf(
          a.ang.statusHubunganDalamKeluarga
        );
        const idxB = StatusHubunganDalamKeluarga.indexOf(
          b.ang.statusHubunganDalamKeluarga
        );

        if (idxA !== idxB) return idxA - idxB;

        // Kalau status sama → urutkan berdasarkan tanggal lahir tertua
        const dateA = getDateFromField(a.penduduk?.tanggalLahir);
        const dateB = getDateFromField(b.penduduk?.tanggalLahir);
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      });

      anggotaWithPenduduk.forEach(({ ang, penduduk }) => {
        if (!penduduk) {
          console.warn(`Penduduk ${ang.pendudukId} tidak ditemukan`);
          return;
        }

        const tanggalLahirDate = getDateFromField(penduduk.tanggalLahir);
        let usia = "0";
        if (tanggalLahirDate) {
          const ageDiff =
            currentDate.getFullYear() - tanggalLahirDate.getFullYear();
          const monthDiff =
            currentDate.getMonth() - tanggalLahirDate.getMonth();
          const dayDiff = currentDate.getDate() - tanggalLahirDate.getDate();
          usia = (
            monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
              ? ageDiff - 1
              : ageDiff
          ).toString();
        }

        // Semua data diubah ke uppercase sebelum push
        data.push({
          NO: no,
          NAMA_LENGKAP: (penduduk.nama || "").toUpperCase(),
          JENIS_KELAMIN: (penduduk.jenisKelamin || "").toUpperCase(),
          TEMPAT_LAHIR: (penduduk.tempatLahir || "").toUpperCase(),
          TANGGAL_LAHIR:
            tanggalLahirDate?.toISOString().split("T")[0] ||
            (penduduk.tanggalLahir || "").toString().toUpperCase(),
          USIA: usia.toUpperCase(),
          AGAMA: (penduduk.agama || "").toUpperCase(),
          PENDIDIKAN: (penduduk.pendidikan || "").toUpperCase(),
          PEKERJAAN: (
            penduduk.jenisPekerjaan ||
            penduduk.pekerjaan ||
            ""
          ).toUpperCase(),
          STATUS_KAWIN: (penduduk.statusPerkawinan || "").toUpperCase(),
          GOL_DARAH: (penduduk.golonganDarah || "").toUpperCase(),
          NAMA_LGKP_AYAH: (penduduk.namaAyah || "").toUpperCase(),
          NAMA_LGKP_IBU: (penduduk.namaIbu || "").toUpperCase(),
          ALAMAT: alamat.toUpperCase(),
          STATUS_HUBUNGAN_KELUARGA: (
            ang.statusHubunganDalamKeluarga || ""
          ).toUpperCase(),
          NAMA_KEPALA_KELUARGA: namaKepalaKeluarga.toUpperCase(),
          BANJAR: banjarKK.toUpperCase(),
        });
        no++;
      });
    });

    if (data.length === 0) {
      return {
        success: false,
        message:
          "Tidak ada data penduduk yang ditemukan untuk banjar yang dipilih",
      };
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penduduk");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `data-penduduk-${
      banjar === "Semua" ? "semua" : banjar
    }.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, message: "Data berhasil diunduh" };
  } catch (error) {
    console.error("Error downloading data:", error);
    return {
      success: false,
      message: "Gagal mendownload data. Silakan coba lagi.",
    };
  }
};
