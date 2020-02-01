import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdviceActivityRoutingModule } from './advice-activity-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdviceActivityComponent } from './advice-activity.component';
import { AdviceFixedIncomeComponent } from './advice-fixed-income/advice-fixed-income.component';
import { AdviceRealAssetComponent } from './advice-real-asset/advice-real-asset.component';
import { AdviceAllPortfolioComponent } from './advice-all-portfolio/advice-all-portfolio.component';
import { AdviceRetirementAccountComponent } from './advice-retirement-account/advice-retirement-account.component';
import { AdviceSmallSavingSchemeComponent } from './advice-small-saving-scheme/advice-small-saving-scheme.component';
import { AdviceCommoditiesComponent } from './advice-commodities/advice-commodities.component';
import { AdviceCashAndHandComponent } from './advice-cash-and-hand/advice-cash-and-hand.component';
import { AdviceLibilitiesComponent } from './advice-libilities/advice-libilities.component';
import { AdviceLifeInsuranceComponent } from './advice-life-insurance/advice-life-insurance.component';
import { AdviceGeneralInsuranceComponent } from './advice-general-insurance/advice-general-insurance.component';
import { AdviceMutualFundComponent } from './advice-mutual-fund/advice-mutual-fund.component';
import { AdviceAssetsComponent } from './advice-assets/advice-assets.component';
import { AdviceStocksComponent } from './advice-stocks/advice-stocks.component';
import { AllAdviceFixedDepositComponent } from './advice-fixed-income/all-advice-fixed-deposit/all-advice-fixed-deposit.component';
import { AllAdviceRealAssetComponent } from './advice-real-asset/all-advice-real-asset/all-advice-real-asset.component';
import { AllRetrirementAssetComponent } from './advice-retirement-account/all-retrirement-asset/all-retrirement-asset.component';
import { AllAdviceSmallSavingsSchemeComponent } from './advice-small-saving-scheme/all-advice-small-savings-scheme/all-advice-small-savings-scheme.component';
import { AllAdviceCashAndHandComponent } from './advice-cash-and-hand/all-advice-cash-and-hand/all-advice-cash-and-hand.component';
import { AllAdviceCommoditiesComponent } from './advice-commodities/all-advice-commodities/all-advice-commodities.component';


@NgModule({
  declarations: [AdviceActivityComponent, AdviceFixedIncomeComponent, AdviceRealAssetComponent, AdviceAllPortfolioComponent, AdviceRetirementAccountComponent, AdviceSmallSavingSchemeComponent, AdviceCommoditiesComponent, AdviceCashAndHandComponent, AdviceLibilitiesComponent, AdviceLifeInsuranceComponent, AdviceGeneralInsuranceComponent, AdviceMutualFundComponent, AdviceAssetsComponent, AdviceStocksComponent, AllAdviceFixedDepositComponent, AllAdviceRealAssetComponent, AllRetrirementAssetComponent, AllAdviceSmallSavingsSchemeComponent, AllAdviceCashAndHandComponent, AllAdviceCommoditiesComponent],
  imports: [
    CommonModule,
    AdviceActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule]
})
export class AdviceActivityModule { }
