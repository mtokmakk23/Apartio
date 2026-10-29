import type { BlockDto, CircleDto, CreateBulkUnitsDto, CreateOrUpdateBlock, CreateOrUpdateCircle, CreateOrUpdateHousing, CreateOrUpdateUnit, DeleteBulkUnitsDto, HousingDto, HousingTypeDto, UnitDto, UpdateBulkUnitsDto } from './models';
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
  

  createBulkUnits = (prop: CreateBulkUnitsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/housing/bulk-units',
      body: prop,
    },
    { apiName: this.apiName, skipHandleError: true, ...config });
  

  createUnit = (prop: CreateOrUpdateUnit, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/housing/unit',
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
  

  deleteUnit = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/housing/${id}/unit`,
    },
    { apiName: this.apiName,...config });

  deleteUnitById = (id: string, config?: Partial<Rest.Config>) => this.deleteUnit(id, config);
  

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
  

  getHousingTypeList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingTypeDto[]>({
      method: 'GET',
      url: '/api/app/housing/housing-type-list',
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingDto[]>({
      method: 'GET',
      url: '/api/app/housing',
    },
    { apiName: this.apiName,...config });
  

  getSelectedHousing = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HousingDto>({
      method: 'GET',
      url: '/api/app/housing/selected-housing',
    },
    { apiName: this.apiName,...config });
  

  getUnitList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UnitDto[]>({
      method: 'GET',
      url: '/api/app/housing/unit-list',
    },
    { apiName: this.apiName,...config });
  

  getUnitListByBlockId = (blockId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UnitDto[]>({
      method: 'GET',
      url: `/api/app/housing/unit-list-by-block-id/${blockId}`,
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
  

  updateUnit = (id: string, prop: CreateOrUpdateUnit, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/housing/${id}/unit`,
      body: prop,
    },
    { apiName: this.apiName,...config });

  updateBulkUnits = (prop: UpdateBulkUnitsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: '/api/app/housing/bulk-units',
      body: prop,
    },
    { apiName: this.apiName, skipHandleError: true, ...config });

  deleteBulkUnits = (prop: DeleteBulkUnitsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/housing/bulk-units',
      params: { UnitIds: prop?.unitIds },
    },
    { apiName: this.apiName, skipHandleError: true, ...config });

  constructor(private restService: RestService) {}
}
