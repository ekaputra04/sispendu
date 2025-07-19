"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingView from "@/components/atoms/loading-view";
import { Button } from "@/components/ui/button";
import { Heading1 } from "@/components/atoms/heading";
import Link from "next/link";
import { Copy, Pencil } from "lucide-react";
import { calculateAge, handleCopy } from "@/lib/utils";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { getPendudukById } from "@/lib/firestore/penduduk";
import { useEffect, useState } from "react";

interface DetailPendudukPageProps {
  uuid: string;
}

export default function DetailPendudukPage({ uuid }: DetailPendudukPageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["penduduk", uuid],
    queryFn: () => getPendudukById(uuid),
    retry: false,
  });

  const [age, setAge] = useState("");

  useEffect(() => {
    if (data?.data) {
      const age = calculateAge(data?.data?.tanggalLahir as string);
      setAge(
        age.years + " tahun " + age.months + " bulan" + " " + age.days + " hari"
      );
    }
  }, [data]);

  return (
    <div>
      {isLoading && <LoadingView />}
      {data?.data ? (
        <div>
          <div className="flex justify-between items-center">
            <Heading1 text="Detail Data Penduduk" />
            <Link href={"/dashboard/penduduk/edit/" + uuid}>
              <Button variant={"outline"} className={ButtonOutlineGreen}>
                <Pencil />
                Edit Data Penduduk
              </Button>
            </Link>
          </div>
          <hr className="my-4" />
          <Table>
            {/* <TableHeader>
              <TableRow>
                <TableHead>Atribut</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader> */}
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Nama Lengkap</TableCell>
                <TableCell>{data?.data?.nama}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.nama as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jenis Kelamin</TableCell>
                <TableCell>{data?.data?.jenisKelamin}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.jenisKelamin as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tempat Lahir</TableCell>
                <TableCell>{data?.data?.tempatLahir}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.tempatLahir as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tanggal Lahir</TableCell>
                <TableCell>{data?.data?.tanggalLahir}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.tanggalLahir as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Usia</TableCell>
                <TableCell>{age}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(age)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Agama</TableCell>
                <TableCell>{data?.data?.agama}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.agama as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pendidikan</TableCell>
                <TableCell>{data?.data?.pendidikan}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.pendidikan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jenis Pekerjaan</TableCell>
                <TableCell>{data?.data?.jenisPekerjaan}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.jenisPekerjaan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status Perkawinan</TableCell>
                <TableCell>{data?.data?.statusPerkawinan}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.statusPerkawinan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Kewarganegaraan</TableCell>
                <TableCell>{data?.data?.kewarganegaraan}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.kewarganegaraan as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Golongan Darah</TableCell>
                <TableCell>{data?.data?.golonganDarah}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.golonganDarah as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Penyandang Cacat</TableCell>
                <TableCell>{data?.data?.penyandangCacat}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.penyandangCacat as string)
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Ayah</TableCell>
                <TableCell>{data?.data?.namaAyah}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.namaAyah as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Ibu</TableCell>
                <TableCell>{data?.data?.namaIbu}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.namaIbu as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Banjar</TableCell>
                <TableCell>{data?.data?.banjar}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(data?.data?.banjar as string)}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="">
          <Heading1 text="Data Detail Penduduk Tidak Ditemukan" />
        </div>
      )}
    </div>
  );
}
