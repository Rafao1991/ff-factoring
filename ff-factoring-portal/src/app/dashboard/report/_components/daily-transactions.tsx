'use client';

import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import useGetDailyTransactions from '@/hooks/api/reports/use-get-daily-transactions';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AuthContextProps } from 'react-oidc-context';
import jsPDF, { jsPDFOptions } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { format } from 'date-fns';
import { formatCpfCnpj } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const getChecks = (data: DailyTransactions): Transaction[] => {
  const checks: Transaction[] = [];

  Object.keys(data.transactionsByAssignor).forEach((assignor) =>
    data.transactionsByAssignor[assignor].checks.forEach((transaction) =>
      checks.push(transaction)
    )
  );

  return checks;
};

const getTickets = (data: DailyTransactions) => {
  const tickets: Transaction[] = [];

  Object.keys(data.transactionsByAssignor).forEach((assignor) =>
    data.transactionsByAssignor[assignor].tickets.forEach((transaction) =>
      tickets.push(transaction)
    )
  );

  return tickets;
};

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'assignorDocumentNumber',
    header: 'CPF/CNPJ',
    cell: ({ row }) => {
      const value: string = row.getValue('assignorDocumentNumber');
      const formattedValue = formatCpfCnpj(value ?? '');

      return <>{formattedValue}</>;
    },
  },
  {
    accessorKey: 'assignorName',
    header: 'Nome',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const date: Date = row.getValue('date');
      const formatted = format(date, 'P');

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Vencimento',
    cell: ({ row }) => {
      const date: Date = row.getValue('dueDate');
      const formatted = format(date, 'P');

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
  },
];

interface DailyTransactionsProps {
  auth: AuthContextProps;
}

export default function DailyTransactions({ auth }: DailyTransactionsProps) {
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useGetDailyTransactions(
    auth.user?.access_token || ''
  );

  useEffect(() => {
    if (auth.isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ['getDailyTransactions'] });
    }
  }, [auth.isAuthenticated, queryClient]);

  const downloadPDF = () => {
    if (!data) return;

    const docConfig: jsPDFOptions = {
      format: 'a4',
      orientation: 'landscape',
    };
    const doc = new jsPDF(docConfig);
    const head = [
      {
        id: 'ID',
        type: 'Tipo',
        date: 'Data',
        dueDate: 'Vencimento',
        amount: 'Valor',
      },
    ];
    const options: Partial<UserOptions> = {
      head,
      startY: 50,
      headStyles: {
        halign: 'left',
        valign: 'middle',
        fillColor: '#888888',
        fontSize: 10,
        fontStyle: 'bold',
        lineWidth: 0.1,
      },
      bodyStyles: {
        halign: 'left',
        valign: 'middle',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: '#dddddd',
      },
    };

    Object.keys(data.transactionsByAssignor).forEach((assignor) => {
      const { name, checks, tickets, total } =
        data.transactionsByAssignor[assignor];

      doc.setFont(doc.getFont().fontName, 'bold');
      doc.setFontSize(16);
      doc.text(`${format(data.startDate, 'P')} - Operações diárias`, 15, 20);

      doc.setFont(doc.getFont().fontName, 'normal', 500);
      doc.text(`CPF/CNPJ:`, 18, 30);
      doc.text(`${formatCpfCnpj(assignor)}`, 48, 30);
      doc.text(`Nome:`, 18, 36);
      doc.text(`${name}`, 48, 36);
      doc.text(`Valor total:`, 18, 42);
      doc.text(`R$ ${total.toFixed(2)}`, 48, 42);

      autoTable(doc, {
        ...options,
        body:
          checks &&
          tickets &&
          checks
            .map((transaction) => {
              return {
                id: transaction.id,
                type: transaction.type,
                date: format(transaction.date, 'P'),
                dueDate: format(transaction.dueDate, 'P'),
                amount: `R$ ${transaction.amount.toFixed(2)}`,
              };
            })
            .concat(
              tickets.map((transaction) => {
                return {
                  id: transaction.id,
                  type: transaction.type,
                  date: format(transaction.date, 'P'),
                  dueDate: format(transaction.dueDate, 'P'),
                  amount: `R$ ${transaction.amount.toFixed(2)}`,
                };
              })
            ),
      });

      doc.addPage(docConfig.format, docConfig.orientation);
      doc.setPage(doc.getNumberOfPages());
    });

    doc.deletePage(doc.getNumberOfPages());
    doc.save(`${new Date().toLocaleDateString()}-operacoes-diarias.pdf`);
  };

  return (
    <>
      {!isError ? (
        !isLoading && data ? (
          <div className='flex flex-col gap-4'>
            <DataTable columns={columns} data={getChecks(data)} />
            <DataTable columns={columns} data={getTickets(data)} />
            <Button
              variant={'outline'}
              onClick={() => downloadPDF()}
              className='mt-4 mx-auto'
            >
              Download PDF
              <Download />
            </Button>
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
