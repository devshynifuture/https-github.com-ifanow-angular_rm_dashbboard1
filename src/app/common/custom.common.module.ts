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
    DashEvent
  ],
  entryComponents: [LinkBankComponent, RealEstatePropertyComponent, DashEvent]
})
export class CustomCommonModule {
}
