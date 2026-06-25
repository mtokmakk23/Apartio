import { DuesTransactionDto } from '@proxy/dues-transactions';

export interface DuesTransactionViewModel extends DuesTransactionDto {
  circleName?: string;
  floorResidentName?: string;
}

export const AY_ISIMLERI = [
  '', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
