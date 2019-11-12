import {NgModule} from '@angular/core';
import {MaterialModule} from '../../../../material/material';
import {InvoiceHistoryComponent} from './subscription/common-subscription-component/invoice-history/invoice-history.component';
import {BillerSettingsComponent} from './subscription/common-subscription-component/biller-settings/biller-settings.component';
import {SubscriptionPopupComponent} from './subscription/common-subscription-component/subscription-popup/subscription-popup.component';
import {EmailQuotationComponent} from './subscription/common-subscription-component/email-quotation/email-quotation.component';
import {AddEditDocumentComponent} from './subscription/common-subscription-component/add-edit-document/add-edit-document.component';
import {PreferenceEmailInvoiceComponent} from './subscription/common-subscription-component/preference-email-invoice/preference-email-invoice.component';
import {HowItWorksComponent} from './subscription/common-subscription-component/how-it-works/how-it-works.component';
import {EmailOnlyComponent} from './subscription/common-subscription-component/email-only/email-only.component';
import {CommonFroalaComponent} from './subscription/common-subscription-component/common-froala/common-froala.component';
import {ConsentTandCComponent} from './subscription/common-subscription-component/consent-tand-c/consent-tand-c.component';
import {ModifyFeeDialogComponent} from './subscription/common-subscription-component/modify-fee-dialog/modify-fee-dialog.component';
import {AddDocumentComponent} from './subscription/common-subscription-component/add-document/add-document.component';
import {HowToUseDialogComponent} from './subscription/common-subscription-component/how-to-use-dialog/how-to-use-dialog.component';
import {AddFixedFeeComponent} from './subscription/common-subscription-component/add-fixed-fee/add-fixed-fee.component';
import {DeleteSubscriptionComponent} from './subscription/common-subscription-component/delete-subscription/delete-subscription.component';
import {PayeeSettingsComponent} from './subscription/common-subscription-component/payee-settings/payee-settings.component';
import {AddVariableFeeComponent} from './subscription/common-subscription-component/add-variable-fee/add-variable-fee.component';
import {CreateSubscriptionComponent} from './subscription/common-subscription-component/create-subscription/create-subscription.component';
import {PlanRightsliderComponent} from './subscription/common-subscription-component/plan-rightslider/plan-rightslider.component';
import {BillerProfileAdvisorComponent} from './subscription/common-subscription-component/biller-profile-advisor/biller-profile-advisor.component';
import {TermsAgreementComponent} from './subscription/common-subscription-component/terms-agreement/terms-agreement.component';
import {ModifyFeeStructureComponent} from './subscription/common-subscription-component/modify-fee-structure/modify-fee-structure.component';
import {SubscriptionCompletenessComponent} from './subscription/dashboard-subscription/subscription-completeness/subscription-completeness.component';
import {AddStructureComponent} from './subscription/common-subscription-component/add-structure/add-structure.component';
import {ModulesComponent} from './subscription/common-subscription-component/modules/modules.component';
import {PlansComponent} from './subscription/common-subscription-component/plans/plans.component';
import {InvoicePdfDocumentComponent} from './subscription/invoices-subscription/invoice-pdf-document/invoice-pdf-document.component';
import {ClientUpperSubscriptionComponent} from './subscription/common-subscription-component/subscriptions-upper-slider/client-upper-subscription.component';
import {DashboardSubscriptionComponent} from './subscription/dashboard-subscription/dashboard-subscription.component';
import {SubscriptionsSubscriptionComponent} from './subscription/subscriptions-subscription/subscriptions-subscription.component';
import {ClientSubscriptionComponent} from './subscription/client-subscription/client-subscription.component';
import {SubscriptionComponent} from './subscription/subscription.component';
import {DocumentsSubscriptionsComponent} from './subscription/documents-subscriptions/documents-subscriptions.component';
import {InvoiceComponent} from './subscription/common-subscription-component/invoice/invoice.component';
import {HelpComponent} from './subscription/common-subscription-component/help/help.component';
import {SettingsComponent} from './subscription/common-subscription-component/settings/settings.component';
import {InvoicesComponent} from './subscription/common-subscription-component/invoices/invoices.component';
import {QuotationsComponent} from './subscription/common-subscription-component/quotations/quotations.component';
import {ClientsDashboardComponent} from './subscription/dashboard-subscription/clients-dashboard/clients-dashboard.component';
import {QuotationsSubscriptionComponent} from './subscription/quotations-subscription/quotations-subscription.component';
import {ServicesSettingsComponent} from './subscription/settings-subscription/services-settings/services-settings.component';
import {InvoicesSubscriptionComponent} from './subscription/invoices-subscription/invoices-subscription.component';
import {DocumentsSettingsComponent} from './subscription/settings-subscription/documents-settings/documents-settings.component';
import {ServicesComponent} from './subscription/common-subscription-component/services/services.component';
import {FeeStructureComponent} from './subscription/common-subscription-component/fee-structure/fee-structure.component';
import {DocumentComponent} from './subscription/common-subscription-component/document/document.component';
import {OverviewComponent} from './subscription/common-subscription-component/overview/overview.component';
import {PreferencesSettingsComponent} from './subscription/settings-subscription/preferences-settings/preferences-settings.component';
import {SubscriptionUpperSliderComponent} from './subscription/common-subscription-component/upper-slider/subscription-upper-slider.component';
import {PlansSettingsComponent} from './subscription/settings-subscription/plans-settings/plans-settings.component';
import {SettingsSubscriptionComponent} from './subscription/settings-subscription/settings-subscription.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {ChartModule} from 'angular-highcharts';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {SingleDocumentViewComponent} from './subscription/common-subscription-component/single-document-view/single-document-view.component';
import {CustomCommonModule} from '../../../../common/custom.common.module';
import {CustomDialogContainerComponent} from '../../../../common/custom-dialog-container/custom-dialog-container.component';
import {FixedFeeComponent} from './subscription/common-subscription-component/fixed-fee/fixed-fee.component';
import {VariableFeeComponent} from './subscription/common-subscription-component/variable-fee/variable-fee.component';
import {ChangePayeeComponent} from './subscription/common-subscription-component/change-payee/change-payee.component';
import {CustomHtmlModule} from '../../../../common/customhtml/customhtml/custom-html.module';
import {CommonComponentModule} from '../../common-component/common-component.module';
import {CustomDirectiveModule} from '../../../../common/directives/common-directive.module';
import {CommonModule} from '@angular/common';
import {SubscriptionRoutingModule} from "./subscription-routing.module";

export const componentList = [SubscriptionComponent,
  InvoicePdfDocumentComponent,
  ClientsDashboardComponent,
  QuotationsComponent,
  InvoicesComponent,
  SettingsComponent,
  ClientUpperSubscriptionComponent,
  HelpComponent,
  InvoiceComponent,
  DocumentsSubscriptionsComponent,
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
  SubscriptionUpperSliderComponent,
  OverviewComponent,
  ServicesComponent,
  DocumentComponent,
  FeeStructureComponent,
  PlansComponent,
  ModulesComponent,
  AddStructureComponent,
  SubscriptionCompletenessComponent,
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
  CreateSubscriptionComponent,
  AddVariableFeeComponent,
  AddFixedFeeComponent,
  AddEditDocumentComponent,
  HowToUseDialogComponent,
  AddDocumentComponent,
  ModifyFeeDialogComponent,
  PreferenceEmailInvoiceComponent,
  ConsentTandCComponent,
  CommonFroalaComponent,
  EmailOnlyComponent,
  SingleDocumentViewComponent,
  CustomDialogContainerComponent,
  FixedFeeComponent,
  VariableFeeComponent,
  ChangePayeeComponent,
  HowItWorksComponent];

@NgModule({
  declarations: componentList,
  imports: [
    MaterialModule,
    CommonModule,
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 1000
    }),
    ChartModule, SatDatepickerModule, SatNativeDateModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    CustomHtmlModule,
    CommonComponentModule,
    CustomDirectiveModule,
    // SubscriptionRoutingModule
    // CustomCommonModule
    // AppModule
  ],
  exports: componentList,
  entryComponents: [
    DeleteSubscriptionComponent
    /*SubscriptionPopupComponent,
    , UpperSliderComponent,
    DeleteSubscriptionComponent, HowToUseDialogComponent,
    AddDocumentComponent, PreferenceEmailInvoiceComponent,
    ModifyFeeDialogComponent, ConsentTandCComponent, HowItWorksComponent*/]
})
export class SubscriptionModule {
}
