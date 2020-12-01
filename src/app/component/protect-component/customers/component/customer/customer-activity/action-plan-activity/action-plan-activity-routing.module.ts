import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActionPlanActivityComponent } from './action-plan-activity.component';
import { AdviceAllPortfolioComponent } from '../advice-activity/advice-all-portfolio/advice-all-portfolio.component';
import { AdviceMutualFundComponent } from '../advice-activity/advice-mutual-fund/advice-mutual-fund.component';
import { AdviceAssetsComponent } from '../advice-activity/advice-assets/advice-assets.component';
import { AdviceStocksComponent } from '../advice-activity/advice-stocks/advice-stocks.component';
import { AdviceFixedIncomeComponent } from '../advice-activity/advice-fixed-income/advice-fixed-income.component';
import { AdviceRealAssetComponent } from '../advice-activity/advice-real-estate/advice-real-estate.component';
import { AdviceRetirementAccountComponent } from '../advice-activity/advice-retirement-account/advice-retirement-account.component';
import { AdviceSmallSavingSchemeComponent } from '../advice-activity/advice-small-saving-scheme/advice-small-saving-scheme.component';
import { AdviceCashAndHandComponent } from '../advice-activity/advice-cash-and-hand/advice-cash-and-hand.component';
import { AdviceCommoditiesComponent } from '../advice-activity/advice-commodities/advice-commodities.component';
import { AdviceLibilitiesComponent } from '../advice-activity/advice-libilities/advice-libilities.component';
import { AdviceLifeInsuranceComponent } from '../advice-activity/advice-life-insurance/advice-life-insurance.component';
import { AdviceGeneralInsuranceComponent } from '../advice-activity/advice-general-insurance/advice-general-insurance.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: ActionPlanActivityComponent
  // }
  {
    path: '',
    component: ActionPlanActivityComponent,
    children: [
      {
        path: 'all-portfolio',
        component: AdviceAllPortfolioComponent
      },
      {
        path: '',
        redirectTo: 'all-portfolio',
        pathMatch: 'full'
      },
      {
        path: 'mutualFund',
        component: AdviceMutualFundComponent
      }, {
        path: 'stocks',
        component: AdviceStocksComponent
      }, {
        path: 'asset',
        component: AdviceAssetsComponent
      }, {
        path: 'fixedIncome',
        component: AdviceFixedIncomeComponent
      }, {
        path: 'realAsset',
        component: AdviceRealAssetComponent
      }, {
        path: 'retirement',
        component: AdviceRetirementAccountComponent
      }, {
        path: 'smallSavingScheme',
        component: AdviceSmallSavingSchemeComponent
      }, {
        path: 'cashHand',
        component: AdviceCashAndHandComponent
      }, {
        path: 'commodities',
        component: AdviceCommoditiesComponent
      }, {
        path: 'libilities',
        component: AdviceLibilitiesComponent
      }, {
        path: 'lifeInsurance',
        component: AdviceLifeInsuranceComponent
      }, {
        path: 'generalInsurance',
        component: AdviceGeneralInsuranceComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionPlanActivityRoutingModule { }
