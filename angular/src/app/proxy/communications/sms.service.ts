import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  apiName = 'Default';
  

  sendSmsByMetinAndGsm = (Metin: string, Gsm: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/sms/send-sms',
      params: { metin: Metin, gsm: Gsm },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
