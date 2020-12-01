import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionPlanActivityRoutingModule } from './action-plan-activity-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActionPlanActivityComponent } from './action-plan-activity.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AdviceFixedIncomeComponent } from '../advice-activity/advice-fixed-income/advice-fixed-income.component';
import { AdviceRealAssetComponent } from '../advice-activity/advice-real-estate/advice-real-estate.component';
import { AdviceAllPortfolioComponent } from '../advice-activity/advice-all-portfolio/advice-all-portfolio.component';
import { AdviceActivityModule } from '../advice-activity/advice-activity.module';
import { AdviceRetirementAccountComponent } from '../advice-activity/advice-retirement-account/advice-retirement-account.component';
import { AdviceSmallSavingSchemeComponent } from '../advice-activity/advice-small-saving-scheme/advice-small-saving-scheme.component';
import { AdviceCommoditiesComponent } from '../advice-activity/advice-commodities/advice-commodities.component';
import { AdviceCashAndHandComponent } from '../advice-activity/advice-cash-and-hand/advice-cash-and-hand.component';
import { AdviceLibilitiesComponent } from '../advice-activity/advice-libilities/advice-libilities.component';
import { AdviceGeneralInsuranceComponent } from '../advice-activity/advice-general-insurance/advice-general-insurance.component';
import { AdviceLifeInsuranceComponent } from '../advice-activity/advice-life-insurance/advice-life-insurance.component';
import { AdviceMutualFundComponent } from '../advice-activity/advice-mutual-fund/advice-mutual-fund.component';
import { AdviceStocksComponent } from '../advice-activity/advice-stocks/advice-stocks.component';
import { AdviceAssetsComponent } from '../advice-activity/advice-assets/advice-assets.component';
import { AllAdviceFixedDepositComponent } from '../advice-activity/advice-fixed-income/all-advice-fixed-deposit/all-advice-fixed-deposit.component';
import { AllAdviceRealAssetComponent } from '../advice-activity/advice-real-estate/all-advice-real-estate/all-advice-real-estate.component';
import { AllRetirementAssetComponent } from '../advice-activity/advice-retirement-account/all-retirement-asset/all-retirement-asset.component';
import { AllAdviceSmallSavingsSchemeComponent } from '../advice-activity/advice-small-saving-scheme/all-advice-small-savings-scheme/all-advice-small-savings-scheme.component';
import { AllAdviceCashAndHandComponent } from '../advice-activity/advice-cash-and-hand/all-advice-cash-and-hand/all-advice-cash-and-hand.component';
import { AllAdviceCommoditiesComponent } from '../advice-activity/advice-commodities/all-advice-commodities/all-advice-commodities.component';
import { AllAdviceStocksComponent } from '../advice-activity/advice-stocks/all-advice-stocks/all-advice-stocks.component';
import { AdviceActionComponent } from '../advice-activity/advice-action/advice-action.component';
import { AllAdviceGeneralInsuranceComponent } from '../advice-activity/advice-general-insurance/all-advice-general-insurance/all-advice-general-insurance.component';
import { AllAdviceLifeInsuranceComponent } from '../advice-activity/advice-life-insurance/all-advice-life-insurance/all-advice-life-insurance.component';


@NgModule({
  declarations: [ActionPlanActivityComponent,
  ],
  imports: [
    CommonModule,
    ActionPlanActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CustomDirectiveModule,
    AdviceActivityModule
  ]
})
export class ActionPlanActivityModule { }
