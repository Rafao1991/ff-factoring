'use client';

import { Loading } from '@/components/loading';
import { useAuth } from 'react-oidc-context';
import DailyTransactions from './_components/daily-transactions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const title = 'Relátorios';
const description = 'Selecione a aba do relatório que desejado.';

enum Display {
  dailyTransactions = 'dailyTransactions',
  lastWeekTransactions = 'lastWeekTransactions',
}

export default function Report() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Loading />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between space-x-2'>
            <div className='flex flex-col space-y-1.5'>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Display.dailyTransactions}>
            <TabsList className='flex gap-2'>
              <TabsTrigger value={Display.dailyTransactions}>
                Operações diárias
              </TabsTrigger>
              <TabsTrigger value={Display.lastWeekTransactions}>
                Operações da última semana
              </TabsTrigger>
            </TabsList>
            <TabsContent value={Display.dailyTransactions}>
              <DailyTransactions auth={auth} />
            </TabsContent>
            <TabsContent value={Display.lastWeekTransactions}>
              Teremos a tabela de última semana
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
