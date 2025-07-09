export type TJenisKelamin = "Laki-laki" | "Perempuan";
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
  | "Famili Lain";
export type TStatusPerkawinan =
  | "Belum Kawin"
  | "Kawin"
  | "Cerai Hidup"
  | "Cerai Mati";
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
  | "O-";
export type TPenyandangCacat =
  | "Tidak Cacat"
  | "Cacat Fisik"
  | "Cacat Netra / Buta"
  | "Cacat Rungu / Wicara"
  | "Cacat Mental / Jiwa"
  | "Cacat Fisik dan Mental"
  | "Cacat Lainnya";
export type TAgama =
  | "Islam"
  | "Kristen"
  | "Katolik"
  | "Hindu"
  | "Budha"
  | "Konghucu"
  | "Kepercayaan Terhadap Tuhan YME / Lainnya";
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
  | "Strata III";
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
  | "Lainnya";
export type TBanjar =
  | "Bebalang"
  | "Tegal"
  | "Sedit"
  | "Gancan"
  | "Sembung"
  | "Petak";

export interface IKartuKeluarga {
  id: string;
  noKK: string;
  namaKepalaKeluarga: string;
  alamat: string;
  rt?: string;
  rw?: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  tanggalPenerbitan: string;
}

export interface IDataPenduduk {
  id: string;
  nama: string;
  nik: string;
  jenisKelamin: TJenisKelamin;
  tempatLahir: string;
  tanggalLahir: string;
  agama: TAgama;
  pendidikan: string;
  jenisPekerjaan: string;
  statusPerkawinan: TStatusPerkawinan;
  // statusHubunganDalamKeluarga: TStatusHubunganDalamKeluarga;
  kewarganegaraan: TKewarganegaraan;
  golonganDarah: TGolonganDarah;
  penyandangCacat: TPenyandangCacat;
  nomorPaspor?: string;
  nomorKitas?: string;
  namaAyah: string;
  namaIbu: string;
  banjar: TBanjar;
  // kartuKeluargaRef?: string;
  // ayahRef?: string;
  // ibuRef?: string;
}

export interface IAnggotaKeluarga {
  pendudukId: string;
  statusHubunganDalamKeluarga: TStatusHubunganDalamKeluarga;
}

export interface FirestoreResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}
