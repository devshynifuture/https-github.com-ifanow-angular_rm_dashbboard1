import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UpperCustomerComponent} from '../../common-component/upper-customer/upper-customer.component';
import {AccountCommonModule} from './account.common.module';
import {AccountUpperSliderModule} from './account-upper-slider.module';
import {MaterialModule} from '../../../../../../material/material';
import { StockScripLevelHoldingComponent } from './assets/asset-stocks/stock-scrip-level-holding/stock-scrip-level-holding.component';
import { AddAssetStocksComponent } from './assets/asset-stocks/add-asset-stocks/add-asset-stocks.component';
export const componentList = [
  UpperCustomerComponent,
  AddAssetStocksComponent,
  StockScripLevelHoldingComponent
];

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    AccountCommonModule,
    AccountUpperSliderModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule, componentList],
  entryComponents: [componentList]
})

export class AccountEntryModule {

  static getComponentList() {
    return componentList;
  }
}
