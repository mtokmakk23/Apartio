import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { RoleDto } from './models';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  apiName = 'Default';
  

  getRole = ( config?: Partial<Rest.Config>) =>
    this.restService.request<any, RoleDto>({
      method: 'GET',
      url: '/api/identity/roles/all',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
