import type { EntityDto } from '@abp/ng.core';

export interface GetAssetListInput {
  housingId?: string;
  locationId?: string;
  category?: string;
  status?: string;
  filter?: string;
}

export interface AssetDto extends EntityDto<string> {
  housingId?: string;
  locationId?: string;
  locationType?: string;
  locationDetail?: string;
  name?: string;
  code?: string;
  category?: string;
  location?: string;
  purchaseDate?: string;
  supplier?: string;
  warrantyEndDate?: string;
  status?: string;
  notes?: string;
}

export interface CreateOrUpdateAssetDto {
  housingId?: string;
  locationId: string;
  locationType?: string;
  locationDetail?: string;
  name: string;
  code: string;
  category: string;
  location: string;
  purchaseDate?: string;
  supplier?: string;
  warrantyEndDate?: string;
  status: string;
  notes?: string;
}

export interface AssetMaintenanceLogDto extends EntityDto<string> {
  assetId?: string;
  maintenanceDate?: string;
  description?: string;
  cost?: number;
  performedBy?: string;
}

export interface CreateOrUpdateMaintenanceLogDto {
  assetId: string;
  maintenanceDate: string;
  description: string;
  cost: number;
  performedBy?: string;
}
