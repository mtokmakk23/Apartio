import { ReplaceableComponentsService } from '@abp/ng.core';
import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layouts/layout.component';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { AbpOAuthService } from '@abp/ng.oauth';

@Component({
  selector: 'app-root',
  template: `
 
    <abp-loader-bar></abp-loader-bar>
    <abp-dynamic-layout></abp-dynamic-layout>
  `,
})
export class AppComponent implements OnInit{
  connection: signalR.HubConnection;
  protected readonly oAuthService = inject(AbpOAuthService);

  constructor(    private replaceableComponents: ReplaceableComponentsService ){

    this.replaceableComponents.add({
      component: LayoutComponent,
      key: eThemeLeptonXComponents.ApplicationLayout,
    });
  }

  ngOnInit(): void {
  
  //   this.connection = new signalR.HubConnectionBuilder()
  //   .withUrl(`${environment.apis.default.url}/signalr-hubs/message`, {
  //     accessTokenFactory: () => this.oAuthService.getAccessToken(),
  //   })
  //   .build();     
  // this.connection.on('ReceiveMessage', this.handleMessage);
  // this.connection.on('SuccessNotification', this.successNotification);
  // this.connection.on('ErrorNotification', this.ErrorNotification);

  // this.connection
  //   .start()
  //   .then(() => {
  //      console.log('Websocket Connection started');
  //   })
  //   .catch(err => console.error(err.toString()));

  }
  successNotification = (header:string,message:string) => {
   /* this.toaster.clear();
    this.toaster.success(message, header,{closable:true});
    */  
    }
    ErrorNotification = (header:string,message:string) => {
    /*  this.toaster.clear();
    this.toaster.error(message, header,{closable:true});
     */ 
    }
  
  handleMessage = (rate: number,header:string) => {
   /*
    if (rate%10==0) {
    this.toaster.clear();
    this.toaster.info(header, rate+"%",{closable:true});
   */   
    }
  
  };

