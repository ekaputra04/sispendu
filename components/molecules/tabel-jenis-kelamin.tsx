import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TabelJenisKelamin() {
  return (
    <div className="">
      <Table>
        <TableCaption>Data Penduduk Berdasarkan Jenis Kelamin</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Kelompok</TableHead>
            <TableHead colSpan={2} className="text-center">
              Jumlah
            </TableHead>
            <TableHead colSpan={2} className="text-center">
              Laki-laki
            </TableHead>
            <TableHead colSpan={2} className="text-center">
              Perempuan
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead />
            <TableHead />
            <TableHead className="w-[60px]">n</TableHead>
            <TableHead className="w-[60px]">%</TableHead>
            <TableHead className="w-[60px]">n</TableHead>
            <TableHead className="w-[60px]">%</TableHead>
            <TableHead className="w-[60px]">n</TableHead>
            <TableHead className="w-[60px]">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Laki-laki</TableCell>
            <TableCell>3</TableCell>
            <TableCell>0,10%</TableCell>
            <TableCell>1</TableCell>
            <TableCell>0,03%</TableCell>
            <TableCell>2</TableCell>
            <TableCell>0,07%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>Perempuan</TableCell>
            <TableCell>1</TableCell>
            <TableCell>0,03%</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0,00%</TableCell>
            <TableCell>1</TableCell>
            <TableCell>0,03%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell>Total</TableCell>
            <TableCell>1</TableCell>
            <TableCell>0,03%</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0,00%</TableCell>
            <TableCell>1</TableCell>
            <TableCell>0,03%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
