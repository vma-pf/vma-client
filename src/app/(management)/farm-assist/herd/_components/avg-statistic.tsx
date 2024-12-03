"use client";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@oursrc/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@oursrc/components/ui/chart";
import { EndHerdStatistic } from "@oursrc/lib/models/statistic";

export function AvgStatistic({ data }: { data: EndHerdStatistic }) {
  const chartData = [
    { status: "normal", pigs: data.numberOfPigsHealthNormal, fill: "#6ee7b7" },
    { status: "sick", pigs: data.numberOfPigsHealthSick, fill: "#eab308" },
    { status: "dead", pigs: data.numberOfPigsDead, fill: "#ef4444" },
  ];
  const chartConfig = {
    pigs: {
      label: "Số heo",
    },
    normal: {
      label: "Bình thường ",
      color: "#6ee7b7",
    },
    sick: {
      label: "Bệnh ",
      color: "#eab308",
    },
    dead: {
      label: "Chết ",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  return (
    <Card className="">
      <CardContent className="">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="pigs" hideLabel />} />
            <Pie data={chartData} dataKey="pigs" nameKey="status" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {(data.numberOfPigsAlive + data.numberOfPigsDead).toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Tổng số heo
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} className="-translate-y-2 flex-wrap gap-4 text-lg [&>*]:justify-center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
