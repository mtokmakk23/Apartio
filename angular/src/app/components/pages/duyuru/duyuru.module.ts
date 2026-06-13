import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DuyuruRoutingModule } from './duyuru-routing.module';
import { DuyuruListComponent } from './duyuru-list/duyuru-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DuyuruListComponent],
  imports: [
    CommonModule,
    FormsModule,
    DuyuruRoutingModule,
    SharedModule
  ]
})
export class DuyuruModule { }
