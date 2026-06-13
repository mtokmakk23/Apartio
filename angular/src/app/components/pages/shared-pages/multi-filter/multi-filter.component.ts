import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multi-filter',
  templateUrl: './multi-filter.component.html',
  styleUrl: './multi-filter.component.scss'
})
export class MultiFilterComponent {
  @Input() field!: string;
  @Input() dataList: any[] = [];
  @Output() filterChange = new EventEmitter<any>();

  ngOnInit(): void {}

  onFilterChange(event: any) {
    this.filterChange.emit(event.target.value);
  }

  getFilterArray(columnName: string): any[] {
    if (this.dataList == undefined) {
      return [];
    }
    const uniqueValues = new Set();
    for (let item of this.dataList) {
      if (item[columnName] !== undefined && item[columnName] !== null) {
        uniqueValues.add(item[columnName]);
      }
    }
    return Array.from(uniqueValues);
  }
}
