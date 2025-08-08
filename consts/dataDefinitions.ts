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
  "Tidak Tau",
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
  "Tidak Tau",
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
  "Karyawan Honorer",
  "Perawat",
  "Bidan",
  "Karyawan BUMN",
  "Mekanik",
  "Tukang Batu",
  "Karyawan BUMD",
  "Pendeta",
  "Peternak",
  "Konsultan",
  "Arsitek",
  "Tukang Kayu",
  "Sopir",
  "Tukang Jahit",
  "Pelaut",
  "Buruh Peternakan",
  "Konstruksi",
  "Tentara Nasional Indonesia (TNI)",
  "Seniman",
  "Tukang Las / Pandai Besi",
  "Pembantu Rumah Tangga",
  "Penata Rias",
  "Anggota DPRD Kab./Kota",
  "Transportasi",
  "Dosen",
  "Dokter",
  "Tukang Gigi",
  "Penterjemah",
  "Paranoid",
  "Tukang Sol Sepatu",
  "Tukang Cukur",
  "Lainnya",
  "Tidak Tau",
];

export const StatusPerkawinan: TStatusPerkawinan[] = [
  "Belum Kawin",
  "Kawin",
  "Cerai Hidup",
  "Cerai Mati",
  "Tidak Tau",
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
  "Tidak Tau",
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
  "Tidak Tau",
];

export const PenyandangCacat: TPenyandangCacat[] = [
  "Tidak Cacat",
  "Cacat Fisik",
  "Cacat Netra / Buta",
  "Cacat Rungu / Wicara",
  "Cacat Mental / Jiwa",
  "Cacat Fisik dan Mental",
  "Cacat Lainnya",
  "Tidak Tau",
];

export const Banjar: TBanjar[] = [
  "Bebalang",
  "Tegal",
  "Sedit",
  "Gancan",
  "Sembung",
  "Petak",
  "Tidak Tau",
];

export const ReportConditions = [
  { key: "all", label: "Semua" },
  { key: "rentang-umur", label: "Rentang Umur" },
  { key: "kategori-umur", label: "Kategori Umur" },
  { key: "pendidikan", label: "Pendidikan" },
  { key: "pekerjaan", label: "Pekerjaan" },
  { key: "agama", label: "Agama" },
  { key: "hubungan-dalam-kk", label: "Hubungan dalam KK" },
  { key: "status-perkawinan", label: "Status Perkawinan" },
  { key: "golongan-darah", label: "Golongan Darah" },
  { key: "penyandang-cacat", label: "Penyandang Cacat" },
  { key: "wilayah", label: "Wilayah" },
];
