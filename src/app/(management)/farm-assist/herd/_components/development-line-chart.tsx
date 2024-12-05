"use client";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@oursrc/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@oursrc/components/ui/chart";

// const chartData = [
//   { month: "Tháng 1", weight: 186, height: 80, width: 50 },
//   { month: "Tháng 2", weight: 305, height: 200, width: 100 },
//   { month: "Tháng 3", weight: 237, height: 120, width: 70 },
//   { month: "Tháng 4", weight: 73, height: 190, width: 60 },
//   { month: "Tháng 5", weight: 209, height: 130, width: 80 },
//   { month: "Tháng 6", weight: 214, height: 140, width: 90 },
//   { month: "Tháng 7", weight: 214, height: 140, width: 90 },
//   { month: "Tháng 8", weight: 214, height: 140, width: 90 },
//   { month: "Tháng 9", weight: 214, height: 140, width: 90 },
//   { month: "Tháng 10", weight: 214, height: 140, width: 90 },
//   { month: "Tháng 11", weight: 214, height: 140, width: 90 },
//   { month: "Tháng 12", weight: 214, height: 140, width: 90 },
// ];

const chartConfig = {
  weight: {
    label: "Cân nặng",
    color: "#10b981",
  },
  height: {
    label: "Chiều cao",
    color: "#0ea5e9",
  },
  width: {
    label: "Chiều rộng",
    color: "#eab308",
  },
} satisfies ChartConfig;

export default function DevelopmentLineChart({ chartData }: { chartData: any[] }) {
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Biểu đồ chỉ số cơ thể heo</CardTitle> */}
        <CardDescription>
          {chartData.length > 0 && chartData[0]?.month} - {chartData[chartData.length - 1]?.month}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={2} dot={true} />
            <Line dataKey="height" type="monotone" stroke="var(--color-height)" strokeWidth={2} dot={true} />
            <Line dataKey="width" type="monotone" stroke="var(--color-width)" strokeWidth={2} dot={true} />
            <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap mt-3 gap-4 text-lg [&>*]:justify-center" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
