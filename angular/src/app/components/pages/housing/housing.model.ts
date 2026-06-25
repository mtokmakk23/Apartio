import { CircleDto } from '@proxy/housings';

export interface CircleViewModel extends CircleDto {
  blockName?: string;
  homeOwnerName?: string;
  hirerName?: string;
}
