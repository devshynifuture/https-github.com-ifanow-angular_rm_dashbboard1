import {NgModule} from '@angular/core';
import {AddLiabilitiesComponent} from './component/protect-component/customers/component/common-component/add-liabilities/add-liabilities.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material/material';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwnerComponentModule} from './component/protect-component/customers/component/customer/accounts/owner-component/owner-component.module';
import {AddInsuranceComponent} from './component/protect-component/customers/component/common-component/add-insurance/add-insurance.component';

export const componentList = [AddLiabilitiesComponent, AddInsuranceComponent];

@NgModule({
  declarations: componentList,
  imports: [CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    OwnerComponentModule],
  exports: [],
  entryComponents: [componentList]
})

export class EntryComponentsModule {

  static getComponentList() {
    return componentList;
  }
}
