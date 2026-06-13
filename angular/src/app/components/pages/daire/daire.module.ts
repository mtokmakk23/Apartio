import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DaireRoutingModule } from './daire-routing.module';
import { DaireListComponent } from './daire-list/daire-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DaireListComponent],
  imports: [
    CommonModule,
    FormsModule,
    DaireRoutingModule,
    SharedModule
  ]
})
export class DaireModule { }
