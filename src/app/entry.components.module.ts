import {NgModule} from '@angular/core';
import {AddLiabilitiesComponent} from './component/protect-component/customers/component/common-component/add-liabilities/add-liabilities.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from './material/material';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwnerComponentModule} from './component/protect-component/customers/component/customer/accounts/owner-component/owner-component.module';
import {AddInsuranceComponent} from './component/protect-component/customers/component/common-component/add-insurance/add-insurance.component';
import {FixedDepositComponent} from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/fixed-deposit/fixed-deposit.component';
import {AddRealEstateComponent} from './component/protect-component/customers/component/customer/accounts/assets/realEstate/add-real-estate/add-real-estate.component';
import {GoldComponent} from './component/protect-component/customers/component/customer/accounts/assets/commodities/gold/gold.component';
import {OthersComponent} from './component/protect-component/customers/component/customer/accounts/assets/commodities/others/others.component';
import {CashInHandComponent} from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/cash-in-hand/cash-in-hand.component';
import {BankAccountsComponent} from './component/protect-component/customers/component/customer/accounts/assets/cash&bank/bank-accounts/bank-accounts.component';
import {RecuringDepositComponent} from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import {AddEPFComponent} from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-epf/add-epf.component';
import {AddNPSComponent} from './component/protect-component/customers/component/customer/accounts/assets/retirementAccounts/add-nps/add-nps.component';
import { LiabilitiesDetailComponent } from './component/protect-component/customers/component/common-component/liabilities-detail/liabilities-detail.component';
import { DetailedViewFixedDepositComponent } from './component/protect-component/customers/component/customer/accounts/assets/fixedIncome/fixed-deposit/detailed-view-fixed-deposit/detailed-view-fixed-deposit.component';

export const componentList = [AddLiabilitiesComponent, AddInsuranceComponent, FixedDepositComponent,
  AddRealEstateComponent, GoldComponent, AddNPSComponent, RecuringDepositComponent, AddEPFComponent,
  OthersComponent, CashInHandComponent, BankAccountsComponent,LiabilitiesDetailComponent,DetailedViewFixedDepositComponent,];

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
