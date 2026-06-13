import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuyuruListComponent } from './duyuru-list/duyuru-list.component';

const routes: Routes = [
  { path: '', component: DuyuruListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuyuruRoutingModule { }
