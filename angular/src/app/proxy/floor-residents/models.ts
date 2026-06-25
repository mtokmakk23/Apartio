import type { EntityDto, ExtensibleObject } from '@abp/ng.core';

export interface CreateOrUpdateFloorResident extends ExtensibleObject {
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  identity?: string;
}

export interface FloorResidentDto extends EntityDto<string> {
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  identity?: string;
}

export interface FloorResidentExtract {
  date_?: string;
  dueDate?: string;
  note?: string;
  debit: number;
  delayDebitPrice: number;
  credit: number;
  balance: number;
  remainder: number;
}
