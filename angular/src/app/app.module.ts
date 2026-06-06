import { CoreModule } from '@abp/ng.core';
import { SettingManagementConfigModule } from '@abp/ng.setting-management/config';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdentityConfigModule } from '@abp/ng.identity/config';
import { AccountConfigModule } from '@abp/ng.account/config';
import { TenantManagementConfigModule } from '@abp/ng.tenant-management/config';
import { registerLocale } from '@abp/ng.core/locale';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { FeatureManagementModule } from '@abp/ng.feature-management';
import { ThemeLeptonXModule } from '@abp/ng.theme.lepton-x';
import { SideMenuLayoutModule } from '@abp/ng.theme.lepton-x/layouts';
import { AbpOAuthModule } from '@abp/ng.oauth';
import { LayoutsModule } from './components/layouts/layouts.module';
import { EventService } from './core/services/event.service';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ServiceWorkerModule } from '@angular/service-worker';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LayoutsModule,
    ToastModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
    }),
    AbpOAuthModule.forRoot(),
    StoreModule.forRoot(rootReducer),
    AccountConfigModule.forRoot(),
    TenantManagementConfigModule.forRoot(),
    IdentityConfigModule.forRoot(),
    ThemeSharedModule.forRoot(),
    SettingManagementConfigModule.forRoot(),
    ThemeLeptonXModule.forRoot(),
    SideMenuLayoutModule.forRoot(),
    FeatureManagementModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [APP_ROUTE_PROVIDER,TranslateService,MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
