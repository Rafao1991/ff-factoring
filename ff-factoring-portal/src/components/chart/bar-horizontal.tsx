'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
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

interface BarChartHorizontalProps {
  title: string;
  footer: string;
  startDate: Date;
  endDate: Date;
  totalEarningsByCustomer: Record<string, CustomerEarnings>;
}

export function BarChartHorizontal({
  title,
  footer,
  startDate,
  endDate,
  totalEarningsByCustomer,
}: BarChartHorizontalProps) {
  const chartData: {
    label: string;
    value: number;
  }[] = [];

  const chartConfig: ChartConfig = {
    value: {
      label: 'Valor',
      color: 'hsl(var(--chart-2))',
    },
    label: {
      color: 'hsl(var(--background))',
    },
  };

  Object.keys(totalEarningsByCustomer).forEach((customer) => {
    const customerData = totalEarningsByCustomer[customer];

    chartData.push({
      value: customerData.total,
      label: `${customerData.name} `,
    });
  });

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{`${startDate} - ${endDate}`}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='label'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis
              dataKey='value'
              type='number'
              tickLine={true}
              tickMargin={10}
              tickFormatter={(value: number) =>
                `R$ ${value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Bar
              dataKey='value'
              layout='vertical'
              fill='var(--color-value)'
              radius={4}
            >
              <LabelList
                dataKey='label'
                position='center'
                offset={8}
                className='fill-[--color-label]'
                fontSize={12}
              />
              <LabelList
                dataKey='value'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
                formatter={(value: number) =>
                  `${value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}`
                }
              />
            </Bar>
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
