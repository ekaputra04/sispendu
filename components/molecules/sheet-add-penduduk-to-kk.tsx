"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ButtonDefaultCSS } from "@/consts/buttonCss";
import { Check, Plus, PlusCircle, Save, Search } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getPendudukByName } from "@/lib/firestore/penduduk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IDataPenduduk, TStatusHubunganDalamKeluarga } from "@/types/types";
import { StatusHubunganDalamKeluarga } from "@/consts/dataDefinitions";
import { addAnggotaToKK } from "@/lib/firestore/kartu-keluarga";
import { toast } from "sonner";
import LoadingIcon from "../atoms/loading-icon";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

interface SheetAddPendudukToKKProps {
  kkId: string;
}

export default function SheetAddPendudukToKK({
  kkId,
}: SheetAddPendudukToKKProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pendudukId, setPendudukId] = useState<string>("");
  const [statusHubungan, setStatusHubungan] =
    useState<TStatusHubunganDalamKeluarga>();
  const [searchPenduduk, setSearchPenduduk] = useState<IDataPenduduk[]>();

  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setSearchQuery(values.name);
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["pendudukByName", searchQuery],
    queryFn: () => getPendudukByName(searchQuery),
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      setSearchPenduduk(data.data);
    }
  }, [data]);

  function handlePendudukClick(pendudukId: string) {
    setPendudukId(pendudukId);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!pendudukId || !statusHubungan) {
        toast.error("Silahkan pilih penduduk dan status hubungan");
        return;
      }

      try {
        const result = await addAnggotaToKK({
          kkId: kkId,
          pendudukId: pendudukId,
          statusHubunganDalamKeluarga: statusHubungan,
        });

        console.log(result);

        if (result.success) {
          toast.success("Berhasil menambahkan anggota keluarga");
          router.refresh();
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast.success("Berhasil menambahkan data anggota keluarga");
      form.reset();
      setPendudukId("");
      setStatusHubungan(undefined);
      setSearchPenduduk(undefined);

      queryClient.invalidateQueries({ queryKey: ["kartu-keluarga", kkId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan data anggota keluarga");
    },
  });

  async function onSave() {
    if (!pendudukId || !statusHubungan) {
      toast.error("Silahkan pilih penduduk dan status hubungan");
      return;
    }
    mutate();
  }

  return (
    <Sheet>
      <SheetTrigger className={ButtonDefaultCSS}>
        <PlusCircle />
        Tambah Anggota Keluarga
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah anggota keluarga</SheetTitle>
          <SheetDescription>
            Silahkan tambahkan anggota keluarga
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <Select
            onValueChange={(e) =>
              setStatusHubungan(e as TStatusHubunganDalamKeluarga)
            }
            defaultValue={statusHubungan}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status Hubungan dalam Keluarga" />
            </SelectTrigger>
            <SelectContent>
              {StatusHubunganDalamKeluarga.map((item) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex justify-between gap-2 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormControl>
                      <Input placeholder="Cari nama penduduk" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Search />
              </Button>
            </form>
          </Form>
        </div>
        <div className="px-4 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center gap-2">
              <LoadingIcon />
              <p className="text-sm">Loading...</p>
            </div>
          )}
          {error && <p>Error: {error.message}</p>}
          {searchPenduduk?.length === 0 ? (
            <p className="text-sm">Tidak ada penduduk yang cocok</p>
          ) : (
            <div className="space-y-2">
              <hr />
              <p className="font-semibold text-sm">Hasil pencarian</p>
              {searchPenduduk &&
                searchPenduduk.map((item) => (
                  <div
                    className="flex justify-between items-center shadow-sm px-4 py-2 border rounded-md"
                    key={item.id}>
                    <p className="text-sm">
                      {item.nama} - ({item.banjar})
                    </p>
                    {item.kkRef != null ? (
                      <p className="text-green-600 text-sm">
                        Sudah terdaftar di KK
                      </p>
                    ) : (
                      <Button
                        size={"sm"}
                        onClick={() => handlePendudukClick(item.id)}
                        className={`${
                          pendudukId === item.id
                            ? "bg-green-600 hover:bg-green-600 text-primary-foreground"
                            : ""
                        }`}
                        disabled={item.kkRef != null}>
                        {pendudukId === item.id ? <Check /> : <Plus />}
                      </Button>
                    )}
                  </div>
                ))}
              <Button
                className="mt-4 w-full"
                disabled={isPending}
                onClick={onSave}>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingIcon /> <p>Loading</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save />
                    <div className="flex items-center gap-2">
                      <Save /> Simpan
                    </div>
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
