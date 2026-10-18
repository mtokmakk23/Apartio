import { mapEnumToOptions } from '@abp/ng.core';

export enum ExpenseStatus {
  None = 0,
  Pending = 1,
  PartiallyPaid = 2,
  Paid = 3,
  Cancelled = 4,
}

export const expenseStatusOptions = mapEnumToOptions(ExpenseStatus);
