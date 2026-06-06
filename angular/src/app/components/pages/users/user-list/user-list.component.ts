import { CurrentUserDto, PermissionService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import {  UserServiceService } from 'src/app/services/users/user-service.service';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { UserAddOrUpdateComponent } from '../user-add-or-update/user-add-or-update.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ToasterService } from '@abp/ng.theme.shared';
import { UserPermissionsComponent } from '../user-permissions/user-permissions.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  //#region Fields
  destroy$ = new Subject<void>();
  users: IdentityUserDto[];
  loading: boolean = false;
  currentUser: CurrentUserDto;
  currentUserProjectId: number;
  currentUserUsersCreatePermission: boolean;
  currentUserUsersUpdatePermission: boolean;
  currentUserUsersDeletePermission: boolean;
  currentUserUsersManagePermissionsPermission: boolean;
  isCurrentUserOnlyUser: boolean = false;
  //#endregion

  //#region Utilities
  async loadUsers(): Promise<void> {
    this.users=(await firstValueFrom(this.userService.getUserList())).items;
    if (!this.currentUserInfoService.isAdmin) {
      this.users=this.users.filter(x=>x.extraProperties.CustomerNo==this.currentUserInfoService.customerNo);
    }
 //   this.modalService.open(UserAddOrUpdateComponent, { size: 'xl', centered: true });

  }

  // private loadCurrentUserPermissions(): void {
  //   this.currentUserUsersCreatePermission = this.permissionService.getGrantedPolicy(
  //     'AbpIdentity.Users.Create'
  //   );
  //   this.currentUserUsersUpdatePermission = this.permissionService.getGrantedPolicy(
  //     'AbpIdentity.Users.Update'
  //   );
  //   this.currentUserUsersDeletePermission = this.permissionService.getGrantedPolicy(
  //     'AbpIdentity.Users.Delete'
  //   );
  //   this.currentUserUsersManagePermissionsPermission = this.permissionService.getGrantedPolicy(
  //     'AbpIdentity.Users.ManagePermissions'
  //   );
  // }
  //#endregion

  //#region Const
  constructor(
    private userService: UserServiceService,
    private modalService: NgbModal,
    private readonly currentUserInfoService: CurrentUserServiceService,
    private permissionService: PermissionService,
    config: NgbDropdownConfig,
    private toaster: ToasterService
  ) {
    this.currentUser = this.currentUserInfoService.currentUser.value;
    config.container="body";
  }
  //#endregion

  //#region Methods
  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  // filterUsersByCurrentUserRole(): number {
  //   if (this.currentUser.roles.filter(x => x.toLowerCase() == 'ADMİN'.toLowerCase()).length > 0)
  //     return 0;
  //   else return this.currentUser.defaultProject['Id'];
  // }

 async showAddOrUpdateUserDialog(id?: string) {
   
    const modalRef = this.modalService.open(UserAddOrUpdateComponent, { size: 'lg',centered:true });
    modalRef.componentInstance.data = { id: id};
    modalRef.componentInstance.modalRef = modalRef;
    modalRef.result.then((result) => {
      this.loadUsers();

    })

  }

  showPermissionsUserDialog(id?: string) {
    const modalRef =this.modalService.open(UserPermissionsComponent, { size: 'lg',centered:true });
    modalRef.componentInstance.data = { id: id};
    modalRef.componentInstance.modalRef = modalRef;
  }

  // delete(id?: string, userName?: string): void {
  //   this.confirmationService.confirm({
  //     target: event.target,
  //     header: 'Sil',
  //     message: `'<b>${userName}</b>' kullanıcısını silmek istediğinizden emin misiniz?`,
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptLabel: 'Evet',
  //     rejectLabel: 'Hayır',
  //     acceptButtonStyleClass: 'p-button-info',
  //     rejectButtonStyleClass: 'p-button-outlined p-button-danger',
  //     accept: () => {
  //       this.userService.delete(id).subscribe(response => {
  //         this.toastBaseService.success();
  //         this.loadUsers();
  //       });
  //     },
  //     reject: () => {},
  //   });
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion
}

