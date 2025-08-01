"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ButtonOutlineGreen } from "@/consts/buttonCss";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Send, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addToEditedBy } from "@/lib/firestore/penduduk";
import LoadingIcon from "@/components/atoms/loading-icon";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DialogDeleteEmailEditedBy from "./dialog-delete-email-editedby";

const formSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
});

interface SheetAddEmailToEditedByProps {
  pendudukId: string;
  emails?: string[];
}

export default function SheetAddEmailToEditedBy({
  pendudukId,
  emails,
}: SheetAddEmailToEditedByProps) {
  const queryClient = useQueryClient();

  if (!pendudukId) {
    return;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await addToEditedBy(pendudukId, email);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast.success("Berhasil menambahkan email");
      form.reset();

      queryClient.invalidateQueries({ queryKey: ["penduduk", pendudukId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan data anggota keluarga");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values.email);
  }

  return (
    <Sheet>
      <SheetTrigger className={ButtonOutlineGreen}>
        <Pencil />
      </SheetTrigger>
      <SheetContent className="h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Perbarui Akses Data</SheetTitle>
          <SheetDescription>
            Perbarui akses pengguna lain untuk mengedit data anggota keluarga
          </SheetDescription>
        </SheetHeader>
        <hr />
        <div className="px-4">
          <h2 className="mb-4 font-semibold text-md">Tambah Akses Baru</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="-mt-2 w-full">
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingIcon />
                    <p>Loading...</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send />
                    <p>Simpan</p>
                  </div>
                )}
              </Button>
            </form>
          </Form>
          <hr className="my-4" />
          <div className="">
            <h2 className="mb-4 font-semibold text-md">Hapus Akses</h2>

            <Table>
              <TableCaption>
                {emails
                  ? "Email yang diberikan akses"
                  : "Tidak ada email yang diberikan akses"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails &&
                  emails.map((email) => (
                    <TableRow key={email}>
                      <TableCell>{email}</TableCell>
                      <TableCell>
                        <DialogDeleteEmailEditedBy
                          pendudukId={pendudukId}
                          email={email}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
