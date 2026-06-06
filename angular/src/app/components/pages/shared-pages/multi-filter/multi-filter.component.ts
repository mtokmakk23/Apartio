import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-multi-filter',

  templateUrl: './multi-filter.component.html',
  styleUrl: './multi-filter.component.scss'
})
export class MultiFilterComponent {
@Input() field!: string;
  @Input() dataList: any[] = [];
   ngOnInit(): void {
  }
  getFilterArray(columnName: string): any[] {
   if (this.dataList==undefined) {

     return[];
   }
    const uniqueValues = new Set();
    for (let item of this.dataList) {
      if (item[columnName] !== undefined && item[columnName] !== null) {
        uniqueValues.add(item[columnName]);
      }
    }

    return Array.from(uniqueValues);
  }
  /*
  @Input() field!: string;
  @Input() liste: any[] = [];
  options:any[]=[];
  ngOnInit(): void {
    this.options=this.getFilterArray(this.field);
  }
   getFilterArray(columnName: string): any[] {
    const uniqueValues = new Set();
    for (let item of this.liste) {
      if (item[columnName] !== undefined && item[columnName] !== null) {
        uniqueValues.add(item[columnName]);
      }
    }

    return Array.from(uniqueValues);
  }
  */
}
