"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ButtonCSS } from "@/consts/buttonCss";
import { downloadExcelData } from "@/lib/utils";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TBanjar } from "@/types/types";
import { Banjar } from "@/consts/dataDefinitions";
import { Button } from "../ui/button";
import LoadingIcon from "../atoms/loading-icon";

export default function DialogDownloadData() {
  const [isLoading, setIsLoading] = useState(false);
  const [banjar, setBanjar] = useState<TBanjar | "Semua">("Semua");

  async function handleDownloadExcel() {
    if (!banjar) {
      toast.error("Pilih banjar terlebih dahulu");
      return;
    }
    setIsLoading(true);
    try {
      const response = await downloadExcelData(banjar);

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error("Gagal mengunduh laporan: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="">
      <Dialog>
        <DialogTrigger>
          <div className={`${ButtonCSS} bg-primary text-white`}>
            <Download /> Download Data
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Data</DialogTitle>
            <DialogDescription>
              Pilih data banjar yang ingin anda download
            </DialogDescription>
          </DialogHeader>
          <Select
            value={banjar}
            onValueChange={(e) => setBanjar(e as TBanjar | "Semua")}
            disabled={isLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Banjar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua</SelectItem>
              {Banjar.map((banjar) => (
                <SelectItem value={banjar} key={banjar}>
                  {banjar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleDownloadExcel}
            disabled={isLoading}
            className="text-white">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                <p>Loading</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download />
                <p>Download</p>
              </div>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
