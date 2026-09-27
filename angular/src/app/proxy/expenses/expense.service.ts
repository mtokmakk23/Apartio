import type { CreateOrUpdateExpense, ExpenseDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  apiName = 'Default';

  create = (prop: CreateOrUpdateExpense, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/expense',
        body: prop,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/expense/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ExpenseDto>(
      {
        method: 'GET',
        url: `/api/app/expense/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ExpenseDto[]>(
      {
        method: 'GET',
        url: '/api/app/expense',
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, prop: CreateOrUpdateExpense, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'PUT',
        url: `/api/app/expense/${id}`,
        body: prop,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
