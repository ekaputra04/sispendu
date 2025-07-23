import { db } from "@/config/firebase-init";
import { IAnggotaKeluarga, IDataPenduduk, IKartuKeluarga } from "@/types/types";
import { collection, getDocs } from "firebase/firestore";
import { calculateAge } from "./utils";

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
  // Fetch penduduk data
  const pendudukSnapshot = await getDocs(collection(db, "penduduk"));
  const pendudukList: IDataPenduduk[] = pendudukSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as IDataPenduduk)
  );

  // Fetch kartu-keluarga data with validation
  const kkSnapshot = await getDocs(collection(db, "kartu-keluarga"));
  const kkList: IKartuKeluarga[] = kkSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      // Validate required fields
      if (
        !data.namaKepalaKeluarga ||
        !data.alamat ||
        !data.tanggalPenerbitan ||
        !data.banjar
      ) {
        console.warn(`Dokumen kartu-keluarga ${doc.id} tidak lengkap`);
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

  // Fetch anggota subcollection for each kartu-keluarga
  for (const kk of kkList) {
    const anggotaSnapshot = await getDocs(
      collection(db, "kartu-keluarga", kk.id, "anggota")
    );
    kk.anggota = anggotaSnapshot.docs
      .map((doc) => {
        const anggotaData = doc.data();
        if (!anggotaData.statusHubunganDalamKeluarga) {
          console.warn(
            `Dokumen anggota ${doc.id} tidak memiliki statusHubunganDalamKeluarga`
          );
          return null;
        }
        return {
          pendudukId: doc.id,
          statusHubunganDalamKeluarga: anggotaData.statusHubunganDalamKeluarga,
          detail: pendudukList.find((p) => p.id === doc.id),
        } as IAnggotaKeluarga;
      })
      .filter((item): item is IAnggotaKeluarga => item !== null);
  }

  const totalPopulation = pendudukList.length;

  // Initialize report structure
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

  // Define group definitions
  const ageRanges = ["0-5", "6-12", "13-18", "19-30", "31-50", "51+"];
  const ageCategories = ["Anak", "Remaja", "Dewasa", "Lansia"];

  // Aggregate data
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
    } else if (category.category === "wilayah") {
      pendudukList.forEach((p) => {
        if (p.banjar) groups[p.banjar] = { total: 0, male: 0, female: 0 };
      });
    } else if (category.category === "hubungan-dalam-kk") {
      kkList.forEach((kk) => {
        kk.anggota?.forEach((a) => {
          if (a.statusHubunganDalamKeluarga) {
            groups[a.statusHubunganDalamKeluarga] = {
              total: 0,
              male: 0,
              female: 0,
            };
          }
        });
      });
    } else {
      pendudukList.forEach((p) => {
        const key = p[category.category as keyof IDataPenduduk];
        if (key) groups[key as string] = { total: 0, male: 0, female: 0 };
      });
    }

    pendudukList.forEach((p) => {
      const age = calculateAge(p.tanggalLahir).years;

      // All
      if (category.category === "all") {
        groups["Total"].total++;
        if (p.jenisKelamin === "Laki-laki") groups["Total"].male++;
        else if (p.jenisKelamin === "Perempuan") groups["Total"].female++;
      }
      // Age Ranges
      else if (category.category === "rentang-umur") {
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
      }
      // Age Categories
      else if (category.category === "kategori-umur") {
        let cat = "";
        if (age < 13) cat = "Anak";
        else if (age < 19) cat = "Remaja";
        else if (age < 60) cat = "Dewasa";
        else cat = "Lansia";
        groups[cat].total++;
        if (p.jenisKelamin === "Laki-laki") groups[cat].male++;
        else if (p.jenisKelamin === "Perempuan") groups[cat].female++;
      }
      // Other categories
      else if (category.category === "hubungan-dalam-kk") {
        const anggota = kkList
          .flatMap((kk) => kk.anggota || [])
          .find((a) => a.pendudukId === p.id);
        if (anggota?.statusHubunganDalamKeluarga) {
          const key = anggota.statusHubunganDalamKeluarga;
          groups[key].total++;
          if (p.jenisKelamin === "Laki-laki") groups[key].male++;
          else if (p.jenisKelamin === "Perempuan") groups[key].female++;
        }
      } else {
        const key = p[category.category as keyof IDataPenduduk];
        if (key) {
          groups[key as string].total++;
          if (p.jenisKelamin === "Laki-laki") groups[key as string].male++;
          else if (p.jenisKelamin === "Perempuan")
            groups[key as string].female++;
        }
      }
    });

    // Convert to final format with percentages
    category.groups = Object.entries(groups).map(([name, data]) => ({
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
    }));
  });

  return report;
}
