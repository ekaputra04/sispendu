"use client";

import { Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="">
      <div className="mx-auto px-8 md:px-16 lg:px-32 py-16">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
          {/* Bagian Kiri: Nama Proyek */}
          <div>
            <h3 className="font-semibold text-primary text-lg">
              Sistem Informasi Penduduk
            </h3>
            <p className="mt-2 text-sm">Kelurahan Bebalang, Bangli, Bali.</p>
          </div>

          {/* Bagian Tengah: Tautan Navigasi */}
          <div>
            <h4 className="font-medium text-md text-primary">Tautan</h4>
            <ul className="space-y-2 mt-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-primary transition-colors">
                  Tentang
                </a>
              </li>
              <li>
                <a
                  href="/sekapur-sirih"
                  className="hover:text-primary transition-colors">
                  Sekapur Sirih
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors">
                  Kontak
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </a>
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
            &copy; {new Date().getFullYear()} Sistem Informasi Penduduk. Hak
            cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
