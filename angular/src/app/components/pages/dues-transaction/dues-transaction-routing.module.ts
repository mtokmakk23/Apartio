import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuesTransactionListComponent } from './dues-transaction-list/dues-transaction-list.component';

const routes: Routes = [
  { path: '', component: DuesTransactionListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuesTransactionRoutingModule { }
