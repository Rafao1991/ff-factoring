import {
  getInternalServerErrorResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByDateRange } from '@/services/transaction';
import {
  addDays,
  addMonths,
  eachMonthOfInterval,
  format,
  startOfMonth,
  startOfToday,
  subMonths,
} from 'date-fns';

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

  const months = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  }).map((month) => format(month, 'MM/yyyy'));

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

    const month = format(transaction.date, 'MM/yyyy');

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

const getNextMonthEarningsProjection = async (transactions: Transaction[]) => {
  console.info({
    action: 'getNextMonthEarningsProjection',
    message: 'Next month earnings projection started',
  });

  // group transactions by month and by day
  const transactionsByMonthAndDay = transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date);
    const month = transactionDate.getMonth() + 1;
    const day = transactionDate.getMilliseconds();

    if (!acc[month]) {
      acc[month] = {};
    }

    if (!acc[month][day]) {
      acc[month][day] = [];
    }

    acc[month][day].push(transaction);

    return acc;
  }, {} as Record<string, Record<string, Transaction[]>>);

  // get mean earnings by month and day
  const meanEarningsByMonthAndDay = Object.keys(
    transactionsByMonthAndDay
  ).reduce((acc, month) => {
    const monthData = transactionsByMonthAndDay[month];

    Object.keys(monthData).forEach((day) => {
      const dayData = monthData[day];
      const totalEarnings = dayData.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );
      const meanEarnings = totalEarnings / dayData.length;

      if (!acc[month]) {
        acc[month] = {};
      }

      acc[month][day] = meanEarnings;
    });

    return acc;
  }, {} as Record<string, Record<string, number>>);

  // get mean earnings by month
  const meanEarningsByMonth = Object.keys(meanEarningsByMonthAndDay).reduce(
    (acc, month) => {
      const monthData = meanEarningsByMonthAndDay[month];
      const days = Object.keys(monthData);
      const totalEarnings = days.reduce((acc, day) => acc + monthData[day], 0);
      const meanEarnings = totalEarnings / days.length;

      acc[month] = meanEarnings;

      return acc;
    },
    {} as Record<string, number>
  );

  // get next month earnings projection
  const nextMonthEarningsProjection = Object.keys(meanEarningsByMonth).reduce(
    (acc, month) => {
      acc += meanEarningsByMonth[month];

      return acc;
    },
    0
  );

  console.info({
    action: 'getNextMonthEarningsProjection',
    message: 'Next month earnings projection finished',
    nextMonthEarningsProjection,
  });

  return nextMonthEarningsProjection;
};

export const lastSixMonthsEarningsHandler = async () => {
  console.info({
    action: 'lastSixMonthsEarningsHandler',
    message: 'Last 6 months earnings handler started',
  });

  try {
    const today = startOfToday();
    const endDate = addDays(today, 1);
    const startDate = startOfMonth(subMonths(today, 6));
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

    const [
      { totalEarnings, totalEarningsByMonth },
      totalEarningsByAssignor,
      nextMonthEarningsProjection,
    ] = await Promise.all([
      getTotalEarningsByMonth(transactions, startDate, endDate),
      getTotalEarningsByAssignor(transactions),
      getNextMonthEarningsProjection(transactions),
    ]);

    totalEarningsByMonth[format(addMonths(endDate, 1), 'MM/yyyy')] = {
      total: nextMonthEarningsProjection,
      check: 0,
      ticket: 0,
    };

    const response: LastSixMonthsEarnings = {
      startDate: format(startDate, 'PP'),
      endDate: format(endDate, 'PP'),
      totalEarnings,
      totalEarningsByMonth,
      totalEarningsByAssignor,
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
