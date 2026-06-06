import { CurrentUserDto, PermissionService } from '@abp/ng.core';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';
import { environment } from 'src/environments/environment';

export interface MenuItem {
  id?: number;
  label?: any;
  icon?: string;
  isCollapsed?: any;
  link?: string;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  isAdminPage?: boolean;
}
export function getMenuItems(
  permissionService: PermissionService,
  currentUserService: CurrentUserServiceService,
) {
  var MENU: MenuItem[] = [];

  MENU = [
    {
      id: 0,
      label: 'Ana Sayfa',
      icon: 'ri-home-4-line',
      link: '/home'
    },
   
    {
      id: 0,
      label: 'Açılır Menu',
      icon: 'bx bx-shopping-bag',
     // isLayout: permissionService.getGrantedPolicy('CustomerPermGroup.CreateOrder') ,
      isCollapsed: true,
      isAdminPage: false,
      subItems: [
        {
          id: 1000,
          label: 'Menü 1',
          icon: 'ri-team-line',
          link: '',
          parentId: 2,
          isAdminPage: false,
        },
        {
          id: 1002,
          label: 'Menü 2',
          icon: 'ri-team-line',
          link: '',
          parentId: 2,
          isAdminPage: false,
        },
       
      ],
    },
   
  ];
  if (currentUserService.isAdmin && currentUserService.customerNo != '') {
    MENU = allowAllMenus(MENU);
  }
  if (!currentUserService.isAdmin) {
    MENU = MENU.filter(x => x.isAdminPage != true);
  }

  var i = 0;
  MENU.forEach(el => {
    if (el.id == 0) {
      el.id = i;
      if (el.subItems != undefined)
        if (el.subItems.length > 0) {
          el.subItems.forEach(elSub => {
            elSub.parentId = i;
          });
        }
    }
    i++;
  });
  return MENU;
}

function allowAllMenus(MENU: MenuItem[]) {
  MENU.filter(x => x.isAdminPage == false).forEach(i => {
    if (i.isLayout != undefined) i.isLayout = true;
    if (i.subItems != undefined)
      if (i.subItems.length > 0) {
        i.subItems = allowAllMenus(i.subItems);
      }
  });
  MENU.filter(x => x.isAdminPage == true).forEach(i => {
    i.isLayout = false;
    if (i.subItems != undefined)
      if (i.subItems.length > 0) {
        i.subItems = allowAllMenus(i.subItems);
      }
  });
  MENU.filter(x => x.isAdminPage == undefined).forEach(i => {
    if (i.subItems != undefined)
      if (i.subItems.length > 0) {
        i.subItems = allowAllMenus(i.subItems);
      }
  });
  return MENU;
}
