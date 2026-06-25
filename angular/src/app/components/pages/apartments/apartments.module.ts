import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApartmentsRoutingModule } from './apartments-routing.module';
import { ApartmentsListComponent } from './apartments-list/apartments-list.component';

@NgModule({
  declarations: [ApartmentsListComponent],
  imports: [CommonModule, FormsModule, ApartmentsRoutingModule],
})
export class ApartmentsModule {}
