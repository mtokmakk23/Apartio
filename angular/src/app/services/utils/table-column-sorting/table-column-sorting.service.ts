import { Injectable } from '@angular/core';
import { CurrentUserDto } from '@abp/ng.core';

@Injectable({
  providedIn: 'root'
})
export class TableColumnSortingService {

//#region Fields
//#endregion

//#region Ctor
constructor() {
}
//#endregion

//#region Methods

setColumn (name:string,column: any): void {
  localStorage.setItem(name, JSON.stringify(column));
}

getColumn (name:string): any {
  return JSON.parse(localStorage.getItem(name));
}

//#endregion

}
