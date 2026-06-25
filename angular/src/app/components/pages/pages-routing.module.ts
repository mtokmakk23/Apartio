import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
  },
  {
    path: 'housing',
    loadChildren: () => import('./housing/housing.module').then(m => m.HousingModule),
  },
  {
    path: 'floor-resident',
    loadChildren: () => import('./floor-resident/floor-resident.module').then(m => m.FloorResidentModule),
  },
  {
    path: 'dues-transaction',
    loadChildren: () => import('./dues-transaction/dues-transaction.module').then(m => m.DuesTransactionModule),
  },
  {
    path: 'apartments',
    loadChildren: () => import('./apartments/apartments.module').then(m => m.ApartmentsModule),
  },
  {
    path: 'ariza',
    loadChildren: () => import('./ariza/ariza.module').then(m => m.ArizaModule),
  },
  {
    path: 'duyuru',
    loadChildren: () => import('./duyuru/duyuru.module').then(m => m.DuyuruModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
