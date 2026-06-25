import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DuesTransactionRoutingModule } from './dues-transaction-routing.module';
import { DuesTransactionListComponent } from './dues-transaction-list/dues-transaction-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DuesTransactionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    DuesTransactionRoutingModule,
    SharedModule
  ]
})
export class DuesTransactionModule { }
