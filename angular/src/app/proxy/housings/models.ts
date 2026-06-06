import type { EntityDto, ExtensibleObject } from '@abp/ng.core';

export interface CreateOrUpdateHousing extends ExtensibleObject {
  name?: string;
  city?: string;
  town?: string;
  adress?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  type?: string;
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
}
