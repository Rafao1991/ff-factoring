type CustomerEarnings = TotalEarnings & {
  name: string;
};

type TotalEarnings = {
  check: number;
  ticket: number;
  total: number;
};

type LastSixMonthsEarnings = {
  startDate: Date;
  endDate: Date;
  totalEarnings: TotalEarnings;
  totalEarningsByMonth: Record<string, TotalEarnings>;
  totalEarningsByCustomer: Record<string, CustomerEarnings>;
};
