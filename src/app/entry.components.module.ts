import { AddPoRdComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-rd/add-po-rd.component';
import { AddPoMisComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-mis/add-po-mis.component';
import { AddPoSavingComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-po-saving/add-po-saving.component';
import { AddScssComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-scss/add-scss.component';
import { AddKvpComponent } from './component/protect-component/customers/component/customer/accounts/assets/smallSavingScheme/common-component/add-kvp/add-kvp.component';
import { LiabilitiesDetailComponent } from './component/protect-component/customers/component/common-component/liabilities-detail/liabilities-detail.component';
import { MfAllocationsComponent } from './component/protect-component/customers/component/customer/plan/goals-plan/mf-allocations/mf-allocations.component';

export const componentList = [
  AddLiabilitiesComponent, AddInsuranceComponent, FixedDepositComponent,
  AddRealEstateComponent, GoldComponent, AddNPSComponent, RecuringDepositComponent, AddEPFComponent,
  OthersComponent, CashInHandComponent, BankAccountsComponent, AddGoalComponent, NpsSchemeHoldingComponent,
  LiabilitiesDetailComponent,
  MfAllocationsComponent
];

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
