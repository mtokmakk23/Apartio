import type { EntityDto, ExtensibleObject } from '@abp/ng.core';

export interface CreateOrUpdateDuesTransaction extends ExtensibleObject {
  housingId?: string;
  blockId?: string;
  circleId?: string;
  floorResidentId?: string;
  price: number;
  month: number;
  year: number;
  date_?: string;
  delayCompensationRate: number;
  type?: string;
  sing: number;
  note?: string;
  dueDate?: string;
}

export interface DuesTransactionDto extends EntityDto<string> {
  housingId?: string;
  blockId?: string;
  circleId?: string;
  floorResidentId?: string;
  price: number;
  month: number;
  year: number;
  date_?: string;
  delayCompensationRate: number;
  type?: string;
  sing: number;
  note?: string;
  dueDate?: string;
}
