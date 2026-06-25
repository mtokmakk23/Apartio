import type { EntityDto, ExtensibleObject } from '@abp/ng.core';

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
  type?: string;
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
  type?: string;
  isDelayCompensation: boolean;
  delayCompensationRate: number;
  lastPaymentDay: number;
}
