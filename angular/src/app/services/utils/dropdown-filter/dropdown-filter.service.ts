import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownFilterService {

  constructor() { }
  customSearch(term: string, item: any) {
  var filter=["name","code","title","mark"];

    term= term
       .replace(/İ/g, 'I')
       .replace(/Ö/g, 'O')
       .replace(/Ü/g, 'U')
       .replace(/Ç/g, 'C')
       .replace(/Ğ/g, 'G')
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/i/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u');
  
      for (let i = 0; i < filter.length; i++) {
        if(item[filter[i]]!=undefined){
          var r= item[filter[i]]
          .replace(/İ/g, 'I')
          .replace(/Ö/g, 'O')
          .replace(/Ü/g, 'U')
          .replace(/Ç/g, 'C')
          .replace(/Ğ/g, 'G')
          .toLowerCase()
          .replace(/ç/g, 'c')
          .replace(/ğ/g, 'g')
          .replace(/ı/g, 'i')
          .replace(/i/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ş/g, 's')
          .replace(/ü/g, 'u');
          if(r.indexOf(term)!=-1)
            return true;
        }
      }
      return false;
    }
}
