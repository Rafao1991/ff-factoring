'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
import { format } from 'date-fns';

interface BarChartMultipleProps {
  title: string;
  label1: string;
  label2: string;
  footer: string;
  startDate: Date;
  endDate: Date;
  totalEarningsByMonth: Record<string, TotalEarnings>;
}

export function BarChartMultiple({
  startDate,
  endDate,
  title,
  label1,
  label2,
  footer,
  totalEarningsByMonth,
}: BarChartMultipleProps) {
  const chartData: {
    month: string;
    value1: number;
    value2: number;
  }[] = [];

  Object.keys(totalEarningsByMonth).forEach((month) => {
    const monthData = totalEarningsByMonth[month];
    chartData.push({
      month: format(new Date().setMonth(Number(month) - 1), 'LLLL'),
      value1: monthData.check,
      value2: monthData.ticket,
    });
  });

  const chartConfig: ChartConfig = {
    value1: {
      label: label1,
      color: 'hsl(var(--chart-1))',
    },
    value2: {
      label: label2,
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{`${startDate} - ${endDate}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-40 max-h-80'>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey={'value1'}
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value) =>
                `R$ ${value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' />}
            />
            <Bar dataKey='value1' fill='var(--color-value1)' radius={4} />
            <Bar dataKey='value2' fill='var(--color-value2)' radius={4} />
          </BarChart>
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
