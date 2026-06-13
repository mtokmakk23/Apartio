import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArizaRoutingModule } from './ariza-routing.module';
import { ArizaListComponent } from './ariza-list/ariza-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ArizaListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ArizaRoutingModule,
    SharedModule
  ]
})
export class ArizaModule { }
