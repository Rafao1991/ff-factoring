'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface LineChartSimpleProps {
  title: string;
  label: string;
  footer: string;
  startDate: string;
  endDate: string;
  totalEarningsByMonth: Record<string, TotalEarnings>;
}

export function LineChartSimple({
  title,
  label,
  footer,
  startDate,
  endDate,
  totalEarningsByMonth,
}: LineChartSimpleProps) {
  const chartData: {
    month: string;
    value: number;
  }[] = [];

  Object.keys(totalEarningsByMonth).forEach((month) => {
    const monthData = totalEarningsByMonth[month];
    chartData.push({
      month,
      value: monthData.total,
    });
  });

  const chartConfig: ChartConfig = {
    value: {
      label: label,
      color: 'hsl(var(--chart-4))',
    },
  };

  return (
    <Card className='flex flex-col bg-gray-50'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{`${startDate} - ${endDate}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-40 max-h-80'>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 8,
              right: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              dataKey={'value'}
              width={100}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                `R$ ${value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey='value'
              type='monotone'
              stroke='var(--color-value)'
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='mx-auto my-4 md:my-6 lg:my-8 text-sm'>
        <div className='font-medium leading-none text-muted-foreground'>
          {footer}
        </div>
      </CardFooter>
    </Card>
  );
}
