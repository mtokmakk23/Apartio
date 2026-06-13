import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SakinRoutingModule } from './sakin-routing.module';
import { SakinListComponent } from './sakin-list/sakin-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SakinListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SakinRoutingModule,
    SharedModule
  ]
})
export class SakinModule { }
