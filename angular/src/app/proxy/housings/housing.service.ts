import type { CreateOrUpdateHousing, HousingDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  apiName = 'Default';
  

  createHousingByProp = (prop: CreateOrUpdateHousing, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/housing/housing',
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  deleteById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/housing/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingDto>({
      method: 'GET',
      url: `/api/app/housing/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingDto[]>({
      method: 'GET',
      url: '/api/app/housing',
    },
    { apiName: this.apiName,...config });
  

  updateHousingByIdAndProp = (id: string, prop: CreateOrUpdateHousing, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/housing/${id}/housing`,
      body: prop,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
