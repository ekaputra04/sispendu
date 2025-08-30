"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="">
      <div className="mx-auto px-8 md:px-16 lg:px-32 py-16">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
          {/* Bagian Kiri: Nama Proyek */}
          <div>
            <h3 className="font-semibold text-primary text-2xl">
              Sistem Informasi Penduduk
            </h3>
            <p className="mt-2 text-lg">Kelurahan Bebalang, Bangli, Bali.</p>
          </div>

          {/* Bagian Tengah: Tautan Navigasi */}
          <div>
            <h4 className="font-medium text-md text-primary">Tautan</h4>
            <ul className="space-y-2 mt-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors">
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="/sekapur-sirih"
                  className="hover:text-primary transition-colors">
                  Sekapur Sirih
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors">
                  Kontak
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-md text-primary">Masuk</h4>
            <ul className="space-y-2 mt-2 text-sm">
              <li>
                <a
                  href="/register"
                  className="hover:text-primary transition-colors">
                  Daftar
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="hover:text-primary transition-colors">
                  Masuk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="mt-8 pt-4 border-gray-700 border-t text-center">
          <p className="text-sm">
            &copy; 2025 Sistem Informasi Pendataan Penduduk Kelurahan Bebalang.
          </p>
          <p className="text-sm">
            Dikembangkan oleh{" "}
            <a
              href="https://instagram.com/kknbebalang2025"
              className="hover:underline"
              target="_blank">
              KKN PPM Universitas Udayana 2025 Kelurahan Bebalang
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
