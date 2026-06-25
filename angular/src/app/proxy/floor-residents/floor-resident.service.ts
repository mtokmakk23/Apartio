import type { CreateOrUpdateFloorResident, FloorResidentDto, FloorResidentExtract } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FloorResidentService {
  apiName = 'Default';
  

  createFloorResident = (prop: CreateOrUpdateFloorResident, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/floor-resident/floor-resident',
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  deleteFloorResident = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/floor-resident/${id}/floor-resident`,
    },
    { apiName: this.apiName,...config });
  

  getExtractByFloorResidentId = (FloorResidentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FloorResidentExtract[]>({
      method: 'GET',
      url: `/api/app/floor-resident/extract/${FloorResidentId}`,
    },
    { apiName: this.apiName,...config });
  

  getFloorResident = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FloorResidentDto>({
      method: 'GET',
      url: `/api/app/floor-resident/${id}/floor-resident`,
    },
    { apiName: this.apiName,...config });
  

  getFloorResidentList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, FloorResidentDto[]>({
      method: 'GET',
      url: '/api/app/floor-resident/floor-resident-list',
    },
    { apiName: this.apiName,...config });
  

  updateFloorResident = (id: string, prop: CreateOrUpdateFloorResident, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/floor-resident/${id}/floor-resident`,
      body: prop,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
