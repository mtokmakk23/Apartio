import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddOrUpdateComponent } from './user-add-or-update/user-add-or-update.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';
import { MessageService } from 'primeng/api';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';



@NgModule({
  declarations: [UserListComponent,UserAddOrUpdateComponent,UserPermissionsComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ],
  providers:[MessageService]
})
export class UsersModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
