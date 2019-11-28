import { AddPoRdComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-rd/add-po-rd.component';
import { AddPoMisComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-mis/add-po-mis.component';
import { AddPoSavingComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-saving/add-po-saving.component';
import { AddScssComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-scss/add-scss.component';
import { AddKvpComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-kvp/add-kvp.component';
import { LiabilitiesDetailComponent } from './component/protect-component/customers/component/common-component/liabilities-detail/liabilities-detail.component';
import { DetailedViewFixedDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/fixed-deposit/detailed-view-fixed-deposit/detailed-view-fixed-deposit.component';
import { DetailedViewRecuringDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/recuring-deposit/detailed-view-recuring-deposit/detailed-view-recuring-deposit.component';
import { DetailedViewBondsComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/bonds/detailed-view-bonds/detailed-view-bonds.component';
import { BondsComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/bonds/bonds.component';
import { AddPoTdComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-td/add-po-td.component';
import { AddSsyComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-ssy/add-ssy.component';
import { AddNscComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-nsc/add-nsc.component';
import { AddTransactionComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-transaction/add-transaction.component';
import { AddPpfComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-ppf/add-ppf.component';
import { AddEPSComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-eps/add-eps.component';
import { AddSuperannuationComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { AddGratuityComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-gratuity/add-gratuity.component';
import { NpsSummaryPortfolioComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/nps-summary-portfolio/nps-summary-portfolio.component';
import { NgModule } from '@angular/core';
import { AddLiabilitiesComponent } from './component/protect-component/customers/component/common-component/add-liabilities/add-liabilities.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwnerComponentModule } from './component/protect-component/customers/component/customer/accounts/owner-component/owner-component.module';
import { AddInsuranceComponent } from './component/protect-component/customers/component/common-component/add-insurance/add-insurance.component';
import { FixedDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/fixed-deposit/fixed-deposit.component';
import { AddRealEstateComponent } from './component/protect-component/customers/component/customer/accounts/assets/realEstate/add-real-estate/add-real-estate.component';
import { GoldComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/gold/gold.component';
import { OthersComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/others/others.component';
import { CashInHandComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/cash-in-hand/cash-in-hand.component';
import { BankAccountsComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/bank-accounts/bank-accounts.component';
import { RecuringDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import { AddEPFComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-epf/add-epf.component';
import { AddNPSComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/add-nps.component';
import { AddGoalComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/add-goal/add-goal.component';
import { NpsSchemeHoldingComponent } from "./component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/nps-scheme-holding/nps-scheme-holding.component";
import { DetailedViewEPFComponent } from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-epf/detailed-view-epf/detailed-view-epf.component';
import { DetailedViewGoldComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/gold/detailed-view-gold/detailed-view-gold.component';
import { DetailedViewOthersComponent } from './component/protect-component/customers/component/customer/accounts/assets/commodities/others/detailed-view-others/detailed-view-others.component';
import { DetailedViewBankAccountComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/bank-accounts/detailed-view-bank-account/detailed-view-bank-account.component';
import { DetailedViewCashInHandComponent } from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/cash-in-hand/detailed-view-cash-in-hand/detailed-view-cash-in-hand.component';

export const componentList = [DetailedViewEPFComponent,AddScssComponent,AddKvpComponent,AddPoSavingComponent,AddPoMisComponent,AddSsyComponent,AddNscComponent,AddTransactionComponent,AddPpfComponent,AddEPSComponent,AddSuperannuationComponent,AddGratuityComponent,NpsSummaryPortfolioComponent,AddPoTdComponent,AddPoRdComponent,BondsComponent,AddLiabilitiesComponent, AddInsuranceComponent, FixedDepositComponent,
  AddRealEstateComponent, GoldComponent, AddNPSComponent, RecuringDepositComponent, AddEPFComponent,
  OthersComponent, CashInHandComponent, BankAccountsComponent, AddGoalComponent, NpsSchemeHoldingComponent,LiabilitiesDetailComponent,DetailedViewFixedDepositComponent,DetailedViewRecuringDepositComponent,DetailedViewBondsComponent,DetailedViewGoldComponent,DetailedViewOthersComponent,DetailedViewBankAccountComponent,DetailedViewCashInHandComponent];

@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    OwnerComponentModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule],
  entryComponents: [componentList]
})

export class EntryComponentsModule {

  static getComponentList() {
    return componentList;
  }
}
