import { CurrentUserDto } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, takeUntil } from 'rxjs';
import { RoleDto, UserDto } from 'src/app/services/users/models';
import { UserServiceService } from 'src/app/services/users/user-service.service';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-add-or-update',
  templateUrl: './user-add-or-update.component.html',
  styleUrl: './user-add-or-update.component.scss',
})
export class UserAddOrUpdateComponent implements OnInit {
  //#region fields
  @Input() data: any;
  @Input() modalRef: NgbModalRef;
  user: UserDto = {
    userName: null,
    tenantId: null,
    name: null,
    password: null,
    surname: null,
    email: null,
    emailConfirmed: null,
    phoneNumber: null,
    phoneNumberConfirmed: null,
    isActive: true,
    lockoutEnd: null,
    lockoutEnabled: true,
    extraProperties: {
      IsAdmin: false,
      CustomerNo: '',
    },
    concurrencyStamp: null,
    creationTime: null,
    creatorId: null,
    lastModificationTime: null,
    lastModifierId: null,
    isDeleted: null,
    deleterId: null,
    deletionTime: null,
  };
  roles: RoleDto[];
  userRoles: RoleDto[] = [];
  currentUser: CurrentUserDto;

  //#endregion

  //#region ctor
  constructor(
    private userService: UserServiceService,
    public currentUserInfoService: CurrentUserServiceService,
    private toaster: ToasterService
  ) {
    this.currentUser = this.currentUserInfoService.currentUser.value;
  }

  //#endregion

  //#region utils

  async getUserById(id: string): Promise<void> {
    this.user = await firstValueFrom(this.userService.get(id));
  }
  async loadRoles(): Promise<void> {
    this.roles = (await firstValueFrom(this.userService.getRoles())).items;

    if (this.data.id == null) {
      this.roles.filter(r => r.isDefault == true).forEach(r => (r.isChecked = true));
      if (this.roles.filter(r => r.isDefault == true).length > 0)
        this.userRoles.push(this.roles.filter(r => r.isDefault == true)[0]);
    } else this.getUserRolesById(this.data.id);
  }
  async getUserRolesById(id: string): Promise<void> {
    this.userRoles = (await firstValueFrom(this.userService.getRolesById(id))).items;
    this.userRoles.forEach(u => (u.isChecked = true));
    this.userRoles.forEach(u => {
      this.roles.filter(r => r.id == u.id)[0].isChecked = true;
    });
  }
  async addOrUpdateUser() {
    if (!this.user.extraProperties.IsAdmin) {
      if (this.user.extraProperties.CustomerNo == '') {
        this.toaster.error('Müşteri Seçilmeden Kullanıcı Oluşturamazsınız!', 'Dikkat');
        return;
      }
    }
    if (!this.currentUser.roles.some(x => x == 'admin' || x == 'developer')) {
      var userName = this.user.userName?.toLocaleLowerCase('tr');
      if (userName.includes('admin') || userName.includes('developer')) {
        this.toaster.warn('Admin ve Developer kullanıcı adı alınamaz!', 'Dikkat');
        return;
      }
    }
    var tempUserRoleNames: string[] = [];
    this.userRoles.forEach(x => {
      tempUserRoleNames.push(x.name);
    });

    if (this.data.id == null) {
      var response = await firstValueFrom(this.userService.add(this.user));
      await firstValueFrom(this.userService.putRoles(response.id, tempUserRoleNames));
    } else {
      await firstValueFrom(this.userService.update(this.user.id, this.user));
      await firstValueFrom(this.userService.putRoles(this.user.id, tempUserRoleNames));
    }
    this.modalRef.close();
  }
  //#endregion

  //#region methods
  async ngOnInit(): Promise<void> {
    await this.loadRoles();
    if (this.data.id != null) {
      await this.getUserById(this.data.id);
    }
    if (!this.currentUserInfoService.isAdmin) {
      this.user.extraProperties.CustomerNo = this.currentUserInfoService.customerNo;
    }
  }
  changeUserRoles(roleId: string) {
    if (this.roles.filter(x => x.id == roleId)[0].isChecked)
      this.userRoles.push(this.roles.filter(x => x.id == roleId)[0]);
    else this.userRoles = this.userRoles.filter(x => x.id != roleId);
  }
  //#endregion
}
