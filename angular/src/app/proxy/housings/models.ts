import type { EntityDto, ExtensibleObject } from '@abp/ng.core';

export enum HousingType {
  None = 0,
  Site = 1,
  Apartman = 2,
  Daire = 3,
  Rezidans = 4,
  Villa = 5,
}

export interface HousingTypeDto extends EntityDto<number> {
  name?: string;
  description?: string;
}

export interface BlockDto extends EntityDto<string> {
  housingId?: string;
  blockName?: string;
}

export interface CircleDto extends EntityDto<string> {
  blockId?: string;
  circleName?: string;
  homeOwnerId?: string;
  hirerId?: string;
}

export interface CreateOrUpdateBlock extends ExtensibleObject {
  blockName?: string;
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
  type?: number;
  isDelayCompensation: boolean;
  delayCompensationRate: number;
  lastPaymentDay: number;
}

export interface HousingDto extends EntityDto<string> {
  name?: string;
  city?: string;
  town?: string;
  adress?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  type?: number;
  typeName?: string;
  isDelayCompensation: boolean;
  delayCompensationRate: number;
  lastPaymentDay: number;
}
