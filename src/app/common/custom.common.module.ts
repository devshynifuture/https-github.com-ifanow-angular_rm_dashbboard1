import { NgModule } from '@angular/core';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { MaterialModule } from '../material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressButtonComponent } from './progress-button/progress-button.component';
import { CustomDirectiveModule } from "./directives/common-directive.module";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LinkBankComponent } from './link-bank/link-bank.component';
import { EmailDomainAutoSuggestComponent } from './email-domain-auto-suggest/email-domain-auto-suggest.component';
import { GoogleConnectComponent } from '../component/protect-component/AdviserComponent/Email/email-component/email-list/email-listing/google-connect/google-connect.component';
import { CalendarScheduleComponent } from '../component/protect-component/AdviserComponent/Activities/calendar/calendar-schedule/calendar-schedule.component';
import { DashEvent } from '../component/protect-component/AdviserComponent/Activities/calendar/dash-event';
import { RealEstatePropertyComponent } from './real-estate-property/real-estate-property.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CredentialsErrorPopupComponent } from './credentials-error-popup/credentials-error-popup.component';
import { AccountAndBillingComponent } from '../component/protect-component/AdviserComponent/account-and-billing/account-and-billing/account-and-billing.component';
import { ChangeClientPasswordComponent } from '../component/protect-component/customers/component/customer/customer-overview/overview-profile/change-client-password/change-client-password.component';

// import {CommonComponentModule} from '../component/protect-component/common-component/common-component.module'
// import {FroalaComponent} from '../component/protect-component/common-component/froala/froala.component';

@NgModule({
  declarations: [
    DialogContainerComponent,
    ProgressButtonComponent,
    LinkBankComponent,
    RealEstatePropertyComponent,
    EmailDomainAutoSuggestComponent,
    GoogleConnectComponent,
    CalendarScheduleComponent,
    DashEvent,
    CredentialsErrorPopupComponent,
    AccountAndBillingComponent,
    ChangeClientPasswordComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    NgxMaterialTimepickerModule
    // CommonComponentModule
  ],
  exports: [
    DialogContainerComponent,
    ProgressButtonComponent,
    LinkBankComponent,
    RealEstatePropertyComponent,
    EmailDomainAutoSuggestComponent,
    GoogleConnectComponent,
    CalendarScheduleComponent,
    DashEvent,
    ChangeClientPasswordComponent
  ],
  entryComponents: [LinkBankComponent, RealEstatePropertyComponent, DashEvent, CredentialsErrorPopupComponent, ChangeClientPasswordComponent]
})
export class CustomCommonModule {
}
