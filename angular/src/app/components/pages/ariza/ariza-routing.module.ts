import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArizaListComponent } from './ariza-list/ariza-list.component';

const routes: Routes = [
  { path: '', component: ArizaListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArizaRoutingModule { }
