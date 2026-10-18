import { CircleDto, UnitDto } from '@proxy/housings';

export interface UnitViewModel extends UnitDto {
  blockName?: string;
  homeOwnerName?: string;
  hirerName?: string;
}

export interface CircleViewModel extends CircleDto {
  blockName?: string;
  homeOwnerName?: string;
  hirerName?: string;
}

