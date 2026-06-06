import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Inject,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventService } from 'src/app/core/services/event.service';

//Logout

import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

// Language
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from 'src/app/core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { allNotification, messages } from './data';
import { CartModel } from './topbar.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbpOAuthService } from '@abp/ng.oauth';
import { Abp } from '@abp/ng.setting-management/proxy/lib/proxy/volo';
import { environment } from 'src/environments/environment';
import { AuthService, CurrentUserDto, PermissionService } from '@abp/ng.core';

import { firstValueFrom } from 'rxjs';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';

import { UserServiceService } from 'src/app/services/users/user-service.service';
import { CurrentUserServiceService } from 'src/app/services/utils/current-user-service/current-user-service.service';

import introJs from 'intro.js';
import { HelperService } from 'src/app/services/utils/helper/helper.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
     
  approveShopping = false;
  public currentUser: CurrentUserDto;
  messages: any;
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  allnotifications: any;
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  total = 0;
  cart_length: any = 0;
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;
  isDropdownOpen = false;
  @ViewChild('removenotification') removenotification!: TemplateRef<any>;
  notifyId: any;

  constructor(
    @Inject(DOCUMENT) private documentt: any,
    private eventService: EventService,
    public languageService: LanguageService,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private router: Router,
    private TokenStorageService: TokenStorageService,
    private authService: AuthService,
    public currentUserService: CurrentUserServiceService,
    public permissionService: PermissionService,
    private toast: ToasterService,
    private confirmation: ConfirmationService,
    private userService: UserServiceService,
    
  ) {}

  async ngOnInit(): Promise<void> {

    this.currentUser = this.currentUserService.currentUser.value;
 

    this.userData = this.TokenStorageService.getUser();
    this.element = document.documentElement;
    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'assets/images/flags/us.svg';
      }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }


  }


    @ViewChild('targetBtn') targetBtn!: ElementRef;



  // Delete Item

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.documentt.exitFullscreen) {
        this.documentt.exitFullscreen();
      } else if (this.documentt.mozCancelFullScreen) {
        /* Firefox */
        this.documentt.mozCancelFullScreen();
      } else if (this.documentt.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.documentt.webkitExitFullscreen();
      } else if (this.documentt.msExitFullscreen) {
        /* IE/Edge */
        this.documentt.msExitFullscreen();
      }
    }
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    // this.submitted = false;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);
    this.eventService.changePrimengMode(mode);
    switch (mode) {
      case 'light':
        document.documentElement.setAttribute('data-bs-theme', 'light');
        break;
      case 'dark':
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        break;
      default:
        document.documentElement.setAttribute('data-bs-theme', 'light');
        break;
    }
  }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'de' },
    { text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
    { text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
    { text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
    { text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
    { text: 'Arabic', flag: 'assets/images/flags/ar.svg', lang: 'ar' },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout().subscribe(res => {
      setTimeout(() => {
        this.authService.navigateToLogin();
      }, 1000);
    });

    //window.location.href=environment.apis.default.url+"/api/account/logout";

    //this.router.navigate(['/home']);
  }

  windowScroll() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      (document.getElementById('back-to-top') as HTMLElement).style.display = 'block';
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      (document.getElementById('back-to-top') as HTMLElement).style.display = 'none';
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    } else {
      this.isDropdownOpen = true;
    }
  }
  // Search Topbar
  Search() {
    var searchOptions = document.getElementById('search-close-options') as HTMLAreaElement;
    var dropdown = document.getElementById('search-dropdown') as HTMLAreaElement;
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById('search-options') as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add('show');
      searchOptions.classList.remove('d-none');
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName('notify-item');

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = '';
        if (element.querySelector('h6')) {
          var spantext = element.getElementsByTagName('span')[0].innerText.toLowerCase();
          var name = element.querySelector('h6').innerText.toLowerCase();
          if (name.includes(inputVal)) {
            notifiTxt = name;
          } else {
            notifiTxt = spantext;
          }
        } else if (element.getElementsByTagName('span')) {
          notifiTxt = element.getElementsByTagName('span')[0].innerText.toLowerCase();
        }
        if (notifiTxt) element.style.display = notifiTxt.includes(inputVal) ? 'block' : 'none';
      });
    } else {
      dropdown.classList.remove('show');
      searchOptions.classList.add('d-none');
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById('search-close-options') as HTMLAreaElement;
    var dropdown = document.getElementById('search-dropdown') as HTMLAreaElement;
    var searchInputReponsive = document.getElementById('search-options') as HTMLInputElement;
    dropdown.classList.remove('show');
    searchOptions.classList.add('d-none');
    searchInputReponsive.value = '';
  }

  // Remove Notification
  checkedValGet: any[] = [];
  onCheckboxChange(event: any, id: any) {
    this.notifyId = id;
    var result;
    if (id == '1') {
      var checkedVal: any[] = [];
      for (var i = 0; i < this.allnotifications.length; i++) {
        if (this.allnotifications[i].state == true) {
          result = this.allnotifications[i].id;
          checkedVal.push(result);
        }
      }
      this.checkedValGet = checkedVal;
    } else {
      var checkedVal: any[] = [];
      for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i].state == true) {
          result = this.messages[i].id;
          checkedVal.push(result);
        }
      }
      this.checkedValGet = checkedVal;
    }
    checkedVal.length > 0
      ? ((document.getElementById('notification-actions') as HTMLElement).style.display = 'block')
      : ((document.getElementById('notification-actions') as HTMLElement).style.display = 'none');
  }

  notificationDelete() {
    if (this.notifyId == '1') {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < this.allnotifications.length; j++) {
          if (this.allnotifications[j].id == this.checkedValGet[i]) {
            this.allnotifications.splice(j, 1);
          }
        }
      }
    } else {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < this.messages.length; j++) {
          if (this.messages[j].id == this.checkedValGet[i]) {
            this.messages.splice(j, 1);
          }
        }
      }
    }
    this.calculatenotification();
    this.modalService.dismissAll();
  }

  calculatenotification() {
    this.totalNotify = 0;
    this.checkedValGet = [];

    this.checkedValGet.length > 0
      ? ((document.getElementById('notification-actions') as HTMLElement).style.display = 'block')
      : ((document.getElementById('notification-actions') as HTMLElement).style.display = 'none');
    if (this.totalNotify == 0) {
      document.querySelector('.empty-notification-elem')?.classList.remove('d-none');
    }
  }
}
