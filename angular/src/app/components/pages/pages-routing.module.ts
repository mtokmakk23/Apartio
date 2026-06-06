import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';
import { EmptyComponent } from './shared-pages/empty/empty.component';


// Component pages


const routes: Routes = [
  {
    path: '',
    component:EmptyComponent
  },
  
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {

}
