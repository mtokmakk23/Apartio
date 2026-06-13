import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'daireler', loadChildren: () => import('./daire/daire.module').then(m => m.DaireModule) },
  { path: 'sakinler', loadChildren: () => import('./sakin/sakin.module').then(m => m.SakinModule) },
  { path: 'aidatlar', loadChildren: () => import('./aidat/aidat.module').then(m => m.AidatModule) },
  { path: 'arizalar', loadChildren: () => import('./ariza/ariza.module').then(m => m.ArizaModule) },
  { path: 'duyurular', loadChildren: () => import('./duyuru/duyuru.module').then(m => m.DuyuruModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
