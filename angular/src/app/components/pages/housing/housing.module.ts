import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousingRoutingModule } from './housing-routing.module';
import { HousingListComponent } from './housing-list/housing-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HousingListComponent],
  imports: [
    CommonModule,
    FormsModule,
    HousingRoutingModule,
    SharedModule
  ]
})
export class HousingModule { }
