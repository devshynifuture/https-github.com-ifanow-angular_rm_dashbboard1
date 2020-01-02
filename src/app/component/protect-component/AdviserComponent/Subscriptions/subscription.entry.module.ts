import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'src/app/material/material';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InvoiceHistoryComponent} from './subscription/common-subscription-component/invoice-history/invoice-history.component';
import {BillerProfileAdvisorComponent} from './subscription/common-subscription-component/biller-profile-advisor/biller-profile-advisor.component';
import {HelpComponent} from './subscription/common-subscription-component/help/help.component';
import {CommonComponentModule} from '../../common-component/common-component.module';
import {SubscriptionUpperEntry} from './subscription-upper-entry-module';
import {CustomDirectiveModule} from "../../../../common/directives/common-directive.module";

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
    CustomDirectiveModule,
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
