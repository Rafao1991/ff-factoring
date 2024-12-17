import {
  getInternalServerErrorResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByDateRange } from '@/services/transaction';
import { addDays, format } from 'date-fns';
import { subMonths } from 'date-fns/subMonths';

const getTransactions = async (
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  console.info({
    action: 'getTransactions',
    message: 'Getting transactions by date range',
    startDate: format(startDate, 'PPP'),
    endDate: format(endDate, 'PPP'),
  });
  const transactions = await getTransactionsByDateRange(startDate, endDate);
  console.info({
    action: 'getTransactions',
    message: 'Transactions by date range retrieved',
    transactions,
  });
  return transactions;
};

const getMonthObject = (
  startDate: Date,
  endDate: Date
): Record<string, TotalEarnings> => {
  console.info({
    action: 'getMonthObject',
    message: 'Months object creation started',
  });

  const minMonth = startDate.getMonth() + 1;
  const maxMonth = endDate.getMonth() + 1;
  const months = [minMonth, maxMonth];

  for (let i = minMonth; i <= maxMonth; i++) {
    if (!months.includes(i)) {
      months.push(i);
    }
  }

  const monthsObject = Object.fromEntries(
    months.map((month) => [
      month,
      {
        check: 0,
        ticket: 0,
        total: 0,
      },
    ])
  );

  console.info({
    action: 'getMonthObject',
    message: 'Months object creation finished',
    monthsObject,
  });

  return monthsObject;
};

const getTotalEarningsByMonth = async (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Promise<{
  totalEarnings: TotalEarnings;
  totalEarningsByMonth: Record<string, TotalEarnings>;
}> => {
  console.info({
    action: 'getTotalEarningsByMonth',
    message: 'Total earnings by month started',
  });

  const totalEarningsByMonth = getMonthObject(startDate, endDate);

  const totalEarnings = {
    check: 0,
    ticket: 0,
    total: 0,
  };

  transactions.forEach((transaction) => {
    console.info({
      action: 'getTotalEarningsByMonth',
      message: `Processing transaction ${transaction.id}`,
    });

    const month = new Date(transaction.date).getMonth() + 1;

    totalEarnings.total += transaction.amount;
    totalEarningsByMonth[month].total += transaction.amount;

    if (transaction.type === 'cheque') {
      totalEarnings.check += transaction.amount;
      totalEarningsByMonth[month].check += transaction.amount;
      return;
    }

    if (transaction.type === 'duplicata') {
      totalEarnings.ticket += transaction.amount;
      totalEarningsByMonth[month].ticket += transaction.amount;
      return;
    }
  });

  console.info({
    action: 'getTotalEarningsByMonth',
    message: 'Total earnings by month finished',
    totalEarnings,
    totalEarningsByMonth,
  });

  return { totalEarnings, totalEarningsByMonth };
};

const getTotalEarningsByAssignor = async (
  transactions: Transaction[]
): Promise<Record<string, AssignorEarnings>> => {
  console.info({
    action: 'getTotalEarningsByAssignor',
    message: 'Total earnings by assignor started',
  });

  let totalEarningsByAssignor = Object.fromEntries(
    transactions.map((transaction) => [
      transaction.assignorDocumentNumber,
      {
        name: transaction.assignorName,
        check: 0,
        ticket: 0,
        total: 0,
      },
    ])
  );

  transactions.forEach((transaction) => {
    console.info({
      action: 'getTotalEarningsByAssignor',
      message: `Processing transaction ${transaction.id}`,
    });

    const assignorDocumentNumber = transaction.assignorDocumentNumber;
    totalEarningsByAssignor[assignorDocumentNumber].total += transaction.amount;

    if (transaction.type === 'cheque') {
      totalEarningsByAssignor[assignorDocumentNumber].check +=
        transaction.amount;
      return;
    }

    if (transaction.type === 'duplicata') {
      totalEarningsByAssignor[assignorDocumentNumber].ticket +=
        transaction.amount;
      return;
    }
  });

  totalEarningsByAssignor = Object.fromEntries(
    Object.entries(totalEarningsByAssignor).sort((a, b) => {
      return b[1].total - a[1].total;
    })
  );

  console.info({
    action: 'getTotalEarningsByAssignor',
    message: 'Total earnings by assignor finished',
    totalEarningsByAssignor,
  });

  return totalEarningsByAssignor;
};

export const lastSixMonthsEarningsHandler = async () => {
  console.info({
    action: 'lastSixMonthsEarningsHandler',
    message: 'Last 6 months earnings handler started',
  });

  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(addDays(today, 1).setHours(0, 0, 0, 0));
    const startDate = new Date(subMonths(today, 6).setHours(0, 0, 0, 0));
    const transactions = await getTransactions(startDate, endDate);

    if (transactions.length === 0) {
      return getSuccessResponse('Last 6 months earnings', {
        startDate: format(startDate, 'PP'),
        endDate: format(endDate, 'PP'),
        totalEarnings: {},
        totalEarningsByMonth: {},
        totalEarningsByAssignor: {},
      });
    }

    const [{ totalEarnings, totalEarningsByMonth }, totalEarningsByAssignor] =
      await Promise.all([
        getTotalEarningsByMonth(transactions, startDate, endDate),
        getTotalEarningsByAssignor(transactions),
      ]);

    const response: LastSixMonthsEarnings = {
      startDate: format(startDate, 'PP'),
      endDate: format(endDate, 'PP'),
      totalEarnings,
      totalEarningsByMonth,
      totalEarningsByAssignor: totalEarningsByAssignor,
    };

    console.info({
      action: 'lastSixMonthsEarningsHandler',
      message: 'Last 6 months earnings handler finished',
      response: JSON.parse(JSON.stringify(response)),
    });

    return getSuccessResponse('Last 6 months earnings', response);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse(
      'Error getting last 6 months earnings',
      error
    );
  }
};
