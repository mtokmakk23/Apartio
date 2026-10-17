import { Injectable } from '@angular/core';
import { RestService } from '@abp/ng.core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asset, AssetMaintenanceLog } from './asset.model';
import type {
  AssetDto,
  CreateOrUpdateAssetDto,
  AssetMaintenanceLogDto,
  CreateOrUpdateMaintenanceLogDto,
  GetAssetListInput
} from '@proxy/assets';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  apiName = 'Default';

  constructor(private restService: RestService) {}

  /**
   * 1. ANA FİLTRE: Yukarıdan seçilen site parametresi (housingId).
   * 2. İKİNCİ FİLTRE: O siteye ait binalar veya bloklar (locationId).
   * Tüm filtreleme işlemleri Backend'de (BE) güvenli bir şekilde yürütülür.
   */
  getList(input?: GetAssetListInput): Observable<Asset[]> {
    return this.restService.request<any, AssetDto[]>(
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
      { apiName: this.apiName }
    ).pipe(
      map(dtos => (dtos || []).map(dto => this.mapDtoToAsset(dto)))
    );
  }

  get(id: string): Observable<Asset> {
    return this.restService.request<any, AssetDto>(
      {
        method: 'GET',
        url: `/api/app/asset/${id}`,
      },
      { apiName: this.apiName }
    ).pipe(
      map(dto => this.mapDtoToAsset(dto))
    );
  }

  create(input: CreateOrUpdateAssetDto): Observable<Asset> {
    return this.restService.request<any, AssetDto>(
      {
        method: 'POST',
        url: '/api/app/asset',
        body: input,
      },
      { apiName: this.apiName }
    ).pipe(
      map(dto => this.mapDtoToAsset(dto))
    );
  }

  update(id: string, input: CreateOrUpdateAssetDto): Observable<Asset> {
    return this.restService.request<any, AssetDto>(
      {
        method: 'PUT',
        url: `/api/app/asset/${id}`,
        body: input,
      },
      { apiName: this.apiName }
    ).pipe(
      map(dto => this.mapDtoToAsset(dto))
    );
  }

  delete(id: string): Observable<void> {
    return this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/asset/${id}`,
      },
      { apiName: this.apiName }
    );
  }

  getLogs(assetId: string): Observable<AssetMaintenanceLog[]> {
    return this.restService.request<any, AssetMaintenanceLogDto[]>(
      {
        method: 'GET',
        url: `/api/app/asset/logs/${assetId}`,
      },
      { apiName: this.apiName }
    ).pipe(
      map(dtos => (dtos || []).map(dto => this.mapDtoToLog(dto)))
    );
  }

  createLog(input: CreateOrUpdateMaintenanceLogDto): Observable<AssetMaintenanceLog> {
    return this.restService.request<any, AssetMaintenanceLogDto>(
      {
        method: 'POST',
        url: '/api/app/asset/log',
        body: input,
      },
      { apiName: this.apiName }
    ).pipe(
      map(dto => this.mapDtoToLog(dto))
    );
  }

  deleteLog(logId: string): Observable<void> {
    return this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/asset/log/${logId}`,
      },
      { apiName: this.apiName }
    );
  }

  private mapDtoToAsset(dto: AssetDto): Asset {
    return {
      id: dto.id || '',
      housingId: dto.housingId || '',
      locationId: dto.locationId || '',
      locationType: dto.locationType,
      locationDetail: dto.locationDetail,
      name: dto.name || '',
      code: dto.code || '',
      category: dto.category || '',
      location: dto.location || '',
      purchase_date: dto.purchaseDate ? this.formatDate(dto.purchaseDate) : '',
      supplier: dto.supplier || '',
      warranty_end_date: dto.warrantyEndDate ? this.formatDate(dto.warrantyEndDate) : '',
      status: (dto.status as any) || 'Aktif',
      notes: dto.notes,
      created_at: (dto as any).creationTime,
    };
  }

  private mapDtoToLog(dto: AssetMaintenanceLogDto): AssetMaintenanceLog {
    return {
      id: dto.id || '',
      asset_id: dto.assetId || '',
      maintenance_date: dto.maintenanceDate ? this.formatDate(dto.maintenanceDate) : '',
      description: dto.description || '',
      cost: dto.cost || 0,
      performed_by: dto.performedBy || '',
      created_at: (dto as any).creationTime,
    };
  }

  private formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }
}
