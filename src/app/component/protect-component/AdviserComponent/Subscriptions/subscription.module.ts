import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../../material/material';
import { SubscriptionPopupComponent } from './subscription/common-subscription-component/subscription-popup/subscription-popup.component';
import { EmailQuotationComponent } from './subscription/common-subscription-component/email-quotation/email-quotation.component';
import { AddEditDocumentComponent } from './subscription/common-subscription-component/add-edit-document/add-edit-document.component';
import { PreferenceEmailInvoiceComponent } from './subscription/common-subscription-component/preference-email-invoice/preference-email-invoice.component';
import { HowItWorksComponent } from './subscription/common-subscription-component/how-it-works/how-it-works.component';
import { EmailOnlyComponent } from './subscription/common-subscription-component/email-only/email-only.component';
import { ConsentTandCComponent } from './subscription/common-subscription-component/consent-tand-c/consent-tand-c.component';
import { ModifyFeeDialogComponent } from './subscription/common-subscription-component/modify-fee-dialog/modify-fee-dialog.component';
import { AddDocumentComponent } from './subscription/common-subscription-component/add-document/add-document.component';
import { HowToUseDialogComponent } from './subscription/common-subscription-component/how-to-use-dialog/how-to-use-dialog.component';
import { AddFixedFeeComponent } from './subscription/common-subscription-component/add-fixed-fee/add-fixed-fee.component';
import { DeleteSubscriptionComponent } from './subscription/common-subscription-component/delete-subscription/delete-subscription.component';
import { PayeeSettingsComponent } from './subscription/common-subscription-component/payee-settings/payee-settings.component';
import { PlanRightsliderComponent } from './subscription/common-subscription-component/plan-rightslider/plan-rightslider.component';
import { TermsAgreementComponent } from './subscription/common-subscription-component/terms-agreement/terms-agreement.component';
import { SubscriptionCompletenessComponent } from './subscription/dashboard-subscription/subscription-completeness/subscription-completeness.component';
import { AddStructureComponent } from './subscription/common-subscription-component/add-structure/add-structure.component';
import { ModulesComponent } from './subscription/common-subscription-component/modules/modules.component';
import { PlansComponent } from './subscription/common-subscription-component/plans/plans.component';
import { InvoicePdfDocumentComponent } from './subscription/invoices-subscription/invoice-pdf-document/invoice-pdf-document.component';
import { ClientUpperSubscriptionComponent } from './subscription/common-subscription-component/subscriptions-upper-slider/client-upper-subscription.component';
import { DashboardSubscriptionComponent } from './subscription/dashboard-subscription/dashboard-subscription.component';
import { SubscriptionsSubscriptionComponent } from './subscription/subscriptions-subscription/subscriptions-subscription.component';
import { ClientSubscriptionComponent } from './subscription/client-subscription/client-subscription.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { DocumentsSubscriptionsComponent } from './subscription/documents-subscriptions/documents-subscriptions.component';
import { InvoiceComponent } from './subscription/common-subscription-component/invoice/invoice.component';
import { SettingsComponent } from './subscription/common-subscription-component/settings/settings.component';
import { InvoicesComponent } from './subscription/common-subscription-component/invoices/invoices.component';
import { QuotationsComponent } from './subscription/common-subscription-component/quotations/quotations.component';
import { ClientsDashboardComponent } from './subscription/dashboard-subscription/clients-dashboard/clients-dashboard.component';
import { QuotationsSubscriptionComponent } from './subscription/quotations-subscription/quotations-subscription.component';
import { ServicesSettingsComponent } from './subscription/settings-subscription/services-settings/services-settings.component';
import { InvoicesSubscriptionComponent } from './subscription/invoices-subscription/invoices-subscription.component';
import { DocumentsSettingsComponent } from './subscription/settings-subscription/documents-settings/documents-settings.component';
import { ServicesComponent } from './subscription/common-subscription-component/services/services.component';
import { FeeStructureComponent } from './subscription/common-subscription-component/fee-structure/fee-structure.component';
import { DocumentComponent } from './subscription/common-subscription-component/document/document.component';
import { OverviewComponent } from './subscription/common-subscription-component/overview/overview.component';
import { PreferencesSettingsComponent } from './subscription/settings-subscription/preferences-settings/preferences-settings.component';
import { SubscriptionUpperSliderComponent } from './subscription/common-subscription-component/upper-slider/subscription-upper-slider.component';
import { PlansSettingsComponent } from './subscription/settings-subscription/plans-settings/plans-settings.component';
import { SettingsSubscriptionComponent } from './subscription/settings-subscription/settings-subscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartModule } from 'angular-highcharts';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SingleDocumentViewComponent } from './subscription/common-subscription-component/single-document-view/single-document-view.component';
import { CustomDialogContainerComponent } from '../../../../common/custom-dialog-container/custom-dialog-container.component';
import { CustomHtmlModule } from '../../../../common/customhtml/customhtml/custom-html.module';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { CustomDirectiveModule } from '../../../../common/directives/common-directive.module';
import { CommonModule } from '@angular/common';
import { AddQuotationComponent } from './subscription/common-subscription-component/add-quotation/add-quotation.component';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionEntry } from './subscription.entry.module';

export const componentList = [SubscriptionComponent,
  InvoicePdfDocumentComponent,
  ClientsDashboardComponent,
  QuotationsComponent,
  InvoicesComponent,
  SettingsComponent,
  ClientUpperSubscriptionComponent,
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
  TermsAgreementComponent,
  SubscriptionPopupComponent,
  DeleteSubscriptionComponent,
  PlanRightsliderComponent,
  EmailQuotationComponent,
  PayeeSettingsComponent,
  AddFixedFeeComponent,
  AddEditDocumentComponent,
  HowToUseDialogComponent,
  AddDocumentComponent,
  ModifyFeeDialogComponent,
  PreferenceEmailInvoiceComponent,
  ConsentTandCComponent,
  EmailOnlyComponent,
  SingleDocumentViewComponent,
  CustomDialogContainerComponent,
  HowItWorksComponent,
  AddQuotationComponent
];

@NgModule({
  declarations: componentList,
  imports: [
    // BrowserAnimationsModule,
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
    SubscriptionRoutingModule,
    SubscriptionEntry
    // CustomCommonModule
    // AppModule
  ],
  exports: componentList,
  entryComponents: [
    DeleteSubscriptionComponent,
    SubscriptionPopupComponent,
    DeleteSubscriptionComponent, HowToUseDialogComponent,
    AddDocumentComponent, PreferenceEmailInvoiceComponent,
    ModifyFeeDialogComponent, ConsentTandCComponent, HowItWorksComponent, AddDocumentComponent, AddQuotationComponent]
})
export class SubscriptionModule {
}
