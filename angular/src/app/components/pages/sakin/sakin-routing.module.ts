import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SakinListComponent } from './sakin-list/sakin-list.component';

const routes: Routes = [
  { path: '', component: SakinListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SakinRoutingModule { }
