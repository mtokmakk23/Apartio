import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type {
  AssetDto,
  CreateOrUpdateAssetDto,
  AssetMaintenanceLogDto,
  CreateOrUpdateMaintenanceLogDto,
  GetAssetListInput,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  apiName = 'Default';

  getList = (input?: GetAssetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssetDto[]>(
      {
        method: 'GET',
        url: '/api/app/asset',
        params: {
          housingId: input?.housingId,
          locationId: input?.locationId,
          category: input?.category,
          status: input?.status,
          filter: input?.filter,
        },
      },
      { apiName: this.apiName, ...config }
    );

  getListByHousingId = (housingId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssetDto[]>(
      {
        method: 'GET',
        url: `/api/app/asset/by-housing-id/${housingId}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssetDto>(
      {
        method: 'GET',
        url: `/api/app/asset/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateOrUpdateAssetDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssetDto>(
      {
        method: 'POST',
        url: '/api/app/asset',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateOrUpdateAssetDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssetDto>(
      {
        method: 'PUT',
        url: `/api/app/asset/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/asset/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getLogs = (assetId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssetMaintenanceLogDto[]>(
      {
        method: 'GET',
        url: `/api/app/asset/logs/${assetId}`,
      },
      { apiName: this.apiName, ...config }
    );

  createLog = (input: CreateOrUpdateMaintenanceLogDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AssetMaintenanceLogDto>(
      {
        method: 'POST',
        url: '/api/app/asset/log',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  deleteLog = (logId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/asset/log/${logId}`,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
