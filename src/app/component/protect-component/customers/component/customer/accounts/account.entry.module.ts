import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpperCustomerComponent } from '../../common-component/upper-customer/upper-customer.component';
import { AccountCommonModule } from './account.common.module';
import { AccountUpperSliderModule } from './account-upper-slider.module';
import { MaterialModule } from '../../../../../../material/material';
import { StockScripLevelHoldingComponent } from './assets/asset-stocks/stock-scrip-level-holding/stock-scrip-level-holding.component';
import { AddAssetStocksComponent } from './assets/asset-stocks/add-asset-stocks/add-asset-stocks.component';
import { AddPortfolioComponent } from './assets/asset-stocks/add-portfolio/add-portfolio.component';
import { AddScripComponent } from './assets/asset-stocks/add-scrip/add-scrip.component';
import { StockScripLevelTransactionComponent } from './assets/asset-stocks/stock-scrip-level-transaction/stock-scrip-level-transaction.component';
import { PortfolioFieldComponent } from './assets/asset-stocks/portfolio-field/portfolio-field.component';
import { ScripFieldComponent } from './assets/asset-stocks/scrip-field/scrip-field.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StockDetailsViewComponent } from './assets/stock-details-view/stock-details-view.component';
import { StockHoldingDetailsComponent } from './assets/asset-stocks/stock-holding-details/stock-holding-details.component';
import { StockTransactionDetailsComponent } from './assets/asset-stocks/stock-transaction-details/stock-transaction-details.component';
export const componentList = [
  UpperCustomerComponent,
  AddAssetStocksComponent,
  StockScripLevelHoldingComponent,
  AddPortfolioComponent,
  AddScripComponent,
  StockScripLevelTransactionComponent,
  PortfolioFieldComponent,
  ScripFieldComponent,
  StockDetailsViewComponent,
  StockHoldingDetailsComponent,
  StockTransactionDetailsComponent
];

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    AccountCommonModule,
    AccountUpperSliderModule,
    CustomCommonModule,
    MatProgressBarModule,
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
