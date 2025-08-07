// import {
//   FirestoreResponse,
//   IAnggotaKeluarga,
//   IDataPenduduk,
//   IKartuKeluarga,
//   TAgama,
//   TBanjar,
//   TGolonganDarah,
//   TJenisKelamin,
//   TKewarganegaraan,
//   TPenyandangCacat,
//   TStatusHubunganDalamKeluarga,
//   TStatusPerkawinan,
// } from "@/types/types";
// import { getFirestore, collection, doc, writeBatch } from "firebase/firestore";

// export async function saveDataToFirestore(): Promise<FirestoreResponse<void>> {
//   const db = getFirestore();

//   const batch = writeBatch(db);
//   let i = 1;

//   try {
//     for (const kartuKeluarga of ExampleData) {
//       const kartuKeluargaData: IKartuKeluarga = {
//         id: kartuKeluarga.id,
//         namaKepalaKeluarga: kartuKeluarga.namaKepalaKeluarga,
//         alamat: kartuKeluarga.alamat,
//         tanggalPenerbitan: kartuKeluarga.tanggalPenerbitan,
//         banjar: kartuKeluarga.banjar as TBanjar,
//         createdBy: kartuKeluarga.createdBy,
//         editedBy: kartuKeluarga.editedBy,
//       };

//       const kartuKeluargaRef = doc(
//         collection(db, "kartu-keluarga"),
//         kartuKeluarga.id
//       );
//       batch.set(kartuKeluargaRef, kartuKeluargaData);

//       console.log(`${i} Dokumen kartu keluarga berhasil dibuat`);

//       for (const anggota of kartuKeluarga.anggota) {
//         const anggotaData: IAnggotaKeluarga = {
//           pendudukId: anggota.pendudukId,
//           statusHubunganDalamKeluarga:
//             anggota.statusHubunganDalamKeluarga as TStatusHubunganDalamKeluarga,
//         };

//         const anggotaRef = doc(
//           collection(kartuKeluargaRef, "anggota"),
//           anggota.pendudukId
//         );
//         batch.set(anggotaRef, anggotaData);

//         const pendudukData: IDataPenduduk = {
//           id: anggota.detail.id,
//           nama: anggota.detail.nama,
//           jenisKelamin: anggota.detail.jenisKelamin as TJenisKelamin,
//           tempatLahir: anggota.detail.tempatLahir,
//           tanggalLahir: anggota.detail.tanggalLahir,
//           agama: anggota.detail.agama as TAgama,
//           pendidikan: anggota.detail.pendidikan,
//           jenisPekerjaan: anggota.detail.jenisPekerjaan,
//           statusPerkawinan: anggota.detail
//             .statusPerkawinan as TStatusPerkawinan,
//           kewarganegaraan: anggota.detail.kewarganegaraan as TKewarganegaraan,
//           golonganDarah: anggota.detail.golonganDarah as TGolonganDarah,
//           penyandangCacat: anggota.detail.penyandangCacat as TPenyandangCacat,
//           namaAyah: anggota.detail.namaAyah,
//           namaIbu: anggota.detail.namaIbu,
//           banjar: anggota.detail.banjar as TBanjar,
//           kkRef: anggota.detail.kkRef,
//           createdBy: anggota.detail.createdBy,
//           editedBy: anggota.detail.editedBy,
//           namaKeywords: anggota.detail.namaKeywords,
//           namaLowerCase: anggota.detail.namaLowerCase,
//         };

//         const pendudukRef = doc(collection(db, "penduduk"), anggota.detail.id);
//         batch.set(pendudukRef, pendudukData);
//       }

//       i++;
//     }

//     await batch.commit();
//     console.log("Data successfully saved to Firestore");
//     return { success: true, message: "Data successfully saved to Firestore" };
//   } catch (error) {
//     console.error("Error saving data to Firestore:", error);
//     throw error;
//   }
// }
