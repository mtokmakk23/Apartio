import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigStateService, CurrentUserDto } from '@abp/ng.core';
import { UserServiceService } from '../../users/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserServiceService implements OnInit {

//#region Fields
currentUser = new BehaviorSubject<CurrentUserDto>(null);
isAdmin=false;
customerNo="";
currentUserInfo: CurrentUserDto;
isLoadingUser=false;
isBlock=false;
//#endregion

//#region Ctor
constructor(private configStateService: ConfigStateService,private userService:UserServiceService) {
  this.buildCurrentUserInfo();
}
//#endregion

//#region Methods
ngOnInit(): void {
  this.buildCurrentUserInfo();
}
private buildCurrentUserInfo(): CurrentUserDto {
  this.currentUserInfo = null;
  this.configStateService.getDeep$('currentUser').subscribe((response: CurrentUserDto) => {
    this.currentUserInfo = response;
    if (this.currentUserInfo.id!=undefined && this.currentUserInfo.id!=null) {
      this.userService.get(this.currentUserInfo.id).subscribe(res=>{

        this.isAdmin=res.extraProperties.IsAdmin;
        this.customerNo=res.extraProperties.CustomerNo;
        this.isLoadingUser=true;
      })
    }else{
      this.isLoadingUser=true;
      
    }
 
  });
  this.currentUser.next(this.currentUserInfo);
  return this.currentUserInfo;
}


setThemeSettings(value: any): void {
  localStorage.setItem("Theme-Settings", JSON.stringify(value));
}

getThemeSettings(): any {
  return JSON.parse(localStorage.getItem("Theme-Settings"));
}

//#endregion

}
