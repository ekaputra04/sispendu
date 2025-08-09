import { Timestamp } from "firebase/firestore";

export type TJenisKelamin = "Laki-laki" | "Perempuan" | "Tidak Tau";

export type TStatusHubunganDalamKeluarga =
  | "Kepala Keluarga"
  | "Suami"
  | "Istri"
  | "Anak"
  | "Orang Tua"
  | "Mertua"
  | "Menantu"
  | "Cucu"
  | "Pembantu"
  | "Famili Lain"
  | "Tidak Tau";

export type TStatusPerkawinan =
  | "Belum Kawin"
  | "Kawin"
  | "Cerai Hidup"
  | "Cerai Mati"
  | "Tidak Tau";

export type TKewarganegaraan = "WNI" | "WNA";

export type TGolonganDarah =
  | "A"
  | "B"
  | "AB"
  | "O"
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Tidak Tau";

export type TPenyandangCacat =
  | "Tidak Cacat"
  | "Cacat Fisik"
  | "Cacat Netra / Buta"
  | "Cacat Rungu / Wicara"
  | "Cacat Mental / Jiwa"
  | "Cacat Fisik dan Mental"
  | "Cacat Lainnya"
  | "Tidak Tau";

export type TAgama =
  | "Islam"
  | "Kristen"
  | "Katolik"
  | "Hindu"
  | "Budha"
  | "Konghucu"
  | "Kepercayaan Terhadap Tuhan YME / Lainnya"
  | "Tidak Tau";

export type TPendidikan =
  | "Tidak / Belum Sekolah"
  | "Belum Tamat SD / Sederajat"
  | "Tamat SD / Sederajat"
  | "SLTP / Sederajat"
  | "SLTA / Sederajat"
  | "Diploma I / II"
  | "Akademi / Diploma III / S. Muda"
  | "Diploma IV / Strata I"
  | "Strata II"
  | "Strata III"
  | "Tidak Tau";

export type TJenisPekerjaan =
  | "Belum / Tidak Bekerja"
  | "Buruh Harian Lepas"
  | "Buruh Tani / Perkebunan"
  | "Guru"
  | "Karyawan Swasta"
  | "Kepolisian RI (POLRI)"
  | "Mengurus Rumah Tangga"
  | "Pedagang"
  | "Pegawai Negeri Sipil (PNS)"
  | "Pelajar / Mahasiswa"
  | "Pensiunan"
  | "Perangkat Desa"
  | "Perdagangan"
  | "Petani / Pekebun"
  | "Wiraswasta"
  | "Karyawan Honorer"
  | "Perawat"
  | "Bidan"
  | "Karyawan BUMN"
  | "Mekanik"
  | "Tukang Batu"
  | "Karyawan BUMD"
  | "Pendeta"
  | "Peternak"
  | "Konsultan"
  | "Arsitek"
  | "Tukang Kayu"
  | "Sopir"
  | "Tukang Jahit"
  | "Pelaut"
  | "Buruh Peternakan"
  | "Konstruksi"
  | "Tentara Nasional Indonesia (TNI)"
  | "Seniman"
  | "Tukang Las / Pandai Besi"
  | "Pembantu Rumah Tangga"
  | "Penata Rias"
  | "Anggota DPRD Kab./Kota"
  | "Transportasi"
  | "Dosen"
  | "Dokter"
  | "Tukang Gigi"
  | "Penterjemah"
  | "Paranoid"
  | "Tukang Sol Sepatu"
  | "Tukang Cukur"
  | "Lainnya"
  | "Tidak Tau";

export type TBanjar =
  | "Bebalang"
  | "Tegal"
  | "Sedit"
  | "Gancan"
  | "Sembung"
  | "Petak"
  | "Tidak Tau";

export interface IKartuKeluarga {
  id: string;
  namaKepalaKeluarga: string;
  alamat: string;
  tanggalPenerbitan: string;
  banjar: TBanjar;
  anggota?: IAnggotaKeluarga[];
  createdBy?: string;
  editedBy?: string;
  jumlahAnggota?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IDataPenduduk {
  id: string;
  nama: string;
  jenisKelamin: TJenisKelamin;
  tempatLahir: string;
  tanggalLahir: string;
  agama: TAgama;
  pendidikan: string;
  jenisPekerjaan: string;
  statusPerkawinan: TStatusPerkawinan;
  kewarganegaraan: TKewarganegaraan;
  golonganDarah: TGolonganDarah;
  penyandangCacat: TPenyandangCacat;
  namaAyah: string;
  namaIbu: string;
  banjar: TBanjar;
  kkRef?: string;
  createdBy?: string[];
  editedBy?: string[];
  namaKeywords?: string[];
  namaLowerCase?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IDataPengguna {
  id: string;
  nama: string;
  email: string;
  role: string;
}

export interface IAnggotaKeluarga {
  pendudukId: string;
  statusHubunganDalamKeluarga: TStatusHubunganDalamKeluarga;
  detail?: IDataPenduduk;
}

export interface FirestoreResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

export interface IDecryptedSession {
  email: string;
  exp: number;
  expiresAt: string;
  iat: number;
  nama: string;
  role: string;
  userId: string;
}

export interface IReportKK {
  category: string;
  groups: {
    name: string;
    totalKK: { count: number; percentage: number };
    totalAnggota: { count: number; percentage: number };
  }[];
  createdAt: Timestamp;
}

export interface IContact {
  id?: string;
  nama: string;
  email: string;
  pesan: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
