/* tslint:disable:max-line-length */
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MaterialModule} from './material/material';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LeftsidebarComponent} from './component/left-sidebar/leftsidebar/leftsidebar.component';
import {AuthService} from './auth-service/authService';
import {DashboardComponent} from './component/protect-component/AdviserComponent/dashboard/dashboard.component';
import {SubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/subscription.component';
import {DashboardSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/dashboard-subscription/dashboard-subscription.component';
import {ClientSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/client-subscription/client-subscription.component';
import {SubscriptionsSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/subscriptions-subscription/subscriptions-subscription.component';
import {QuotationsSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/quotations-subscription/quotations-subscription.component';
import {InvoicesSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/invoices-subscription/invoices-subscription.component';
import {SettingsSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/settings-subscription.component';
import {PlansSettingsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/plans-settings/plans-settings.component';
import {ServicesSettingsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/services-settings/services-settings.component';
import {DocumentsSettingsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/documents-settings/documents-settings.component';
import {PreferencesSettingsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/settings-subscription/preferences-settings/preferences-settings.component';
import {UpperSliderComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/upper-slider/upper-slider.component';
import {OverviewComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/overview/overview.component';
import {ServicesComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/services/services.component';
import {DocumentComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/document/document.component';
import {FeeStructureComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/fee-structure/fee-structure.component';
import {PlansComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/plans/plans.component';
import {ModulesComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/modules/modules.component';
import {AddStructureComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/add-structure/add-structure.component';
import {MutualFundsComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/mutual-funds.component';
import {LifeInsuranceComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/life-insurance/life-insurance.component';
import {GeneralInsuranceComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/general-insurance/general-insurance.component';
import {AumComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/aum.component';
import {SipComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip.component';
import {FoliosComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/folios/folios.component';
import {AssetAllocationComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/asset-allocation/asset-allocation.component';
import {FillterSearchComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/fillter-search/fillter-search.component';
import {CategoryWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/category-wise/category-wise.component';
import {AmcWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/amc-wise/amc-wise.component';
import {ClientWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/client-wise/client-wise.component';
import {ApplicantWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/aum/applicant-wise/applicant-wise.component';
import {MisComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mis/mis.component';
import {HttpService} from './http-service/http-service';
import {DocumentsSubscriptionsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/documents-subscriptions/documents-subscriptions.component';

import {SipAmcWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-amc-wise/sip-amc-wise.component';
import {SipSchemeWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-scheme-wise/sip-scheme-wise.component';
import {SipClientWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-client-wise/sip-client-wise.component';
import {SipApplicantWiseComponent} from './component/protect-component/AdviserComponent/backOffice/MIS/mutual-funds/sip/sip-applicant-wise/sip-applicant-wise.component';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {InvoicePdfDocumentComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/invoices-subscription/invoice-pdf-document/invoice-pdf-document.component';
import {ClientsDashboardComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/dashboard-subscription/clients-dashboard/clients-dashboard.component';
import {QuotationsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/quotations/quotations.component';
import {InvoicesComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/invoices/invoices.component';
import {SettingsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/settings/settings.component';
import {SubscriptionsUpperSliderComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/subscriptions-upper-slider/subscriptions-upper-slider.component';
import {HelpComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/help/help.component';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';

import {InvoiceComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/invoice/invoice.component';
import {LoginComponent} from './component/no-protected/login/login.component';
import {SubscriptionCompletenessComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/dashboard-subscription/subscription-completeness/subscription-completeness.component';
import {ConfirmDialogComponent} from './component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {ModifyFeeStructureComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/modify-fee-structure/modify-fee-structure.component';
import {TermsAgreementComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/terms-agreement/terms-agreement.component';
import {InvoiceHistoryComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/invoice-history/invoice-history.component';
import {BillerProfileAdvisorComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/biller-profile-advisor/biller-profile-advisor.component';
import {SubscriptionPopupComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/subscription-popup/subscription-popup.component';
import {DeleteSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/delete-subscription/delete-subscription.component';
import {BillerSettingsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/biller-settings/biller-settings.component';
import {PlanRightsliderComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/plan-rightslider/plan-rightslider.component';
import {EmailQuotationComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/email-quotation/email-quotation.component';
import {PayeeSettingsComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/payee-settings/payee-settings.component';
import {DialogComponent} from './component/dialog/dialog.component';
import {AddVariableFeeComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/add-variable-fee/add-variable-fee.component';
import {AddFixedFeeComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/add-fixed-fee/add-fixed-fee.component';
import {OverviewBlankQuotationComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/overview-blank-quotation/overview-blank-quotation.component';
import {CreateSubscriptionComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/create-subscription/create-subscription.component';
import {HowToUseDialogComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/how-to-use-dialog/how-to-use-dialog.component';
import {AddDocumentComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/add-document/add-document.component';
import {ModifyFeeDialogComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/modify-fee-dialog/modify-fee-dialog.component';
import {PreferenceEmailInvoiceComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/preference-email-invoice/preference-email-invoice.component';
import {ConsentTandCComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/consent-tand-c/consent-tand-c.component';
import {CommonFroalaComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/common-froala/common-froala.component';
import {ChangePayeeComponent} from './component/change-payee/change-payee.component';
import {CustomHtmlComponent} from './common/customhtml/customhtml/custom-html.component';
import {CustomerComponent} from './component/protect-component/customers/component/customer/customer.component';
import {AccountsComponent} from './component/protect-component/customers/component/customer/accounts/accounts.component';
import {SummaryComponent} from './component/protect-component/customers/component/customer/accounts/summary/summary.component';
import {CustomFormInputComponent} from './common/custom-form-input/custom-form-input.component';
import {AssetsComponent} from './component/protect-component/customers/component/customer/accounts/assets/assets.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FroalaComponent} from './component/protect-component/common-component/froala/froala.component';
import {EmailOnlyComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/email-only/email-only.component';
import {HowItWorksComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/how-it-works/how-it-works.component';
import {DialogContainerComponent} from './common/dialog-container/dialog-container.component';
import {LiabilitiesComponent} from './component/protect-component/customers/component/customer/accounts/liabilities/liabilities.component';
import {InsuranceComponent} from './component/protect-component/customers/component/customer/accounts/insurance/insurance.component';
import {ExpensesComponent} from './component/protect-component/customers/component/customer/accounts/expenses/expenses.component';
import {AddProfileSummaryComponent} from './component/protect-component/customers/component/common-component/add-profile-summary/add-profile-summary.component';
import {CustomDialogContainerComponent} from './common/custom-dialog-container/custom-dialog-container.component';
import {BaseComponent} from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/base/base.component';
import {ChartModule} from 'angular-highcharts';
import { IncomeComponent } from './component/protect-component/customers/component/customer/accounts/income/income.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RadioGroupDirectiveDirective } from './common/radio-group-directive.directive';
import { SingleDocumentViewComponent } from './component/protect-component/AdviserComponent/Subscriptions/subscription/common-subscription-component/single-document-view/single-document-view.component';

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
    SipAmcWiseComponent,
    SipSchemeWiseComponent,
    SipClientWiseComponent,
    SipApplicantWiseComponent,
    InvoicePdfDocumentComponent,
    ClientsDashboardComponent,
    QuotationsComponent,
    InvoicesComponent,
    SettingsComponent,
    SubscriptionsUpperSliderComponent,
    HelpComponent,
    InvoiceComponent,
    LoginComponent,
    SubscriptionCompletenessComponent,
    ConfirmDialogComponent,

    ModifyFeeStructureComponent,
    TermsAgreementComponent,
    InvoiceHistoryComponent,
    BillerProfileAdvisorComponent,
    SubscriptionPopupComponent,
    DeleteSubscriptionComponent,
    BillerSettingsComponent,
    PlanRightsliderComponent,
    EmailQuotationComponent,
    PayeeSettingsComponent,
    DialogComponent,
    CreateSubscriptionComponent,
    AddVariableFeeComponent,
    AddFixedFeeComponent,
    OverviewBlankQuotationComponent,
    HowToUseDialogComponent,
    AddDocumentComponent,
    ModifyFeeDialogComponent,
    PreferenceEmailInvoiceComponent,
    CustomHtmlComponent,
    ConsentTandCComponent,
    CommonFroalaComponent,
    CustomerComponent,
    AccountsComponent,
    SummaryComponent,
    ChangePayeeComponent,
    CustomFormInputComponent,
    AssetsComponent,
    FroalaComponent,
    EmailOnlyComponent,
    HowItWorksComponent,
    DialogContainerComponent,
    LiabilitiesComponent,
    InsuranceComponent,
    ExpensesComponent,
    AddProfileSummaryComponent,
    CustomDialogContainerComponent,
    BaseComponent,
    IncomeComponent,
    RadioGroupDirectiveDirective,
    SingleDocumentViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // CommonSubscriptionComponent,
    SlimLoadingBarModule.forRoot(),
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    MDBBootstrapModule.forRoot(), DragDropModule, ChartModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 1000
    })
  ],
  providers: [AuthService, HttpService],
  bootstrap: [AppComponent],
  entryComponents: [UpperSliderComponent,
    ConfirmDialogComponent, SubscriptionPopupComponent,
    DeleteSubscriptionComponent, HowToUseDialogComponent,
    AddDocumentComponent, PreferenceEmailInvoiceComponent,
    ModifyFeeDialogComponent, ConsentTandCComponent , HowItWorksComponent]
})
export class AppModule {
}
