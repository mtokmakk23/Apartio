import type { EntityDto, ExtensibleObject } from '@abp/ng.core';

export enum ExpenseStatus {
  None = 0,
  Pending = 1,
  PartiallyPaid = 2,
  Paid = 3,
  Cancelled = 4,
}

export interface CreateOrUpdateExpense extends ExtensibleObject {
  housingId?: string;
  title: string;
  category: string;
  amount: number;
  paidAmount: number;
  expenseDate: string;
  dueDate?: string;
  paymentDate?: string;
  supplier?: string;
  currentAccount?: string;
  cashDesk?: string;
  documentNo?: string;
  description?: string;
  status: ExpenseStatus;
  isRecurring: boolean;
  recurringPeriod?: string;
  invoiceFile?: string;
  invoiceFileName?: string;
}

export interface ExpenseDto extends EntityDto<string> {
  housingId?: string;
  title: string;
  category: string;
  amount: number;
  paidAmount: number;
  expenseDate: string;
  dueDate?: string;
  paymentDate?: string;
  supplier?: string;
  currentAccount?: string;
  cashDesk?: string;
  documentNo?: string;
  description?: string;
  status: ExpenseStatus;
  isRecurring: boolean;
  recurringPeriod?: string;
  invoiceFile?: string;
  invoiceFileName?: string;
}
