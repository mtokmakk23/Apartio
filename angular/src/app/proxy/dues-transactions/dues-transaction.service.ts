import type { CreateOrUpdateDuesTransaction, DuesTransactionDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DuesTransactionService {
  apiName = 'Default';
  

  createDuesTransaction = (prop: CreateOrUpdateDuesTransaction, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/dues-transaction/dues-transaction',
      body: prop,
    },
    { apiName: this.apiName,...config });
  

  deleteDuesTransaction = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/dues-transaction/${id}/dues-transaction`,
    },
    { apiName: this.apiName,...config });
  

  getDuesTransaction = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DuesTransactionDto>({
      method: 'GET',
      url: `/api/app/dues-transaction/${id}/dues-transaction`,
    },
    { apiName: this.apiName,...config });
  

  getDuesTransactionList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DuesTransactionDto[]>({
      method: 'GET',
      url: '/api/app/dues-transaction/dues-transaction-list',
    },
    { apiName: this.apiName,...config });
  

  updateDuesTransaction = (id: string, prop: CreateOrUpdateDuesTransaction, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/dues-transaction/${id}/dues-transaction`,
      body: prop,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
