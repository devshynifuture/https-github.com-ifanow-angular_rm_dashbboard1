import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VariableFeeComponent } from './subscription/common-subscription-component/variable-fee/variable-fee.component';
import { FixedFeeComponent } from './subscription/common-subscription-component/fixed-fee/fixed-fee.component';
import { CreateSubscriptionComponent } from './subscription/common-subscription-component/create-subscription/create-subscription.component';
import { BillerSettingsComponent } from './subscription/common-subscription-component/biller-settings/biller-settings.component';
import { ChangePayeeComponent } from './subscription/common-subscription-component/change-payee/change-payee.component';
import { InvoiceHistoryComponent } from './subscription/common-subscription-component/invoice-history/invoice-history.component';
import { CommonFroalaComponent } from './subscription/common-subscription-component/common-froala/common-froala.component';
import { BillerProfileAdvisorComponent } from './subscription/common-subscription-component/biller-profile-advisor/biller-profile-advisor.component';
import { HelpComponent } from './subscription/common-subscription-component/help/help.component';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { SubscriptionUpperSliderComponent } from './subscription/common-subscription-component/upper-slider/subscription-upper-slider.component';
import { ClientUpperSubscriptionComponent } from './subscription/common-subscription-component/subscriptions-upper-slider/client-upper-subscription.component';
import { SubscriptionUpperEntry } from './subscription-upper-entry-module';

export const componentList = [
    // VariableFeeComponent,
    // FixedFeeComponent,
    // CreateSubscriptionComponent,
    // BillerSettingsComponent,
    // ChangePayeeComponent,
    InvoiceHistoryComponent,
    // CommonFroalaComponent,
    BillerProfileAdvisorComponent,
    HelpComponent,
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
        SubscriptionUpperEntry
    ],
    exports: [componentList],
    entryComponents: [componentList]
})

export class SubscriptionEntry {

    static getComponentList() {
        return componentList;
    }
}