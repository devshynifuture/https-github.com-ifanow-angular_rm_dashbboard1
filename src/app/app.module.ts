/* tslint:disable:max-line-length */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeftsidebarComponent } from './component/left-sidebar/leftsidebar/leftsidebar.component';
import { AuthService } from './auth-service/authService';
import { DashboardComponent } from './component/protect-component/AdviserComponent/dashboard/dashboard.component';
import { MutualFundsComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/mutual-funds.component';
import { LifeInsuranceComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/life-insurance/life-insurance.component';
import { GeneralInsuranceComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/general-insurance/general-insurance.component';
import { AumComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/aum.component';
import { SipComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip.component';
import { FoliosComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/folios/folios.component';
import { AssetAllocationComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/asset-allocation/asset-allocation.component';
import { FillterSearchComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/fillter-search/fillter-search.component';
import { CategoryWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/category-wise/category-wise.component';
import { AmcWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/amc-wise/amc-wise.component';
import { ClientWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/client-wise/client-wise.component';
import { ApplicantWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/applicant-wise/applicant-wise.component';
import { MisComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mis/mis.component';
import { HttpService } from './http-service/http-service';

import { SipAmcWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-amc-wise/sip-amc-wise.component';
import { SipSchemeWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-scheme-wise/sip-scheme-wise.component';
import { SipClientWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-client-wise/sip-client-wise.component';
import { SipApplicantWiseComponent } from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-applicant-wise/sip-applicant-wise.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { CustomFormInputComponent } from './common/custom-form-input/custom-form-input.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { LoginComponent } from './component/no-protected/login/login.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { BaseComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/base/base.component';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { CustomCommonModule } from './common/custom.common.module';
import { DatePipe } from '@angular/common';
import { MatSortModule, MatTableModule } from '@angular/material';
import { DynamicComponentService } from './services/dynamic-component.service';
// import { SubscriptionModule } from './component/protect-component/AdviserComponent/Subscriptions/subscription.module';
import { SubscriptionEntry } from './component/protect-component/AdviserComponent/Subscriptions/subscription.entry.module';
import { EmailEntryModule } from './component/protect-component/AdviserComponent/Email/email.entry.module';
import 'zone.js/dist/zone';
import { CalenderComponent } from "./component/protect-component/AdviserComponent/Email/calender/calender.component";
import { SubscriptionUpperEntry } from './component/protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';
import { EmailModule } from './component/protect-component/AdviserComponent/Email/email.module';
// import { PDFExportModule } from '@progress/kendo-angular-pdf-export';


// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    LeftsidebarComponent,
    DashboardComponent,

    MutualFundsComponent,
    LifeInsuranceComponent,
    GeneralInsuranceComponent,
    AumComponent,
    SipComponent,
    FoliosComponent,
    AssetAllocationComponent,
    FillterSearchComponent,
    CategoryWiseComponent,
    AmcWiseComponent,
    ClientWiseComponent,
    ApplicantWiseComponent,
    MisComponent,
    SipAmcWiseComponent,
    SipSchemeWiseComponent,
    SipClientWiseComponent,
    SipApplicantWiseComponent,
    LoginComponent,
    // ConfirmDialogComponent,
    DialogComponent,
    CustomFormInputComponent,
    BaseComponent,
    // RadioGroupDirectiveDirective,

    // DialogContainerComponent,
    // CustomDialogContainerComponent,
    // AddLiabilitiesComponent,
    // AddInsuranceComponent
    CalenderComponent,

  ],
  imports: [

    SubscriptionEntry,
    SubscriptionUpperEntry,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentDateModule,
    MatSortModule,
    MatTableModule,
    // CommonSubscriptionComponent,
    SlimLoadingBarModule.forRoot(),

    MDBBootstrapModule.forRoot(),
    DragDropModule,
    CustomCommonModule,
    EmailModule,

    // EntryComponentsModule,
    // AccountEntryModule,
    // PlanEntryModule,
    EmailEntryModule,

    // SubscriptionRoutingModule,
    // PlanRoutingModule,
    // AccountRoutingModule,
    // SubscriptionModule,
    // CustomersModule,
    // AccountModule,
    // PlanModule,
    AppRoutingModule
  ],
  providers: [AuthService, HttpService, DatePipe, DynamicComponentService],
  bootstrap: [AppComponent],
  entryComponents: [SubscriptionEntry.getComponentList(), SubscriptionUpperEntry.getComponentList()]
  // entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), PlanEntryModule.getComponentList()]
})
export class AppModule {
}
