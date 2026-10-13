import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetsRoutingModule } from './assets-routing.module';
import { AssetListComponent } from './asset-list/asset-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AssetListComponent],
  imports: [
    CommonModule,
    FormsModule,
    AssetsRoutingModule,
    SharedModule
  ]
})
export class AssetsModule { }
