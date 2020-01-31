import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdviceActivityComponent } from './advice-activity.component';
import { AdviceAllPortfolioComponent } from './advice-all-portfolio/advice-all-portfolio.component';
import { AdviceMutualFundComponent } from './advice-mutual-fund/advice-mutual-fund.component';
import { AdviceAssetsComponent } from './advice-assets/advice-assets.component';
import { AdviceFixedIncomeComponent } from './advice-fixed-income/advice-fixed-income.component';
import { AdviceRealAssetComponent } from './advice-real-asset/advice-real-asset.component';
import { AdviceRetirementAccountComponent } from './advice-retirement-account/advice-retirement-account.component';
import { AdviceSmallSavingSchemeComponent } from './advice-small-saving-scheme/advice-small-saving-scheme.component';
import { AdviceLifeInsuranceComponent } from './advice-life-insurance/advice-life-insurance.component';
import { AdviceCommoditiesComponent } from './advice-commodities/advice-commodities.component';
import { AdviceCashAndHandComponent } from './advice-cash-and-hand/advice-cash-and-hand.component';
import { AdviceLibilitiesComponent } from './advice-libilities/advice-libilities.component';
import { AdviceGeneralInsuranceComponent } from './advice-general-insurance/advice-general-insurance.component';
import { AdviceStocksComponent } from './advice-stocks/advice-stocks.component';


const routes: Routes = [
  {
    path: '',
    component : AdviceActivityComponent,
    children: [
    {
      path: 'all-portfolio',
      component: AdviceAllPortfolioComponent
    },
    {
      path:'',
      redirectTo:'all-portfolio',
      pathMatch:'full'
    },
    {
      path: 'mutualFund',
      component: AdviceMutualFundComponent
    },{
      path: 'stocks',
      component: AdviceStocksComponent
    },  {
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
    },{
      path: 'cashHand',
      component: AdviceCashAndHandComponent
    },{
      path: 'commodities',
      component: AdviceCommoditiesComponent
    },{
      path: 'libilities',
      component: AdviceLibilitiesComponent
    },{
      path: 'lifeInsurance',
      component: AdviceLifeInsuranceComponent
    },{
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
export class AdviceActivityRoutingModule { }
