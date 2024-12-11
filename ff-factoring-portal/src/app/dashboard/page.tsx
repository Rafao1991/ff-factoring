'use client';

import { BarChartMultiple } from '@/components/chart/bar-multiple';
import { LineChartSimple } from '@/components/chart/line';
import { PieChartLabel } from '@/components/chart/pie-label';
import Loading from '@/components/loading';
import { useAuth } from 'react-oidc-context';

export default function DashboardPage() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className='flex flex-row gap-4 md:gap-6 lg:gap-8 xl:gap-12 justify-center'>
      <BarChartMultiple />
      <LineChartSimple />
      <PieChartLabel />
    </div>
  );
}
