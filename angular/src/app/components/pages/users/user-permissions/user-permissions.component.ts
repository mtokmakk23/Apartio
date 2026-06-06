import { CurrentUserDto } from '@abp/ng.core';
import { Component, Input, OnInit } from '@angular/core';

import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  EntityPermissionsDto,
  PermissionGroupsDto,
  PermissionsDto,
  UserDto,
} from 'src/app/services/users/models';
import { UserServiceService } from 'src/app/services/users/user-service.service';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
})
export class UserPermissionsComponent implements OnInit {
  //#region Fields
  @Input() data: any;
  @Input() modalRef: NgbModalRef;

  destroy$ = new Subject<void>();
  currentUser: CurrentUserDto;
  user: UserDto;
  userRoles: string[] = [];
  providerKey: string;
  providerName: string = 'U';
  entityPermissions: EntityPermissionsDto = {
    entityDisplayName: null,
    groups: [],
  };
  groups: PermissionGroupsDto[];
  selectedGroup: PermissionGroupsDto = {
    displayName: null,
    name: null,
    permissions: [],
  };
  selectedPermissions: PermissionsDto[];
  allPermissions: PermissionsDto[] = [];
  grantAllPermissions: boolean = true;
  selectAllPermissions: boolean = true;
  isChild: boolean = false;
  //#endregion

  //#region Utilities
  async getUserById(id: string): Promise<void> {
    this.user = await firstValueFrom(this.userService.get(id));
    this.providerKey = this.user.id;
    await this.loadPermissions(this.providerName, this.providerKey);
  }

  async loadPermissions(providerName, providerKey) {
    this.entityPermissions = await firstValueFrom(this.userService
      .getPermissions(providerName, providerKey)
      );
      if (!this.currentUserInfoService.isAdmin) {
        this.entityPermissions.groups = this.entityPermissions.groups.filter(x => x.name == 'CustomerPermGroup');
      }
    this.groups = this.entityPermissions.groups;
   
    // if (
    //   this.currentUser.roles.some(
    //     r => r.toLocaleLowerCase('tr') == 'admin' || r.toLocaleLowerCase('tr') == 'developer'
    //   )
    // ) {
    // } else {
    //   this.currentUser.clCard != null
    //     ? (this.groups = this.entityPermissions.groups.filter(x => x.name == 'Delta'))
    //     : (this.groups = this.entityPermissions.groups.filter(x => x.name == 'Soa'));
    // }

    this.groups.forEach(x => {
      x.permissions.forEach(y => {
        if (y.grantedProviders.filter(g => g.providerName == 'R').length > 0) y.isDisabled = true;
        else y.isDisabled = false;
      });
    });
    this.selectedGroup = this.groups[0];
    this.selectedPermissions = this.selectedGroup.permissions;
    this.grantAllPermissions = this.loadGrantAllPermissions();
    this.selectAllPermissions = this.loadSelectAllPermissions();
  }
  //#endregion

  //#region Const
  constructor(
    private readonly userService: UserServiceService,
    private readonly currentUserInfoService: CurrentUserServiceService
  ) {
    this.currentUser = this.currentUserInfoService.currentUser.value;
  }
  //#endregion

  //#region Methods
  async ngOnInit(): Promise<void> {
    await this.getUserById(this.data.id);
  }

  async save() {
    for (let i = 0; i < this.entityPermissions.groups.length; i++) {
      for (let j = 0; j < this.entityPermissions.groups[i].permissions.length; j++) {
        this.allPermissions.push(this.entityPermissions.groups[i].permissions[j]);
      }
    }
    await firstValueFrom(this.userService
      .savePermissions(this.allPermissions, this.providerName, this.providerKey)
      );
    this.modalRef.close();
  }

  changeDisplays(name: string) {
    this.selectedGroup = this.entityPermissions.groups.filter(x => x.name == name)[0];
    this.selectedPermissions = this.selectedGroup.permissions;
    this.selectAllPermissions = this.loadSelectAllPermissions();
  }

  changeGrantAllPermissions() {
    for (let i = 0; i < this.groups.length; i++) {
      for (let j = 0; j < this.groups[i].permissions.length; j++) {
        if (!this.groups[i].permissions[j].isDisabled)
          if (this.grantAllPermissions) this.groups[i].permissions[j].isGranted = true;
          else this.groups[i].permissions[j].isGranted = false;
      }
    }
    this.selectAllPermissions = this.loadSelectAllPermissions();
  }

  loadGrantAllPermissions(): boolean {
    for (let i = 0; i < this.groups.length; i++) {
      for (let j = 0; j < this.groups[i].permissions.length; j++) {
        if (!this.groups[i].permissions[j].isGranted) return false;
      }
    }
    return true;
  }

  changeSelectAllPermissions() {
    for (let i = 0; i < this.selectedGroup.permissions.length; i++) {
      if (!this.selectedGroup.permissions[i].isDisabled)
        if (this.selectAllPermissions) this.selectedGroup.permissions[i].isGranted = true;
        else this.selectedGroup.permissions[i].isGranted = false;
    }
    this.grantAllPermissions = this.loadGrantAllPermissions();
  }

  loadSelectAllPermissions(): boolean {
    for (let i = 0; i < this.selectedGroup.permissions.length; i++) {
      if (!this.selectedGroup.permissions[i].isGranted) return false;
    }
    return true;
  }

  changeChilds(changed: PermissionsDto) {
    if (changed.parentName != null) {
      this.selectedGroup.permissions.find(x => x.name == changed.parentName).isGranted = true;
    } else {
      if (!changed.isGranted)
        this.selectedGroup.permissions
          .filter(p => p.parentName == changed.name)
          .forEach(p => (p.isGranted = false));
    }
    this.selectAllPermissions = this.loadSelectAllPermissions();
    this.grantAllPermissions = this.loadGrantAllPermissions();
  }
  //#endregion
}
