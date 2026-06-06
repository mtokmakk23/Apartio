import type { EntityDto } from '@abp/ng.core';

export interface UserDto extends EntityDto<string> {
  userName: string;
  tenantId: string;
  name?: string;
  surname?: string;
  password: string;
  email: string;
  emailConfirmed?: boolean;
  phoneNumber: string;
  phoneNumberConfirmed?: boolean;
  isActive?: boolean;
  lockoutEnd?: Date;
  lockoutEnabled?: boolean;
  extraProperties: {
    CustomerNo?: string;
    IsAdmin: boolean;
  };
  concurrencyStamp?: string;
  creationTime?: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
  isDeleted?: boolean;
  deleterId?: string;
  deletionTime?: Date;
}

export interface EntityPermissionsDto {
  entityDisplayName: string;
  groups: PermissionGroupsDto[];
}

export interface PermissionGroupsDto {
  displayName: string;
  name: string;
  permissions: PermissionsDto[];
}

export interface PermissionsDto {
  allowedProviders: [];
  displayName: string;
  grantedProviders: GrantedProvidersDto[];
  isGranted: boolean;
  name: string;
  parentName: string;
  isDisabled: boolean;
}

export interface GrantedProvidersDto {
  providerKey: string;
  providerName: string;
}

export interface RoleDto extends EntityDto<string> {
  concurrencyStamp: string;
  extraProperties: {};
  isDefault: boolean;
  isPublic: boolean;
  isStatic: boolean;
  name: string;
  isChecked: boolean;
}
