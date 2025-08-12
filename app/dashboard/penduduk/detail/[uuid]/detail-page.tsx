"use client";

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
import { Copy, Edit, Eye, Pencil } from "lucide-react";
import { calculateAge, capitalizeWords, handleCopy } from "@/lib/utils";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { getPendudukById } from "@/lib/firestore/penduduk";
import { useEffect, useState } from "react";
import SheetAddEmailToEditedBy from "../../../../../components/molecules/sheet-add-email-to-penduduk";
import { Badge } from "@/components/ui/badge";

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
            <div className="flex gap-2">
              {data.data.kkRef && (
                <Link
                  href={"/dashboard/kartu-keluarga/detail/" + data.data.kkRef}>
                  <Button variant={"outline"}>
                    <Eye />
                    Kartu Keluarga
                  </Button>
                </Link>
              )}
              <Link href={"/dashboard/penduduk/edit/" + uuid}>
                <Button variant={"outline"} className={ButtonOutlineGreen}>
                  <Pencil />
                  Edit Data Penduduk
                </Button>
              </Link>
            </div>
          </div>
          <hr className="my-4" />
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Nama Lengkap</TableCell>
                <TableCell className="uppercase">
                  {(data?.data?.nama as string) || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.nama.toUpperCase() as string) || "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Banjar</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.banjar}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.banjar.toUpperCase() as string) || "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jenis Kelamin</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.jenisKelamin}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        data?.data?.jenisKelamin.toUpperCase() as string
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tempat Lahir</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.tempatLahir || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.tempatLahir.toUpperCase() as string) || "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tanggal Lahir</TableCell>
                <TableCell>{data?.data?.tanggalLahir || "-"}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(data?.data?.tanggalLahir as string) || "-"
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Usia</TableCell>
                <TableCell className="uppercase">{age || "-"}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => handleCopy(age.toUpperCase() || "-")}>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Agama</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.agama || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.agama.toUpperCase() as string) || "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pendidikan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.pendidikan || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.pendidikan.toUpperCase() as string) || "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jenis Pekerjaan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.jenisPekerjaan || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.jenisPekerjaan.toUpperCase() as string) ||
                          "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status Perkawinan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.statusPerkawinan || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.statusPerkawinan.toUpperCase() as string) ||
                          "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Kewarganegaraan</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.kewarganegaraan || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.kewarganegaraan.toUpperCase() as string) ||
                          "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Golongan Darah</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.golonganDarah || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy((data?.data?.golonganDarah as string) || "-")
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Penyandang Cacat</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.penyandangCacat || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.penyandangCacat.toUpperCase() as string) ||
                          "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Ayah</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.namaAyah || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.namaAyah.toUpperCase() as string) || "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Ibu</TableCell>
                <TableCell className="uppercase">
                  {data?.data?.namaIbu.toUpperCase() || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() =>
                      handleCopy(
                        (data?.data?.namaIbu.toUpperCase() as string) || "-"
                      )
                    }>
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dibuat Oleh</TableCell>
                <TableCell>
                  {data?.data?.createdBy?.map((item) => (
                    <Badge key={item} variant={"outline"}>
                      {item}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pemilik Akses</TableCell>
                <TableCell className="flex flex-col gap-2">
                  {data?.data?.editedBy?.map((item, i) => (
                    <div className="font-normal" key={i}>
                      <Badge variant={"outline"}>{item}</Badge>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <SheetAddEmailToEditedBy
                    pendudukId={data.data?.id}
                    emails={data?.data?.editedBy}
                  />
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
