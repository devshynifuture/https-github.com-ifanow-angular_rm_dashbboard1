import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeftsidebarComponent } from './component/left-sidebar/leftsidebar/leftsidebar.component';
import { AuthService } from './auth-service/authService';
import { DashboardComponent } from './component/protect-component/AdviserComponent/dashboard/dashboard.component';
import { SubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/subscription.component';
import { DashboardSubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/dashboard-subscription/dashboard-subscription.component';
import { ClientSubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/client-subscription/client-subscription.component';
import { SubscriptionsSubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/subscriptions-subscription/subscriptions-subscription.component';
import { QuotationsSubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/quotations-subscription/quotations-subscription.component';
import { InvoicesSubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/invoices-subscription/invoices-subscription.component';
import { SettingsSubscriptionComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/settings-subscription.component';
import { PlansSettingsComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/plans-settings/plans-settings.component';
import { ServicesSettingsComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/services-settings/services-settings.component';
import { DocumentsSettingsComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/documents-settings/documents-settings.component';
import { PreferencesSettingsComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/preferences-settings/preferences-settings.component';
import { UpperSliderComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/upper-slider/upper-slider.component';
import { OverviewComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/overview/overview.component';
import { ServicesComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/services/services.component';
import { DocumentComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/document/document.component';
import { FeeStructureComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/fee-structure/fee-structure.component';
import { PlansComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/plans/plans.component';
import { ModulesComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/modules/modules.component';
import { AddStructureComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/add-structure/add-structure.component';
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
import { DocumentsSubscriptionsComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/documents-subscriptions/documents-subscriptions.component';

import { SlimLoadingBarService, SlimLoadingBarModule } from "ng2-slim-loading-bar";
import { GayatriComponent } from './component/protect-component/AdviserComponent/gayatri/gayatri.component';
@NgModule({
  declarations: [
    AppComponent,
    LeftsidebarComponent,
    DashboardComponent,
    SubscriptionComponent,
    DashboardSubscriptionComponent,
    ClientSubscriptionComponent,
    SubscriptionsSubscriptionComponent,
    QuotationsSubscriptionComponent,
    InvoicesSubscriptionComponent,
    SettingsSubscriptionComponent,
    PlansSettingsComponent,
    ServicesSettingsComponent,
    DocumentsSettingsComponent,
    PreferencesSettingsComponent,
    UpperSliderComponent,
    OverviewComponent,
    ServicesComponent,
    DocumentComponent,
    FeeStructureComponent,
    PlansComponent,
    ModulesComponent,
    AddStructureComponent,
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
    DocumentsSubscriptionsComponent,
    GayatriComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SlimLoadingBarModule.forRoot()  
  ],
  providers: [AuthService,HttpService, ],
  bootstrap: [AppComponent],
  entryComponents:[UpperSliderComponent]
})
export class AppModule { }
