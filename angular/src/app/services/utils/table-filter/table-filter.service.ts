import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableFilterService {

  constructor() { }

  getColumnArray=(data:any[])=>{
    if(data!=undefined)
    if (data.length > 0) {
      return Object.keys(data[0]);
    }
  }
}
