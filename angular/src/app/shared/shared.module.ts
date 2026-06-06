import { CoreModule } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { ThemeSharedModule, ToasterService } from '@abp/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import {
  NgbAccordionModule,
  NgbAlertModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbPopoverModule,
  NgbProgressbarModule,
  NgbToastModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastModule } from 'primeng/toast';
import { CountUpModule } from 'ngx-countup';
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FlatpickrDirective, FlatpickrModule } from 'angularx-flatpickr';
import { LightboxModule } from 'ngx-lightbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SimplebarAngularModule } from 'simplebar-angular';

@NgModule({
  declarations: [],
  imports: [
    CoreModule,
    ThemeSharedModule,
    NgxValidateCoreModule,
    TableModule,
    ButtonModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgSelectModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbModule,
    ToastModule,
    CountUpModule,
    NgbModalModule,
    NgApexchartsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FlatpickrDirective,
    LightboxModule,
    FlatpickrModule.forRoot(),
    SimplebarAngularModule,
    MultiSelectModule
  ],
  exports: [
    CoreModule,
    ThemeSharedModule,
    NgbDropdownModule,
    NgSelectModule,
    NgxValidateCoreModule,
    TableModule,
    ButtonModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbToastModule,
    NgbModule,
    ToastModule,
    CountUpModule,
    NgbModalModule,
    NgApexchartsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FlatpickrDirective,
    LightboxModule,
    SimplebarAngularModule,
    MultiSelectModule,
    
  ],
  providers: [provideNgxMask()],
})
export class SharedModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
