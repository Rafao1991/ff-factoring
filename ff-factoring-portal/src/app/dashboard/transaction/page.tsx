'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Error } from '@/components/error';
import { useRouter } from 'next/navigation';
import { formatCpfCnpj } from '@/lib/utils';
import useListTransactions from '@/hooks/api/transactions/use-list-transactions';
import useCompleteTransaction from '@/hooks/api/transactions/use-complete-transaction';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const filter = {
  placeholder: 'Filtrar pelo nome do cliente...',
  column: 'customerName',
};

const title = 'Operações';
const description = 'Lista de operações.';

const newTransactionButton = 'Nova operação';

export default function Transactions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: transactions, isLoading, isError } = useListTransactions();
  const { mutate: completeTransaction, isSuccess } = useCompleteTransaction();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['listTransactions'] });
    }
  }, [isSuccess, queryClient]);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'type',
      header: 'Tipo',
    },
    {
      accessorKey: 'customerDocumentNumber',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            CPF/CNPJ
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value: string = row.getValue('customerDocumentNumber');
        const formattedValue = formatCpfCnpj(value ?? '');

        return <>{formattedValue}</>;
      },
    },
    {
      accessorKey: 'customerName',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cliente
            <ArrowUpDown />
          </Button>
        );
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.getValue('date');
        const formatted = format(date, 'PPP');

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Vencimento
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.getValue('dueDate');
        const formatted = format(date, 'PPP');

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Valor
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('pt-Br', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount);

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: 'completed',
      header: ({ column }) => {
        return (
          <Button
            className='p-0'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Baixado
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const completed: boolean = row.getValue('completed');

        return (
          <div className='flex items-center gap-2'>
            <p>{completed ? 'Sim' : 'Não'}</p>
            <Button
              className='w-full'
              variant='ghost'
              disabled={Boolean(row.getValue('completed'))}
              onClick={() => completeTransaction(row.getValue('id'))}
            >
              <Check />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() =>
              router.push(
                `/dashboard/transaction/detail?id=${row.getValue('id')}`
              )
            }
          >
            <ChevronRight />
          </Button>
        );
      },
    },
    {
      accessorKey: 'id',
      header: '',
      cell: '',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between space-x-2'>
          <div className='flex flex-col space-y-1.5'>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant='default'
            size='lg'
            onClick={() => router.push('/dashboard/transaction/new')}
          >
            {newTransactionButton}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isError ? (
          !isLoading && transactions ? (
            <DataTable columns={columns} data={transactions} filter={filter} />
          ) : (
            <div className='flex items-center justify-center h-screen'>
              <Loader2 className='animate-spin w-12 h-12' />
              <p className='text-center'>Carregando a lista de operações...</p>
            </div>
          )
        ) : (
          <Error />
        )}
      </CardContent>
    </Card>
  );
}
