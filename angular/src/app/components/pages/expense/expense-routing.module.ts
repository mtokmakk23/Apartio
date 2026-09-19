import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListComponent } from './expense-list/expense-list.component';

const routes: Routes = [
  { path: '', component: ExpenseListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
