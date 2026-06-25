import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloorResidentListComponent } from './floor-resident-list/floor-resident-list.component';

const routes: Routes = [
  { path: '', component: FloorResidentListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorResidentRoutingModule { }
