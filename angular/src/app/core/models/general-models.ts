import { ItemDto } from '@proxy/erp/entities/general';

export interface ItemDtoWithExtraProp extends ItemDto {
  amount: number;
  upAmount: number;
  downAmount: number;
  isUpDownButtons:boolean;
}
