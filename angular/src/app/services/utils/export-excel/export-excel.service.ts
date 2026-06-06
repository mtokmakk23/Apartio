import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {
   EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
   EXCEL_EXTENSION = '.xlsx';
  constructor() { }
  exportToExcel( excelFileName: string,data: any[]): void {
    // Veriyi WorkSheet'e çevir
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Çalışma Kitabını oluştur
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Data': worksheet },
      SheetNames: ['Data']
    };

    // Excel dosyasını oluştur
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Dosyayı kaydet
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + this.EXCEL_EXTENSION);
  }
//   exportExcel=(fileName:string,data:any)=>{
// debugger;
//       import("xlsx").then(xlsx => {
//         const worksheet = xlsx.utils.json_to_sheet(data);
//         const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
//         const excelBuffer: any = xlsx.write(workbook, {
//           bookType: "xlsx",
//           type: "array"
//         });
//         this.saveAsExcelFile(excelBuffer, fileName);
//       });
    
//   }

//   saveAsExcelFile(buffer: any, fileName: string): void {
//     import("file-saver").then(FileSaver => {
//       let EXCEL_TYPE =
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//       let EXCEL_EXTENSION = ".xlsx";
//       const data: Blob = new Blob([buffer], {
//         type: EXCEL_TYPE
//       });
//       FileSaver.saveAs(
//         data,
//         fileName + EXCEL_EXTENSION
//       );
//     });
//   }
}
