import {
  TAgama,
  TBanjar,
  TGolonganDarah,
  TJenisKelamin,
  TJenisPekerjaan,
  TKewarganegaraan,
  TPendidikan,
  TPenyandangCacat,
  TStatusHubunganDalamKeluarga,
  TStatusPerkawinan,
} from "@/types/types";

export const Agama: TAgama[] = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Budha",
  "Konghucu",
  "Kepercayaan Terhadap Tuhan YME / Lainnya",
];

export const JenisKelamin: TJenisKelamin[] = ["Laki-laki", "Perempuan"];

export const Pendidikan: TPendidikan[] = [
  "Tidak / Belum Sekolah",
  "Belum Tamat SD / Sederajat",
  "Tamat SD / Sederajat",
  "SLTP / Sederajat",
  "SLTA / Sederajat",
  "Diploma I / II",
  "Akademi / Diploma III / S. Muda",
  "Diploma IV / Strata I",
  "Strata II",
  "Strata III",
];

export const JenisPekerjaan: TJenisPekerjaan[] = [
  "Belum / Tidak Bekerja",
  "Buruh Harian Lepas",
  "Buruh Tani / Perkebunan",
  "Guru",
  "Karyawan Swasta",
  "Kepolisian RI (POLRI)",
  "Mengurus Rumah Tangga",
  "Pedagang",
  "Pegawai Negeri Sipil (PNS)",
  "Pelajar / Mahasiswa",
  "Pensiunan",
  "Perangkat Desa",
  "Perdagangan",
  "Petani / Pekebun",
  "Wiraswasta",
  "Lainnya",
];

export const StatusPerkawinan: TStatusPerkawinan[] = [
  "Belum Kawin",
  "Kawin",
  "Cerai Hidup",
  "Cerai Mati",
];

export const StatusHubunganDalamKeluarga: TStatusHubunganDalamKeluarga[] = [
  "Kepala Keluarga",
  "Istri",
  "Suami",
  "Anak",
  "Orang Tua",
  "Mertua",
  "Menantu",
  "Cucu",
  "Pembantu",
  "Famili Lain",
];

export const Kewarganegaraan: TKewarganegaraan[] = ["WNI", "WNA"];

export const GolonganDarah: TGolonganDarah[] = [
  "A",
  "B",
  "AB",
  "O",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const PenyandangCacat: TPenyandangCacat[] = [
  "Tidak Cacat",
  "Cacat Fisik",
  "Cacat Netra / Buta",
  "Cacat Rungu / Wicara",
  "Cacat Mental / Jiwa",
  "Cacat Fisik dan Mental",
  "Cacat Lainnya",
];

export const Banjar: TBanjar[] = [
  "Bebalang",
  "Tegal",
  "Sedit",
  "Gancan",
  "Sembung",
  "Petak",
];
