import { PermissionService } from '@abp/ng.core';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';

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
  var MENU: MenuItem[] = [
    { id: 0, label: 'Ana Sayfa', icon: 'ri-home-4-line', link: '/home' },
    { id: 0, label: 'Apartman Yönetimi', icon: 'ri-building-line', link: '/apartments', isAdminPage: false },
    { id: 0, label: 'Daire Yönetimi', icon: 'ri-building-2-line', link: '/housing', isAdminPage: false },
    { id: 0, label: 'Sakin Yönetimi', icon: 'ri-group-line', link: '/floor-resident', isAdminPage: false },
    { id: 0, label: 'Aidat Takibi', icon: 'ri-money-dollar-circle-line', link: '/dues-transaction', isAdminPage: false },
    { id: 0, label: 'Gider Yönetimi', icon: 'ri-bill-line', link: '/expense', isAdminPage: false },
    { id: 0, label: 'Arıza / Talepler', icon: 'ri-tools-line', link: '/arizalar', isAdminPage: false },
    { id: 0, label: 'Duyurular', icon: 'ri-megaphone-line', link: '/duyurular', isAdminPage: false },
    {
      id: 0, label: 'Açılır Menu', icon: 'bx bx-shopping-bag', isCollapsed: true, isAdminPage: false,
      subItems: [
        { id: 1000, label: 'Menü 1', icon: 'ri-team-line', link: '', parentId: 2, isAdminPage: false },
        { id: 1002, label: 'Menü 2', icon: 'ri-team-line', link: '', parentId: 2, isAdminPage: false },
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
      if (el.subItems?.length > 0) {
        el.subItems.forEach((elSub: any) => { elSub.parentId = i; });
      }
    }
    i++;
  });
  return MENU;
}

function allowAllMenus(MENU: MenuItem[]) {
  MENU.filter(x => x.isAdminPage == false).forEach(i => {
    if (i.isLayout != undefined) i.isLayout = true;
    if (i.subItems?.length > 0) i.subItems = allowAllMenus(i.subItems);
  });
  MENU.filter(x => x.isAdminPage == true).forEach(i => {
    i.isLayout = false;
    if (i.subItems?.length > 0) i.subItems = allowAllMenus(i.subItems);
  });
  MENU.filter(x => x.isAdminPage == undefined).forEach(i => {
    if (i.subItems?.length > 0) i.subItems = allowAllMenus(i.subItems);
  });
  return MENU;
}
