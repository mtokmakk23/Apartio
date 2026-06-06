import { PagedAndSortedResultRequestDto, PagedResultDto, Rest, RestService } from '@abp/ng.core';
import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { Injectable } from '@angular/core';
import { EntityPermissionsDto, PermissionsDto, UserDto } from './models';

interface UserListResponse {
  totalCount: number;
  items: IdentityUserDto[];
}

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {
  apiName = 'Default';
  constructor(private restService: RestService) {}

  getUserList = ( config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserListResponse>({
      method: 'GET',
      url: `/api/identity/users`,
      params:{MaxResultCount:1000}
    },
    { apiName: this.apiName,...config });

  getList = (input: PagedAndSortedResultRequestDto) =>
    this.restService.request<any, PagedResultDto<UserDto>>(
      {
        method: 'GET',
        url: '/api/identity/users',
        params: {
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
          sorting: input.sorting,
        },
      },
      { apiName: this.apiName }
    );

  get = (id: string) =>
    this.restService.request<any, UserDto>(
      {
        method: 'GET',
        url: `/api/identity/users/${id}`,
      },
      { apiName: this.apiName }
    );
    
  add = (user: UserDto) =>
    this.restService.request<any, UserDto>(
      {
        method: 'POST',
        url: '/api/identity/users',
        body: user,
      },
      { apiName: this.apiName }
    );

  update = (id: string, user: UserDto) =>
    this.restService.request<any, UserDto>(
      {
        method: 'PUT',
        url: `/api/identity/users/${id}`,
        body: user,
      },
      { apiName: this.apiName }
    );

  delete = (id: string) =>
    this.restService.request(
      {
        method: 'DELETE',
        url: `/api/identity/users/${id}`,
      },
      { apiName: this.apiName }
    );

  getRolesById = (id: string) =>
    this.restService.request<any, any>(
      {
        method: 'GET',
        url: `/api/identity/users/${id}/roles`,
      },
      { apiName: this.apiName }
    );

  putRoles = (id: string, userRoleNames: string[]) =>
    this.restService.request(
      {
        method: 'PUT',
        url: `/api/identity/users/${id}/roles`,
        body: { roleNames: userRoleNames },
      },
      { apiName: this.apiName }
    );

  //#region permissions
  getPermissions = (providerName: string, providerKey: string) =>
    this.restService.request<any, EntityPermissionsDto>(
      {
        method: 'GET',
        url: `/api/permission-management/permissions/`,
        params: { providerName: providerName, providerKey: providerKey },
      },
      { apiName: this.apiName }
    );

  savePermissions = (permissions: PermissionsDto[], providerName: string, providerKey: string) =>
    this.restService.request<any, EntityPermissionsDto>(
      {
        method: 'PUT',
        url: `/api/permission-management/permissions/`,
        params: { providerName: providerName, providerKey: providerKey },
        body: { permissions },
      },
      { apiName: this.apiName }
    );
  //#endregion

  //#region Roles
  getRoles = () =>
    this.restService.request<any, any>(
      {
        method: 'GET',
        url: `/api/identity/roles/all`,
      },
      { apiName: this.apiName }
    );
  //#endregion
}
