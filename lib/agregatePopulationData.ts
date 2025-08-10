import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase-init";
import { calculateAge } from "./utils";
import {
  IDataPenduduk,
  IAnggotaKeluarga,
  IKartuKeluarga,
  TBanjar,
  IReportKK,
  FirestoreResponse,
} from "@/types/types";
import {
  Agama,
  Banjar,
  GolonganDarah,
  JenisPekerjaan,
  Pendidikan,
  PenyandangCacat,
  StatusHubunganDalamKeluarga,
  StatusPerkawinan,
} from "@/consts/dataDefinitions";
import { checkAuth } from "./auth";

export interface IReport {
  createdAt: Timestamp;
  data: ReportData[];
}

export interface ReportData {
  category: string;
  groups: {
    name: string;
    total: { count: number; percentage: number };
    male: { count: number; percentage: number };
    female: { count: number; percentage: number };
  }[];
}

export async function aggregateReportData(): Promise<FirestoreResponse<void>> {
  try {
    await checkAuth();

    // Ambil data kartu keluarga sekali untuk digunakan di kedua laporan
    const kkSnapshot = await getDocs(collection(db, "kartu-keluarga"));
    const kkList: IKartuKeluarga[] = kkSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (
          !data.namaKepalaKeluarga ||
          !data.alamat ||
          !data.tanggalPenerbitan ||
          !data.banjar
        ) {
          console.warn(`Dokumen kartu-keluarga ${doc.id} tidak lengkap:`, data);
          return null;
        }
        return {
          id: doc.id,
          namaKepalaKeluarga: data.namaKepalaKeluarga,
          alamat: data.alamat,
          tanggalPenerbitan: data.tanggalPenerbitan,
          banjar: data.banjar,
          anggota: [],
        } as IKartuKeluarga;
      })
      .filter((item): item is IKartuKeluarga => item !== null);

    // Cache data anggota untuk setiap KK
    const anggotaCache: Record<string, IAnggotaKeluarga[]> = {};
    for (const kk of kkList) {
      const anggotaSnapshot = await getDocs(
        collection(db, "kartu-keluarga", kk.id, "anggota")
      );
      anggotaCache[kk.id] = anggotaSnapshot.docs
        .map((doc) => {
          const anggotaData = doc.data();
          if (!anggotaData.statusHubunganDalamKeluarga) {
            console.warn(
              `Dokumen anggota ${doc.id} tidak memiliki statusHubunganDalamKeluarga:`,
              anggotaData
            );
            return null;
          }
          return {
            pendudukId: doc.id,
            statusHubunganDalamKeluarga:
              anggotaData.statusHubunganDalamKeluarga,
          } as IAnggotaKeluarga;
        })
        .filter((item): item is IAnggotaKeluarga => item !== null);
      kk.anggota = anggotaCache[kk.id];
    }

    // REPORT KK
    const reportData: {
      [key: string]: { totalKK: number; totalAnggota: number };
    } = {};
    Banjar.forEach((banjar) => {
      reportData[banjar] = { totalKK: 0, totalAnggota: 0 };
    });
    reportData["Total"] = { totalKK: 0, totalAnggota: 0 };

    let countKKData = 0;

    for (const doc of kkSnapshot.docs) {
      const data = doc.data();
      const banjar = data.banjar as string;
      const anggotaCount = anggotaCache[doc.id].length;

      console.log(
        `${countKKData} - Dokumen ${doc.id}: banjar=${banjar}, anggotaCount=${anggotaCount}`
      );

      countKKData++;

      if (Banjar.includes(banjar as TBanjar)) {
        reportData[banjar].totalKK += 1;
        reportData[banjar].totalAnggota += anggotaCount;
        reportData["Total"].totalKK += 1;
        reportData["Total"].totalAnggota += anggotaCount;
      }
    }

    const groups = Object.entries(reportData).map(
      ([name, { totalKK, totalAnggota }]) => ({
        name,
        totalKK: {
          count: totalKK,
          percentage:
            reportData["Total"].totalKK > 0
              ? (totalKK / reportData["Total"].totalKK) * 100
              : 0,
        },
        totalAnggota: {
          count: totalAnggota,
          percentage:
            reportData["Total"].totalAnggota > 0
              ? (totalAnggota / reportData["Total"].totalAnggota) * 100
              : 0,
        },
      })
    );

    await addDoc(collection(db, "report-kk"), {
      category: "banjar",
      groups,
      createdAt: serverTimestamp(),
    });

    console.log("REPORT KK BERHASIL DIBUAT");

    // REPORT PENDUDUK
    const pendudukSnapshot = await getDocs(collection(db, "penduduk"));
    const pendudukList: IDataPenduduk[] = pendudukSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as IDataPenduduk;
    });

    const totalPopulation = pendudukList.length;

    const report: ReportData[] = [
      { category: "all", groups: [] },
      { category: "rentang-umur", groups: [] },
      { category: "kategori-umur", groups: [] },
      { category: "pendidikan", groups: [] },
      { category: "pekerjaan", groups: [] },
      { category: "agama", groups: [] },
      { category: "hubungan-dalam-kk", groups: [] },
      { category: "status-perkawinan", groups: [] },
      { category: "golongan-darah", groups: [] },
      { category: "penyandang-cacat", groups: [] },
      { category: "wilayah", groups: [] },
    ];

    const ageRanges = ["0-5", "6-12", "13-18", "19-30", "31-50", "51+"];
    const ageCategories = ["Anak", "Remaja", "Dewasa", "Lansia"];

    const counters: Record<
      string,
      Record<string, { total: number; male: number; female: number }>
    > = {};

    report.forEach((category) => {
      counters[category.category] = {};
      if (category.category === "all") {
        counters[category.category]["Total"] = { total: 0, male: 0, female: 0 };
      } else if (category.category === "rentang-umur") {
        ageRanges.forEach((range) => {
          counters[category.category][range] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "kategori-umur") {
        ageCategories.forEach((cat) => {
          counters[category.category][cat] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "pendidikan") {
        Pendidikan.forEach((p) => {
          counters[category.category][p] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "pekerjaan") {
        JenisPekerjaan.forEach((p) => {
          counters[category.category][p] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "agama") {
        Agama.forEach((a) => {
          counters[category.category][a] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "hubungan-dalam-kk") {
        StatusHubunganDalamKeluarga.forEach((s) => {
          counters[category.category][s] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "status-perkawinan") {
        StatusPerkawinan.forEach((s) => {
          counters[category.category][s] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "golongan-darah") {
        GolonganDarah.forEach((g) => {
          counters[category.category][g] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "penyandang-cacat") {
        PenyandangCacat.forEach((p) => {
          counters[category.category][p] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "wilayah") {
        Banjar.forEach((b) => {
          counters[category.category][b] = { total: 0, male: 0, female: 0 };
        });
      }
    });

    const mapToEnum = (
      value: string | undefined,
      enumValues: string[],
      defaultValue: string,
      category: string,
      pendudukId: string
    ): string => {
      if (!value) {
        console.warn(
          `Nilai tidak valid (undefined/null) untuk kategori ${category}, penduduk ${pendudukId}, menggunakan default: ${defaultValue}`
        );
        return defaultValue;
      }
      const matchedEnum = enumValues.find((enumVal) => enumVal === value);
      if (!matchedEnum) {
        console.warn(
          `Nilai "${value}" tidak ditemukan di enum untuk kategori ${category}, penduduk ${pendudukId}, menggunakan default: ${defaultValue}`
        );
        return defaultValue;
      }
      return matchedEnum;
    };

    let countPendudukData = 0;

    pendudukList.forEach((p) => {
      console.log(`Processing penduduk ${p.id}`);

      countPendudukData++;

      let age: number;
      try {
        age = calculateAge(p.tanggalLahir).years;
      } catch (error) {
        console.warn(
          `Gagal menghitung umur untuk penduduk ${p.id}, tanggalLahir: ${p.tanggalLahir}, menggunakan umur 0`
        );
        age = 0;
      }
      const gender = p.jenisKelamin;

      counters["all"]["Total"].total++;
      if (gender === "Laki-laki") counters["all"]["Total"].male++;
      else if (gender === "Perempuan") counters["all"]["Total"].female++;

      let range = "";
      if (age <= 5) range = "0-5";
      else if (age <= 12) range = "6-12";
      else if (age <= 18) range = "13-18";
      else if (age <= 30) range = "19-30";
      else if (age <= 50) range = "31-50";
      else range = "51+";
      counters["rentang-umur"][range].total++;
      if (gender === "Laki-laki") counters["rentang-umur"][range].male++;
      else if (gender === "Perempuan") counters["rentang-umur"][range].female++;

      let cat = "";
      if (age < 13) cat = "Anak";
      else if (age < 19) cat = "Remaja";
      else if (age < 60) cat = "Dewasa";
      else cat = "Lansia";
      counters["kategori-umur"][cat].total++;
      if (gender === "Laki-laki") counters["kategori-umur"][cat].male++;
      else if (gender === "Perempuan") counters["kategori-umur"][cat].female++;

      const pendidikanKey = mapToEnum(
        p.pendidikan,
        Pendidikan,
        "Tidak / Belum Sekolah",
        "pendidikan",
        p.id
      );
      counters["pendidikan"][pendidikanKey].total++;
      if (gender === "Laki-laki") counters["pendidikan"][pendidikanKey].male++;
      else if (gender === "Perempuan")
        counters["pendidikan"][pendidikanKey].female++;

      const pekerjaanKey = mapToEnum(
        p.jenisPekerjaan,
        JenisPekerjaan,
        "Lainnya",
        "pekerjaan",
        p.id
      );
      counters["pekerjaan"][pekerjaanKey].total++;
      if (gender === "Laki-laki") counters["pekerjaan"][pekerjaanKey].male++;
      else if (gender === "Perempuan")
        counters["pekerjaan"][pekerjaanKey].female++;

      const agamaKey = mapToEnum(
        p.agama,
        Agama,
        "Kepercayaan Terhadap Tuhan YME / Lainnya",
        "agama",
        p.id
      );
      counters["agama"][agamaKey].total++;
      if (gender === "Laki-laki") counters["agama"][agamaKey].male++;
      else if (gender === "Perempuan") counters["agama"][agamaKey].female++;

      const anggota = anggotaCache[
        Object.keys(anggotaCache).find((kkId) =>
          anggotaCache[kkId].some((a) => a.pendudukId === p.id)
        ) || ""
      ]?.find((a) => a.pendudukId === p.id);
      if (anggota?.statusHubunganDalamKeluarga) {
        const hubunganKey = mapToEnum(
          anggota.statusHubunganDalamKeluarga,
          StatusHubunganDalamKeluarga,
          "Famili Lain",
          "hubungan-dalam-kk",
          p.id
        );
        counters["hubungan-dalam-kk"][hubunganKey].total++;
        if (gender === "Laki-laki")
          counters["hubungan-dalam-kk"][hubunganKey].male++;
        else if (gender === "Perempuan")
          counters["hubungan-dalam-kk"][hubunganKey].female++;
      }

      const perkawinanKey = mapToEnum(
        p.statusPerkawinan,
        StatusPerkawinan,
        "Belum Kawin",
        "status-perkawinan",
        p.id
      );
      counters["status-perkawinan"][perkawinanKey].total++;
      if (gender === "Laki-laki")
        counters["status-perkawinan"][perkawinanKey].male++;
      else if (gender === "Perempuan")
        counters["status-perkawinan"][perkawinanKey].female++;

      const darahKey = mapToEnum(
        p.golonganDarah,
        GolonganDarah,
        "O",
        "golongan-darah",
        p.id
      );
      counters["golongan-darah"][darahKey].total++;
      if (gender === "Laki-laki") counters["golongan-darah"][darahKey].male++;
      else if (gender === "Perempuan")
        counters["golongan-darah"][darahKey].female++;

      const cacatKey = mapToEnum(
        p.penyandangCacat,
        PenyandangCacat,
        "Tidak Cacat",
        "penyandang-cacat",
        p.id
      );
      counters["penyandang-cacat"][cacatKey].total++;
      if (gender === "Laki-laki") counters["penyandang-cacat"][cacatKey].male++;
      else if (gender === "Perempuan")
        counters["penyandang-cacat"][cacatKey].female++;

      const banjarKey = mapToEnum(
        p.banjar,
        Banjar,
        "Tidak Tau",
        "wilayah",
        p.id
      );
      counters["wilayah"][banjarKey].total++;
      if (gender === "Laki-laki") counters["wilayah"][banjarKey].male++;
      else if (gender === "Perempuan") counters["wilayah"][banjarKey].female++;
    });

    report.forEach((category) => {
      const categoryCounters = counters[category.category];

      const categoryTotal = Object.values(categoryCounters).reduce(
        (acc, group) => ({
          total: acc.total + group.total,
          male: acc.male + group.male,
          female: acc.female + group.female,
        }),
        { total: 0, male: 0, female: 0 }
      );

      category.groups = Object.entries(categoryCounters)
        .map(([name, data]) => ({
          name,
          total: {
            count: data.total,
            percentage:
              totalPopulation > 0 ? (data.total / totalPopulation) * 100 : 0,
          },
          male: {
            count: data.male,
            percentage:
              totalPopulation > 0 ? (data.male / totalPopulation) * 100 : 0,
          },
          female: {
            count: data.female,
            percentage:
              totalPopulation > 0 ? (data.female / totalPopulation) * 100 : 0,
          },
        }))
        .sort((a, b) => {
          if (category.category === "pendidikan") {
            return (
              Pendidikan.indexOf(a.name as any) -
              Pendidikan.indexOf(b.name as any)
            );
          } else if (category.category === "pekerjaan") {
            return (
              JenisPekerjaan.indexOf(a.name as any) -
              JenisPekerjaan.indexOf(b.name as any)
            );
          } else if (category.category === "agama") {
            return Agama.indexOf(a.name as any) - Agama.indexOf(b.name as any);
          } else if (category.category === "hubungan-dalam-kk") {
            return (
              StatusHubunganDalamKeluarga.indexOf(a.name as any) -
              StatusHubunganDalamKeluarga.indexOf(b.name as any)
            );
          } else if (category.category === "status-perkawinan") {
            return (
              StatusPerkawinan.indexOf(a.name as any) -
              StatusPerkawinan.indexOf(b.name as any)
            );
          } else if (category.category === "golongan-darah") {
            return (
              GolonganDarah.indexOf(a.name as any) -
              GolonganDarah.indexOf(b.name as any)
            );
          } else if (category.category === "penyandang-cacat") {
            return (
              PenyandangCacat.indexOf(a.name as any) -
              PenyandangCacat.indexOf(b.name as any)
            );
          } else if (category.category === "wilayah") {
            return (
              Banjar.indexOf(a.name as any) - Banjar.indexOf(b.name as any)
            );
          } else if (category.category === "rentang-umur") {
            return ageRanges.indexOf(a.name) - ageRanges.indexOf(b.name);
          } else if (category.category === "kategori-umur") {
            return (
              ageCategories.indexOf(a.name) - ageCategories.indexOf(b.name)
            );
          }
          return a.name.localeCompare(b.name);
        });

      if (category.category !== "all") {
        category.groups.push({
          name: "Total",
          total: {
            count: categoryTotal.total,
            percentage:
              totalPopulation > 0
                ? (categoryTotal.total / totalPopulation) * 100
                : 0,
          },
          male: {
            count: categoryTotal.male,
            percentage:
              totalPopulation > 0
                ? (categoryTotal.male / totalPopulation) * 100
                : 0,
          },
          female: {
            count: categoryTotal.female,
            percentage:
              totalPopulation > 0
                ? (categoryTotal.female / totalPopulation) * 100
                : 0,
          },
        });
      }
    });

    await addDoc(collection(db, "report"), {
      data: report,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Berhasil mengagregasi data laporan",
    };
  } catch (error: any) {
    console.error("Gagal mengagregasi data laporan:", error);
    return {
      success: false,
      message: error.message || "Gagal mengagregasi data laporan",
      errorCode: error.code || "unknown",
    };
  }
}
