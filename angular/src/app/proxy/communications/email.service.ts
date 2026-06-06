import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  apiName = 'Default';
  

  sendMailBySubjectAndBodyAndToAndIsSendYourself = (subject: string, body: string, to: string[], isSendYourself?: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/email/send-mail',
      params: { subject, body, isSendYourself },
      body: to,
    },
    { apiName: this.apiName,...config });
  

  sendMailWithAttacmentBySubjectAndBodyAndToAndBase64FileContentAndFileNameAndIsSendYourself = (subject: string, body: string, to: string[], base64FileContent: string, fileName: string, isSendYourself?: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/email/send-mail-with-attacment',
      params: { subject, body, base64FileContent, fileName, isSendYourself },
      body: to,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
