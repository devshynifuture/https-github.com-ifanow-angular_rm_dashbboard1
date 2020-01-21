import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ChartModule } from 'angular-highcharts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { CustomHtmlModule } from '../../../../common/customhtml/customhtml/custom-html.module';
import { CustomDirectiveModule } from '../../../../common/directives/common-directive.module';
import { MaterialModule } from '../../../../material/material';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionUpperEntry } from './subscription-upper-entry-module';
import { SubscriptionEntry } from './subscription.entry.module';
import { ClientSubscriptionComponent } from './subscription/client-subscription/client-subscription.component';
import { AddQuotationComponent } from './subscription/common-subscription-component/add-quotation/add-quotation.component';
import { ConsentTandCComponent } from './subscription/common-subscription-component/consent-tand-c/consent-tand-c.component';
import { HowItWorksComponent } from './subscription/common-subscription-component/how-it-works/how-it-works.component';
import { HowToUseDialogComponent } from './subscription/common-subscription-component/how-to-use-dialog/how-to-use-dialog.component';
import { ModifyFeeDialogComponent } from './subscription/common-subscription-component/modify-fee-dialog/modify-fee-dialog.component';
import { PreferenceEmailInvoiceComponent } from './subscription/common-subscription-component/preference-email-invoice/preference-email-invoice.component';
import { SingleDocumentViewComponent } from './subscription/common-subscription-component/single-document-view/single-document-view.component';
import { ClientsDashboardComponent } from './subscription/dashboard-subscription/clients-dashboard/clients-dashboard.component';
import { DashboardSubscriptionComponent } from './subscription/dashboard-subscription/dashboard-subscription.component';
import { SubscriptionCompletenessComponent } from './subscription/dashboard-subscription/subscription-completeness/subscription-completeness.component';
import { DocumentsSubscriptionsComponent } from './subscription/documents-subscriptions/documents-subscriptions.component';
import { InvoicePdfDocumentComponent } from './subscription/invoices-subscription/invoice-pdf-document/invoice-pdf-document.component';
import { InvoicesSubscriptionComponent } from './subscription/invoices-subscription/invoices-subscription.component';
import { QuotationsSubscriptionComponent } from './subscription/quotations-subscription/quotations-subscription.component';
import { DocumentsSettingsComponent } from './subscription/settings-subscription/documents-settings/documents-settings.component';
import { PlansSettingsComponent } from './subscription/settings-subscription/plans-settings/plans-settings.component';
import { PreferencesSettingsComponent } from './subscription/settings-subscription/preferences-settings/preferences-settings.component';
import { ServicesSettingsComponent } from './subscription/settings-subscription/services-settings/services-settings.component';
import { SettingsSubscriptionComponent } from './subscription/settings-subscription/settings-subscription.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscriptionsSubscriptionComponent } from './subscription/subscriptions-subscription/subscriptions-subscription.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { SudscriptionTableFilterComponent } from './subscription/common-subscription-component/sudscription-table-filter/sudscription-table-filter.component';
import { SetDateFooter } from './subscription/common-subscription-component/sudscription-table-filter/set-date-footer.component';


export const componentList = [SubscriptionComponent,
  InvoicePdfDocumentComponent,
  ClientsDashboardComponent,
  // QuotationsComponent,
  // InvoicesComponent,
  // SettingsComponent,
  // ClientUpperSubscriptionComponent,
  // InvoiceComponent,
  SetDateFooter,
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
  SudscriptionTableFilterComponent,
  // SubscriptionUpperSliderComponent,
  // OverviewComponent,
  // ServicesComponent,
  // DocumentComponent,
  // FeeStructureComponent,
  // PlansComponent,
  // ModulesComponent,
  // AddStructureComponent,
  SubscriptionCompletenessComponent,
  // TermsAgreementComponent,
  // PlanRightsliderComponent,
  // EmailQuotationComponent,
  // PayeeSettingsComponent,
  // AddFixedFeeComponent,
  // AddEditDocumentComponent,
  HowToUseDialogComponent,
  ModifyFeeDialogComponent,
  PreferenceEmailInvoiceComponent,
  ConsentTandCComponent,
  // EmailOnlyComponent,
  SingleDocumentViewComponent,
  // CustomDialogContainerComponent,
  HowItWorksComponent,
  AddQuotationComponent,
  //AddVariableFeeComponent
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
    SubscriptionEntry,
    SubscriptionUpperEntry,
    // CustomCommonModule
    // AppModule
  ],
  exports: componentList,
  entryComponents: [
    
    HowToUseDialogComponent,
    PreferenceEmailInvoiceComponent,
    ModifyFeeDialogComponent, ConsentTandCComponent, HowItWorksComponent, AddQuotationComponent, SetDateFooter],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class SubscriptionModule {
}
