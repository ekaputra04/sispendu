import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase-init";
import { calculateAge } from "./utils";
import { IDataPenduduk, IAnggotaKeluarga, IKartuKeluarga } from "@/types/types";
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

export async function aggregateReportData(): Promise<ReportData[]> {
  try {
    const pendudukSnapshot = await getDocs(collection(db, "penduduk"));
    const pendudukList: IDataPenduduk[] = pendudukSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(`Penduduk ${doc.id} data:`, {
        id: doc.id,
        jenisPekerjaan: data.jenisPekerjaan,
        statusPerkawinan: data.statusPerkawinan,
        golonganDarah: data.golonganDarah,
        penyandangCacat: data.penyandangCacat,
        banjar: data.banjar,
        agama: data.agama,
        pendidikan: data.pendidikan,
        jenisKelamin: data.jenisKelamin,
      });
      return {
        id: doc.id,
        ...data,
      } as IDataPenduduk;
    });

    console.log("Total penduduk:", pendudukList.length);

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

    for (const kk of kkList) {
      const anggotaSnapshot = await getDocs(
        collection(db, "kartu-keluarga", kk.id, "anggota")
      );
      kk.anggota = anggotaSnapshot.docs
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
            detail: pendudukList.find((p) => p.id === doc.id),
          } as IAnggotaKeluarga;
        })
        .filter((item): item is IAnggotaKeluarga => item !== null);
    }

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

    const normalizeString = (value: string | undefined): string | undefined => {
      if (!value) {
        console.warn(
          `Nilai tidak valid (undefined/null) untuk normalisasi: ${value}`
        );
        return undefined;
      }

      return value.trim();
    };

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
      console.log(
        `Memetakan ${category}="${value}" ke key="${matchedEnum}" untuk penduduk ${pendudukId}`
      );
      return matchedEnum;
    };

    report.forEach((category) => {
      const groups: Record<
        string,
        { total: number; male: number; female: number }
      > = {};

      if (category.category === "all") {
        groups["Total"] = { total: 0, male: 0, female: 0 };
      } else if (category.category === "rentang-umur") {
        ageRanges.forEach((range) => {
          groups[range] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "kategori-umur") {
        ageCategories.forEach((cat) => {
          groups[cat] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "pendidikan") {
        Pendidikan.forEach((p) => {
          groups[p] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "pekerjaan") {
        JenisPekerjaan.forEach((p) => {
          groups[p] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "agama") {
        Agama.forEach((a) => {
          groups[a] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "hubungan-dalam-kk") {
        StatusHubunganDalamKeluarga.forEach((s) => {
          groups[s] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "status-perkawinan") {
        StatusPerkawinan.forEach((s) => {
          groups[s] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "golongan-darah") {
        GolonganDarah.forEach((g) => {
          groups[g] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "penyandang-cacat") {
        PenyandangCacat.forEach((p) => {
          groups[p] = { total: 0, male: 0, female: 0 };
        });
      } else if (category.category === "wilayah") {
        Banjar.forEach((b) => {
          groups[b] = { total: 0, male: 0, female: 0 };
        });
      }

      pendudukList.forEach((p) => {
        const age = calculateAge(p.tanggalLahir).years;

        if (category.category === "all") {
          groups["Total"].total++;
          if (p.jenisKelamin === "Laki-laki") groups["Total"].male++;
          else if (p.jenisKelamin === "Perempuan") groups["Total"].female++;
        } else if (category.category === "rentang-umur") {
          let range = "";
          if (age <= 5) range = "0-5";
          else if (age <= 12) range = "6-12";
          else if (age <= 18) range = "13-18";
          else if (age <= 30) range = "19-30";
          else if (age <= 50) range = "31-50";
          else range = "51+";
          groups[range].total++;
          if (p.jenisKelamin === "Laki-laki") groups[range].male++;
          else if (p.jenisKelamin === "Perempuan") groups[range].female++;
        } else if (category.category === "kategori-umur") {
          let cat = "";
          if (age < 13) cat = "Anak";
          else if (age < 19) cat = "Remaja";
          else if (age < 60) cat = "Dewasa";
          else cat = "Lansia";
          groups[cat].total++;
          if (p.jenisKelamin === "Laki-laki") groups[cat].male++;
          else if (p.jenisKelamin === "Perempuan") groups[cat].female++;
        } else if (category.category === "hubungan-dalam-kk") {
          const anggota = kkList
            .flatMap((kk) => kk.anggota || [])
            .find((a) => a.pendudukId === p.id);
          if (anggota?.statusHubunganDalamKeluarga) {
            const key = mapToEnum(
              anggota.statusHubunganDalamKeluarga,
              StatusHubunganDalamKeluarga,
              "Famili Lain",
              "hubungan-dalam-kk",
              p.id
            );
            groups[key].total++;
            if (p.jenisKelamin === "Laki-laki") groups[key].male++;
            else if (p.jenisKelamin === "Perempuan") groups[key].female++;
          }
        } else {
          let field: keyof IDataPenduduk;
          if (category.category === "pekerjaan") {
            field = "jenisPekerjaan";
          } else if (category.category === "wilayah") {
            field = "banjar";
          } else if (category.category === "status-perkawinan") {
            field = "statusPerkawinan";
          } else if (category.category === "golongan-darah") {
            field = "golonganDarah";
          } else if (category.category === "penyandang-cacat") {
            field = "penyandangCacat";
          } else {
            field = category.category as keyof IDataPenduduk;
          }
          const value = p[field];
          let key: string;
          if (field === "pendidikan") {
            key = mapToEnum(
              value as string,
              Pendidikan,
              "Tidak / Belum Sekolah",
              category.category,
              p.id
            );
          } else if (field === "jenisPekerjaan") {
            key = mapToEnum(
              value as string,
              JenisPekerjaan,
              "Lainnya",
              category.category,
              p.id
            );
          } else if (field === "agama") {
            key = mapToEnum(
              value as string,
              Agama,
              "Kepercayaan Terhadap Tuhan YME / Lainnya",
              category.category,
              p.id
            );
          } else if (field === "statusPerkawinan") {
            key = mapToEnum(
              value as string,
              StatusPerkawinan,
              "Belum Kawin",
              category.category,
              p.id
            );
          } else if (field === "golonganDarah") {
            key = mapToEnum(
              value as string,
              GolonganDarah,
              "O",
              category.category,
              p.id
            );
          } else if (field === "penyandangCacat") {
            key = mapToEnum(
              value as string,
              PenyandangCacat,
              "Tidak Cacat",
              category.category,
              p.id
            );
          } else if (field === "banjar") {
            key = mapToEnum(
              value as string,
              Banjar,
              "Bebalang",
              category.category,
              p.id
            );
          } else {
            console.warn(
              `Kategori ${category.category} tidak dikenali untuk penduduk ${p.id}`
            );
            return;
          }
          console.log(
            `Menambahkan ke grup ${key} untuk kategori ${category.category}, penduduk ${p.id}, jenisKelamin: ${p.jenisKelamin}`
          );
          groups[key].total++;
          if (p.jenisKelamin === "Laki-laki") groups[key].male++;
          else if (p.jenisKelamin === "Perempuan") groups[key].female++;
        }
      });

      const categoryTotal = Object.values(groups).reduce(
        (acc, group) => ({
          total: acc.total + group.total,
          male: acc.male + group.male,
          female: acc.female + group.female,
        }),
        { total: 0, male: 0, female: 0 }
      );

      console.log(`Kategori ${category.category} groups:`, groups);
      console.log(`Kategori ${category.category} total:`, categoryTotal);

      category.groups = Object.entries(groups)
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

    console.log("Laporan akhir:", JSON.stringify(report, null, 2));
    return report;
  } catch (error: any) {
    console.error("Gagal mengagregasi data laporan:", error);
    throw new Error("Gagal mengagregasi data laporan: " + error.message);
  }
}
