import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { EmptyComponent } from './shared-pages/empty/empty.component';
import { SharedModule } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [EmptyComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ]
})
export class PagesModule { }
