import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ActivityStatistic, Cage } from "@oursrc/lib/models/cage";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import { CalendarDate, parseDate } from "@internationalized/date";
import { DatePicker, DateValue } from "@nextui-org/react";

const ActivityChart = ({ cage }: { cage?: Cage }) => {
  // const chartData = [
  //   { status: "stationary", percent: data.percentageOfStationary },
  //   { status: "moving", percent: data.percentageOfMoving },
  //   { status: "feeding", percent: data.percentageOfFeeding },
  // ];
  const [date, setDate] = React.useState<DateValue>(parseDate(new Date().toISOString().split("T")[0]));

  const [chartData, setChartData] = React.useState<
    {
      status: string;
      percent: number;
      fill: string;
    }[]
  >([]);
  const chartConfig = {
    percent: {
      label: "Tỉ lệ ",
      // color: "#6ee7b7",
    },
    stationary: {
      label: "Đứng im",
      color: "#6ee7b7",
    },
    moving: {
      label: "Di chuyển",
      color: "#10b981",
    },
    feeding: {
      label: "Đang ăn",
      color: "#059669",
    },
  } satisfies ChartConfig;

  const fetchData = async () => {
    try {
      const res: ResponseObject<ActivityStatistic> = await cageService.getActivityLogByDate(cage?.id ?? "", date.toString());
      if (res.isSuccess) {
        setChartData([
          { status: "Đứng im", percent: isNaN(res.data.percentageOfStationary) ? 0 : res.data.percentageOfStationary, fill: "#6ee7b7" },
          { status: "Di chuyển", percent: isNaN(res.data.percentageOfMoving) ? 0 : res.data.percentageOfMoving, fill: "#10b981" },
          { status: "Đang ăn", percent: isNaN(res.data.percentageOfFeeding) ? 0 : res.data.percentageOfFeeding, fill: "#059669" },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [date]);
  return (
    <div>
      <DatePicker
        className="mb-4 mx-auto w-2/3"
        label="Chọn ngày"
        labelPlacement="outside"
        value={date}
        onChange={(value) => {
          setDate(value);
        }}
      />
      {chartData && (
        <ChartContainer config={chartConfig} className="mx-auto w-3/5 aspect-square max-h-[420px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis dataKey={"percent"} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="percent" radius={10} className="w-10">
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={14} />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default ActivityChart;
