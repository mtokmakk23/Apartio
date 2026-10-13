import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExpenseListComponent],
  imports: [CommonModule, FormsModule, ExpenseRoutingModule, SharedModule],
})
export class ExpenseModule {}
