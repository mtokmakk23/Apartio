import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AidatRoutingModule } from './aidat-routing.module';
import { AidatListComponent } from './aidat-list/aidat-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AidatListComponent],
  imports: [
    CommonModule,
    FormsModule,
    AidatRoutingModule,
    SharedModule
  ]
})
export class AidatModule { }
