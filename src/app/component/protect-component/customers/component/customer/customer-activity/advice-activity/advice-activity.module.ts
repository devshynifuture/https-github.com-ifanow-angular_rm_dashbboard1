import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdviceActivityRoutingModule } from './advice-activity-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdviceActivityComponent } from './advice-activity.component';
import { AdviceFixedIncomeComponent } from './advice-fixed-income/advice-fixed-income.component';
import { AdviceRealAssetComponent } from './advice-real-estate/advice-real-estate.component';
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
import { AllAdviceRealAssetComponent } from './advice-real-estate/all-advice-real-estate/all-advice-real-estate.component';
import { AllRetirementAssetComponent } from './advice-retirement-account/all-retirement-asset/all-retirement-asset.component';
import { AllAdviceSmallSavingsSchemeComponent } from './advice-small-saving-scheme/all-advice-small-savings-scheme/all-advice-small-savings-scheme.component';
import { AllAdviceCashAndHandComponent } from './advice-cash-and-hand/all-advice-cash-and-hand/all-advice-cash-and-hand.component';
import { AllAdviceCommoditiesComponent } from './advice-commodities/all-advice-commodities/all-advice-commodities.component';
import { AllAdviceStocksComponent } from './advice-stocks/all-advice-stocks/all-advice-stocks.component';
import { AdviceActionComponent } from './advice-action/advice-action.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AllAdviceLifeInsuranceComponent } from './advice-life-insurance/all-advice-life-insurance/all-advice-life-insurance.component';
import { AllAdviceGeneralInsuranceComponent } from './advice-general-insurance/all-advice-general-insurance/all-advice-general-insurance.component';
import { CommonComponentModule } from 'src/app/component/protect-component/common-component/common-component.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
//import { MiscellaneousAdviceComponent } from './miscellaneous-advice/miscellaneous-advice.component';
//import { AdviceSIPComponent } from './advice-sip/advice-sip.component';
//import { EmailAdviceComponent } from './email-advice/email-advice.component';


@NgModule({
  declarations: [
    AdviceActivityComponent,
    AdviceFixedIncomeComponent,
    AdviceRealAssetComponent,
    AdviceAllPortfolioComponent,
    AdviceRetirementAccountComponent,
    AdviceSmallSavingSchemeComponent,
    AdviceCommoditiesComponent,
    AdviceCashAndHandComponent,
    AdviceLibilitiesComponent,
    AdviceLifeInsuranceComponent,
    AdviceGeneralInsuranceComponent,
    AdviceMutualFundComponent,
    AdviceAssetsComponent,
    AdviceStocksComponent,
    AllAdviceFixedDepositComponent,
    AllAdviceRealAssetComponent,
    AllRetirementAssetComponent,
    AllAdviceSmallSavingsSchemeComponent,
    AllAdviceCashAndHandComponent,
    AllAdviceCommoditiesComponent,
    AllAdviceStocksComponent,
    AdviceActionComponent,
    AllAdviceLifeInsuranceComponent,
    AllAdviceGeneralInsuranceComponent,
   // MiscellaneousAdviceComponent,
    //AdviceSIPComponent,
   // EmailAdviceComponent
  ],
  imports: [
    CommonModule,
    CustomCommonModule,
    AdviceActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CustomDirectiveModule,
  ]
})
export class AdviceActivityModule { }
