import type { EntityDto, ExtensibleObject } from '@abp/ng.core';

export enum HousingType {
  Site = 1,
  Apartman = 2,
  Rezidans = 3,
  VillaSitesi = 4,
  MustakilEv = 5,
  IsMerkezi = 6,
}

export interface BlockDto extends EntityDto<string> {
  housingId?: string;
  blockName?: string;
  elevatorCount?: number;
  totalFloors?: number;
}

export interface CircleDto extends EntityDto<string> {
  blockId?: string;
  circleName?: string;
  homeOwnerId?: string;
  hirerId?: string;
}

export interface CreateOrUpdateBlock extends ExtensibleObject {
  blockName?: string;
  elevatorCount?: number;
  totalFloors?: number;
}

export interface CreateOrUpdateCircle extends ExtensibleObject {
  blockId?: string;
  circleName?: string;
  homeOwnerId?: string;
  hirerId?: string;
}

export interface CreateOrUpdateHousing extends ExtensibleObject {
  name?: string;
  city?: string;
  town?: string;
  adress?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  type: number;
  isDelayCompensation: boolean;
  delayCompensationRate: number;
  lastPaymentDay: number;
}

export interface CreateOrUpdateUnit extends ExtensibleObject {
  blockId?: string;
  unitNumber?: string;
  unitType?: string;
  floor: number;
  grossSquareMeters?: number;
  netSquareMeters?: number;
  homeOwnerId?: string;
  hirerId?: string;
  circleName?: string;
}

export interface HousingDto extends EntityDto<string> {
  name?: string;
  city?: string;
  town?: string;
  adress?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  type: number;
  typeName?: string;
  isDelayCompensation: boolean;
  delayCompensationRate: number;
  lastPaymentDay: number;
}

export interface HousingTypeDto extends EntityDto<number> {
  name?: string;
  description?: string;
}

export interface UnitDto extends EntityDto<string> {
  blockId?: string;
  unitNumber?: string;
  unitType?: string;
  floor: number;
  grossSquareMeters?: number;
  netSquareMeters?: number;
  homeOwnerId?: string;
  hirerId?: string;
  circleName?: string;
  blockName?: string;
  homeOwnerName?: string;
  hirerName?: string;
}
