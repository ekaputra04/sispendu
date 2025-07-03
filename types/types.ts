export interface IKartuKeluarga {
  noKK: string;
  namaKepalaKeluarga: string;
  alamat: string;
  rt: string;
  rw: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  tanggalPenerbitan: string;
}

export interface IDataPenduduk {
  nama: string;
  nik: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pendidikan: string;
  jenisPekerjaan: string;
  statusPerkawinan: "Kawin" | "Belum Kawin" | "Cerai Hidup" | "Cerai Mati";
  statusHubunganDalamKeluarga: string;
  kewarganegaraan: string;
  nomorPaspor?: string;
  nomorKitas?: string;
  namaAyah?: string;
  namaIbu?: string;
}
