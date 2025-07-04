import { NextResponse } from "next/server";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getSession } from "@/lib/session";
import { app, db } from "@/config/firebase-init";
import { getAuth } from "firebase/auth";

export async function GET() {
  try {
    // Verifikasi sesi
    const session = await getSession();
    console.log("SESSION KK API: ", session);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Opsional: Batasi akses hanya untuk admin/petugas (sesuai middleware)
    if (!["admin", "petugas"].includes(session.role as string)) {
      return NextResponse.json(
        { success: false, message: "Akses tidak diizinkan" },
        { status: 403 }
      );
    }

    // Ambil semua dokumen dari koleksi kartu-keluarga
    console.log("Mengambil data dari koleksi kartu-keluarga...");
    const querySnapshot = await getDocs(collection(db, "kartu-keluarga"));
    console.log("Jumlah dokumen ditemukan:", querySnapshot.size);

    const kartuKeluargaList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (kartuKeluargaList.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada data kartu keluarga",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      data: kartuKeluargaList,
    });
  } catch (error: any) {
    console.error("Gagal mengambil data kartu keluarga:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal mengambil data kartu keluarga",
        errorCode: error.code || "unknown",
      },
      { status: error.code === "permission-denied" ? 403 : 500 }
    );
  }
}

// export async function GET() {
//   try {
//     // Verifikasi sesi
//     const session = await getSession();

//     console.log("SESSION KK API: ", session);

//     if (!session?.userId) {
//       return NextResponse.json(
//         { success: false, message: "Tidak terautentikasi" },
//         { status: 401 }
//       );
//     }

//     const auth = getAuth(app);
//     const user = auth.currentUser;
//     console.log(user);

//     // Ambil semua dokumen dari koleksi kartu-keluarga
//     const querySnapshot = await getDocs(collection(db, "kartu-keluarga"));
//     const kartuKeluargaList = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     // Jika koleksi kosong, kembalikan array kosong
//     if (kartuKeluargaList.length === 0) {
//       return NextResponse.json({
//         success: true,
//         message: "Tidak ada data kartu keluarga",
//         data: [],
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       data: kartuKeluargaList,
//     });
//   } catch (error: any) {
//     console.error("Gagal mengambil data kartu keluarga:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Gagal mengambil data kartu keluarga",
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    if (!["admin", "petugas"].includes(session.role as string)) {
      return NextResponse.json(
        { success: false, message: "Akses tidak diizinkan" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const {
      noKK,
      namaKepalaKeluarga,
      alamat,
      rt,
      rw,
      desa,
      kecamatan,
      kabupaten,
      provinsi,
      kodePos,
      tanggalPenerbitan,
    } = data;

    if (
      !noKK ||
      !namaKepalaKeluarga ||
      !alamat ||
      !rt ||
      !rw ||
      !desa ||
      !kecamatan ||
      !kabupaten ||
      !provinsi ||
      !kodePos ||
      !tanggalPenerbitan
    ) {
      return NextResponse.json(
        { success: false, message: "Semua field diperlukan" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "kartu-keluarga"), {
      noKK,
      namaKepalaKeluarga,
      alamat,
      rt,
      rw,
      desa,
      kecamatan,
      kabupaten,
      provinsi,
      kodePos,
      tanggalPenerbitan: new Date(tanggalPenerbitan),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Kartu keluarga berhasil ditambahkan",
      data: { id: docRef.id },
    });
  } catch (error: any) {
    console.error("Gagal membuat kartu keluarga:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal membuat kartu keluarga",
      },
      { status: 500 }
    );
  }
}
