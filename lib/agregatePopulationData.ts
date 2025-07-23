import { db } from "@/config/firebase-init";
import { IDataPenduduk } from "@/types/types";
import { collection, getDocs } from "firebase/firestore";
import { calculateAge } from "./utils";

interface PopulationReport {
  ageRanges: Record<string, number>;
  ageCategories: Record<string, number>;
  education: Record<string, number>;
  occupation: Record<string, number>;
  religion: Record<string, number>;
  maritalStatus: Record<string, number>;
  bloodType: Record<string, number>;
  disability: Record<string, number>;
  region: Record<string, number>;
  gender: Record<string, number>;
  totalPopulation: number;
}

export async function aggregatePopulationData(): Promise<PopulationReport> {
  const pendudukSnapshot = await getDocs(collection(db, "penduduk"));
  const pendudukList: IDataPenduduk[] = pendudukSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as IDataPenduduk)
  );

  const report: PopulationReport = {
    ageRanges: {
      "0-5": 0,
      "6-12": 0,
      "13-18": 0,
      "19-30": 0,
      "31-50": 0,
      "51+": 0,
    },
    ageCategories: { Anak: 0, Remaja: 0, Dewasa: 0, Lansia: 0 },
    education: {},
    occupation: {},
    religion: {},
    maritalStatus: {},
    bloodType: {},
    disability: {},
    region: {},
    gender: {},
    totalPopulation: pendudukList.length,
  };

  pendudukList.forEach((penduduk) => {
    const age = calculateAge(penduduk.tanggalLahir).years;

    // Age Ranges
    if (age <= 5) report.ageRanges["0-5"]++;
    else if (age <= 12) report.ageRanges["6-12"]++;
    else if (age <= 18) report.ageRanges["13-18"]++;
    else if (age <= 30) report.ageRanges["19-30"]++;
    else if (age <= 50) report.ageRanges["31-50"]++;
    else report.ageRanges["51+"]++;

    // Age Categories
    if (age < 13) report.ageCategories["Anak"]++;
    else if (age < 19) report.ageCategories["Remaja"]++;
    else if (age < 60) report.ageCategories["Dewasa"]++;
    else report.ageCategories["Lansia"]++;

    // Education
    report.education[penduduk.pendidikan] =
      (report.education[penduduk.pendidikan] || 0) + 1;

    // Occupation
    report.occupation[penduduk.jenisPekerjaan] =
      (report.occupation[penduduk.jenisPekerjaan] || 0) + 1;

    // Religion
    report.religion[penduduk.agama] =
      (report.religion[penduduk.agama] || 0) + 1;

    // Marital Status
    report.maritalStatus[penduduk.statusPerkawinan] =
      (report.maritalStatus[penduduk.statusPerkawinan] || 0) + 1;

    // Blood Type
    report.bloodType[penduduk.golonganDarah] =
      (report.bloodType[penduduk.golonganDarah] || 0) + 1;

    // Disability
    report.disability[penduduk.penyandangCacat] =
      (report.disability[penduduk.penyandangCacat] || 0) + 1;

    // Region
    report.region[penduduk.banjar] = (report.region[penduduk.banjar] || 0) + 1;

    // Gender
    report.gender[penduduk.jenisKelamin] =
      (report.gender[penduduk.jenisKelamin] || 0) + 1;
  });

  return report;
}
