'use client';

import { BarChartMultiple } from '@/components/chart/bar-multiple';
import { LineChartSimple } from '@/components/chart/line';
import { BarChartHorizontal } from '@/components/chart/bar-horizontal';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import useGetLastSixMonthsEarnings from '@/hooks/api/reports/use-get-last-six-months-earnings';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

export default function DashboardPage() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const {
    data: lastSixMonthsEarnings,
    isLoading,
    isError,
  } = useGetLastSixMonthsEarnings(auth.user?.access_token || '');

  useEffect(() => {
    if (auth.isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ['getLastSixMonthsEarnings'] });
    }
  }, [auth.isAuthenticated, queryClient]);

  if (!auth.isAuthenticated) {
    return <Loading />;
  }

  return (
    <>
      {!isError ? (
        !isLoading && lastSixMonthsEarnings ? (
          <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 justify-center'>
            <BarChartMultiple
              title='Receita por tipo de operação'
              label1='Cheque'
              label2='Duplicata'
              footer='Receita mensal dos últimos seis meses'
              startDate={lastSixMonthsEarnings.startDate}
              endDate={lastSixMonthsEarnings.endDate}
              totalEarningsByMonth={lastSixMonthsEarnings.totalEarningsByMonth}
            />
            <LineChartSimple
              title='Receita mensal'
              label='R$'
              footer='Receita dos últimos seis meses e projeção para o próximo mês'
              startDate={lastSixMonthsEarnings.startDate}
              endDate={lastSixMonthsEarnings.endDate}
              totalEarningsByMonth={lastSixMonthsEarnings.totalEarningsByMonth}
            />
            <BarChartHorizontal
              title='Receita por cliente'
              footer='Receita total dos últimos seis meses'
              startDate={lastSixMonthsEarnings.startDate}
              endDate={lastSixMonthsEarnings.endDate}
              totalEarningsByAssignor={
                lastSixMonthsEarnings.totalEarningsByAssignor
              }
            />
          </div>
        ) : (
          <Loading />
        )
      ) : (
        <Error />
      )}
    </>
  );
}
