"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@oursrc/components/ui/chart";
import React from "react";
import { LabelList, Pie, PieChart } from "recharts";

const Chart = () => {
  const chartData = [
    { status: "healthy", pigs: 80, fill: "#6ee7b7" },
    { status: "sick", pigs: 15, fill: "#10b981" },
    { status: "dead", pigs: 5, fill: "#059669" },
  ];
  const chartConfig = {
    pigs: {
      label: "Số heo",
    },
    healthy: {
      label: "Khỏe mạnh",
      color: "#6ee7b7",
    },
    sick: {
      label: "Bệnh",
      color: "#10b981",
    },
    dead: {
      label: "Chết",
      color: "#059669",
    },
  } satisfies ChartConfig;
  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px]"
      >
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="pigs" hideLabel />}
          />
          <Pie data={chartData} dataKey="pigs">
            {/* <LabelList
              dataKey="status"
              className="fill-background"
              stroke="none"
              fontSize={16}
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value]?.label
              }
            /> */}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="status" />}
            className="-translate-y-2 flex-wrap gap-4 text-lg [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default Chart;
