import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloorResidentRoutingModule } from './floor-resident-routing.module';
import { FloorResidentListComponent } from './floor-resident-list/floor-resident-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FloorResidentListComponent],
  imports: [
    CommonModule,
    FormsModule,
    FloorResidentRoutingModule,
    SharedModule
  ]
})
export class FloorResidentModule { }
