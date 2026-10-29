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

export interface BulkUnitItem {
  unitNumber: string;
  unitType: string;
  floor: number;
  grossSquareMeters?: number;
  netSquareMeters?: number;
}

export interface BulkUnitForm {
  blockId: string;
  count: number;
  unitType: string;
  startingNumber: number;
  prefix: string;
  startingFloor: number;
  unitsPerFloor: number;
  grossSquareMeters?: number;
  netSquareMeters?: number;
}

export interface BulkEditUnitItem {
  id: string;
  unitNumber: string;
  blockId: string;
  blockName?: string;
  unitType: string;
  floor: number;
  grossSquareMeters?: number;
  netSquareMeters?: number;
  homeOwnerId?: string;
  hirerId?: string;
}

