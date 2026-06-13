import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaireListComponent } from './daire-list/daire-list.component';

const routes: Routes = [
  { path: '', component: DaireListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DaireRoutingModule { }
