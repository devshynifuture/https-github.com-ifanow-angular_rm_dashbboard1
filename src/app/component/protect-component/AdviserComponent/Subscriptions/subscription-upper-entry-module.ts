import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { MaterialModule } from '../../../../material/material';
import { OverviewComponent } from './subscription/common-subscription-component/overview/overview.component';
import { ServicesComponent } from './subscription/common-subscription-component/services/services.component';
import { DocumentComponent } from './subscription/common-subscription-component/document/document.component';
import { SubscriptionUpperSliderComponent } from './subscription/common-subscription-component/upper-slider/subscription-upper-slider.component';
import { TermsAgreementComponent } from './subscription/common-subscription-component/terms-agreement/terms-agreement.component';
import { CustomHtmlComponent } from 'src/app/common/customhtml/customhtml/custom-html.component';
import { EmailOnlyComponent } from './subscription/common-subscription-component/email-only/email-only.component';
import { FeeStructureComponent } from './subscription/common-subscription-component/fee-structure/fee-structure.component';
import { PlansComponent } from './subscription/common-subscription-component/plans/plans.component';
import { ModulesComponent } from './subscription/common-subscription-component/modules/modules.component';
import { ClientUpperSubscriptionComponent } from './subscription/common-subscription-component/subscriptions-upper-slider/client-upper-subscription.component';
import { QuotationsComponent } from './subscription/common-subscription-component/quotations/quotations.component';
import { InvoicesComponent } from './subscription/common-subscription-component/invoices/invoices.component';
import { SettingsComponent } from './subscription/common-subscription-component/settings/settings.component';
import { CustomDialogContainerComponent } from 'src/app/common/custom-dialog-container/custom-dialog-container.component';
import { AddStructureComponent } from './subscription/common-subscription-component/add-structure/add-structure.component';
import { PlanRightsliderComponent } from './subscription/common-subscription-component/plan-rightslider/plan-rightslider.component';
import { EmailQuotationComponent } from './subscription/common-subscription-component/email-quotation/email-quotation.component';
import { InvoiceComponent } from './subscription/common-subscription-component/invoice/invoice.component';
import { PayeeSettingsComponent } from './subscription/common-subscription-component/payee-settings/payee-settings.component';
import { CreateSubscriptionComponent } from './subscription/common-subscription-component/create-subscription/create-subscription.component';
import { FixedFeeComponent } from './subscription/common-subscription-component/fixed-fee/fixed-fee.component';
import { AddFixedFeeComponent } from './subscription/common-subscription-component/add-fixed-fee/add-fixed-fee.component';
import { AddEditDocumentComponent } from './subscription/common-subscription-component/add-edit-document/add-edit-document.component';
import { BillerSettingsComponent } from './subscription/common-subscription-component/biller-settings/biller-settings.component';
import { VariableFeeComponent } from './subscription/common-subscription-component/variable-fee/variable-fee.component';
import { ChangePayeeComponent } from './subscription/common-subscription-component/change-payee/change-payee.component';
import { CommonFroalaComponent } from './subscription/common-subscription-component/common-froala/common-froala.component';
import { CustomHtmlModule } from 'src/app/common/customhtml/customhtml/custom-html.module';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AddVariableFeeComponent } from './subscription/common-subscription-component/add-variable-fee/add-variable-fee.component';
import { SubscriptionPopupComponent } from './subscription/common-subscription-component/subscription-popup/subscription-popup.component';
import { AddDocumentComponent } from './subscription/common-subscription-component/add-document/add-document.component';

export const componentList = [
    OverviewComponent,
    ServicesComponent,
    DocumentComponent,
    SubscriptionUpperSliderComponent,
    TermsAgreementComponent,
    EmailOnlyComponent,
    FeeStructureComponent,
    PlansComponent,
    ModulesComponent,
    QuotationsComponent,
    InvoicesComponent,
    SettingsComponent,
    CustomDialogContainerComponent,
    AddStructureComponent,
    PlanRightsliderComponent,
    EmailQuotationComponent,
    InvoiceComponent,
    PayeeSettingsComponent,
    ClientUpperSubscriptionComponent,
    CreateSubscriptionComponent,
    AddFixedFeeComponent,
    AddEditDocumentComponent,
    BillerSettingsComponent,
    FixedFeeComponent,
    VariableFeeComponent,
    ChangePayeeComponent,
    CommonFroalaComponent,
    EmailOnlyComponent,
    AddVariableFeeComponent,
    SubscriptionPopupComponent,
    AddDocumentComponent,
]
@NgModule({
    declarations: componentList,
    imports: [
        CommonModule,
        MaterialModule,
        ChartModule,
        FormsModule,
        ReactiveFormsModule,
        CommonComponentModule,
        CustomHtmlModule,
        CustomDirectiveModule
    ],
    exports: [componentList],
    entryComponents: [componentList,SubscriptionPopupComponent,AddDocumentComponent]
})

export class SubscriptionUpperEntry {

    static getComponentList() {
        return componentList;
    }
}