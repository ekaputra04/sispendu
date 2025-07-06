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
  jenisKelamin: "Laki-laki" | "Perempuan";
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pendidikan: string;
  jenisPekerjaan: string;
  statusPerkawinan: "Kawin" | "Belum Kawin" | "Cerai Hidup" | "Cerai Mati";
  statusHubunganDalamKeluarga:
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
  kewarganegaraan: "WNI" | "WNA";
  golonganDarah:
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
  penyandangCacat:
    | "Tidak Cacat"
    | "Cacat Fisik"
    | "Cacat Netra / Buta"
    | "Cacat Rungu / Wicara"
    | "Cacat Mental / Jiwa"
    | "Cacat Fisik dan Mental"
    | "Cacat Lainnya";
  nomorPaspor?: string;
  nomorKitas?: string;
  namaAyah: string;
  namaIbu: string;
  // kartuKeluargaRef?: string;
  // ayahRef?: string;
  // ibuRef?: string;
}

export interface FirestoreResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}
