import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseListComponent } from './expense-list/expense-list.component';

@NgModule({
  declarations: [ExpenseListComponent],
  imports: [CommonModule, FormsModule, ExpenseRoutingModule],
})
export class ExpenseModule {}
