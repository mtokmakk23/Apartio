import type { BlockDto, CircleDto, CreateOrUpdateBlock, CreateOrUpdateCircle, CreateOrUpdateHousing, HousingDto, HousingTypeDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  apiName = 'Default';
  

  changeHousing = (housingId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/housing/change-housing/${housingId}`,
    },
    { apiName: this.apiName,...config });
  

  createBlock = (prop: CreateOrUpdateBlock, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/housing/block',
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  createCircle = (prop: CreateOrUpdateCircle, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/housing/circle',
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  createHousing = (prop: CreateOrUpdateHousing, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/housing/housing',
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/housing/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteBlockById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/housing/${id}/block`,
    },
    { apiName: this.apiName,...config });
  

  deleteCircleById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/housing/${id}/circle`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingDto>({
      method: 'GET',
      url: `/api/app/housing/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBlockList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BlockDto[]>({
      method: 'GET',
      url: '/api/app/housing/block-list',
    },
    { apiName: this.apiName,...config });
  

  getCircleList = (blockId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CircleDto[]>({
      method: 'GET',
      url: `/api/app/housing/circle-list/${blockId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingDto[]>({
      method: 'GET',
      url: '/api/app/housing',
    },
    { apiName: this.apiName,...config });
  

  getHousingTypeList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingTypeDto[]>({
      method: 'GET',
      url: '/api/app/housing/housing-type-list',
    },
    { apiName: this.apiName,...config });
  

  getSelectedHousing = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingDto>({
      method: 'GET',
      url: '/api/app/housing/selected-housing',
    },
    { apiName: this.apiName,...config });
  

  updateBlock = (id: string, prop: CreateOrUpdateBlock, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/housing/${id}/block`,
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  updateCircle = (id: string, prop: CreateOrUpdateCircle, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/housing/${id}/circle`,
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  updateHousing = (id: string, prop: CreateOrUpdateHousing, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/housing/${id}/housing`,
      body: prop,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
