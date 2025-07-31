"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ReportData } from "@/lib/agregatePopulationData";
import { ReportConditions } from "@/consts/dataDefinitions";

interface ReportCondition {
  key: string;
  label: string;
}

export const description = "A dynamic pie chart for various report categories";

interface PieChartAllProps {
  data: ReportData;
}

export function PieChartAll({ data }: PieChartAllProps) {
  let chartData: { name: string; visitors: number; fill: string }[] = [];

  if (data?.category === "all") {
    const totalGroup = data?.groups.find((group) => group.name === "Total");
    if (totalGroup) {
      chartData = [
        {
          name: "Laki-laki",
          visitors: totalGroup.male.count,
          fill: "var(--color-laki-laki)",
        },
        {
          name: "Perempuan",
          visitors: totalGroup.female.count,
          fill: "var(--color-perempuan)",
        },
      ];
    }
  } else {
    chartData = data?.groups
      .filter((group) => group.name !== "Total")
      .map((group) => ({
        name: group.name,
        visitors: group.total.count,
        fill: `var(--color-${group.name.toLowerCase().replace(/\s+/g, "-")})`,
      }));
  }

  const chartConfig: ChartConfig = {
    visitors: {
      label: "Jumlah",
    },
    ...(data?.category === "all"
      ? {
          "laki-laki": { label: "Laki-laki", color: "var(--chart-1)" },
          perempuan: { label: "Perempuan", color: "var(--chart-2)" },
        }
      : data?.groups
          .filter((group) => group.name !== "Total")
          .reduce((config, group, index) => {
            config[group.name.toLowerCase().replace(/\s+/g, "-")] = {
              label: group.name,
              color: `var(--chart-${(index % 5) + 1})`,
            };
            return config;
          }, {} as Record<string, { label: string; color: string }>)),
  };

  const hasData = chartData?.some((item) => item.visitors > 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          {ReportConditions.find(
            (c: ReportCondition) => c.key === data?.category
          )?.label || data?.category}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto pb-0 max-h-[250px] aspect-square">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="visitors" label nameKey="name" />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex justify-center items-center h-[250px] text-muted-foreground">
            Tidak ada data untuk ditampilkan
          </div>
        )}
      </CardContent>
    </Card>
  );
}
