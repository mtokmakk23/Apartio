import { Rest, RestService } from '@abp/ng.core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  apiName = 'Default';

  constructor(private http: HttpClient, private restService: RestService) {}

  uploadFileOffer(formData: any) {
    return this.http.post<any>(
      `${environment.apis.default.url}/api/app/offer/send-offer-mail`,
      formData
    );
  }

  uploadFileOrderr(formData: any) {
    return this.http.post<any>(
      `${environment.apis.default.url}/api/app/shopping-cart/send-order-mail`,
      formData
    );
  }

  uploadFileToFileManager(formData: any) {
    return this.http.post<any>(`${environment.apis.default.url}/api/app/file-manager`, formData);
  }
  uploadFileToComplaint(formData: any) {
    return this.http.post<any>(
      `${environment.apis.default.url}/api/app/complaint/complaint-file`,
      formData
    );
  }
  uploadPriceListExcel(formData: any) {
    return this.http.post<any>(
      `${environment.apis.default.url}/api/app/price-list/from-excel`,
      formData
    );
  }
    uploadDispactImage(formData: any) {
    return this.http.post<any>(
      `${environment.apis.default.url}/api/app/dispact/dispact-image`,
      formData
    );
  }
  downloadFileAsZipByIdList = (
    idList: string[],
    customerCode: string,
    config?: Partial<Rest.Config>
  ) => {
    this.restService
      .request<any, Blob>(
        {
          method: 'POST',
          url: '/api/app/file-manager/download-file-as-zip',
          body: idList,
          responseType: 'blob', // Dosyanın binary olarak alınmasını sağlar
        },
        { apiName: this.apiName, ...config }
      )
      .subscribe(response => {
        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);

        // Dosya indirme işlemi
        const a = document.createElement('a');
        a.href = url;
        a.download = customerCode + '.zip'; // İndirilecek dosyanın adı
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Bellek temizliği
        window.URL.revokeObjectURL(url);
      });
  };
}
