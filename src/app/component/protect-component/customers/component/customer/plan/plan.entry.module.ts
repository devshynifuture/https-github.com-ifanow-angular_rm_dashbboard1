import { CustomDirectiveModule } from './../../../../../../common/directives/common-directive.module';
import { InputValueValidationDirective } from './../../../../../../common/directives/input-value-validation.directive';
import { AddProfilePlanComponent } from './profile-plan/add-profile-plan/add-profile-plan.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../../material/material';
import { PreferencesComponent } from './goals-plan/preferences/preferences.component';
import { AddGoalComponent } from './goals-plan/add-goal/add-goal.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CashflowUpperSliderComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-slider.component';
import { CashflowAddComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-add/cashflow-add.component';
import { CashflowUpperAssetComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-asset/cashflow-upper-asset.component';
import { CashflowUpperInsuranceComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-insurance/cashflow-upper-insurance.component';
import { CashflowUpperSurplusComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-surplus/cashflow-upper-surplus.component';
import { CashflowAddIncomeComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-add/cashflow-add-income/cashflow-add-income.component';
import { CashflowAddExpensesComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-add/cashflow-add-expenses/cashflow-add-expenses.component';
import { CashflowAddSurplusComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-add/cashflow-add-surplus/cashflow-add-surplus.component';
import { CashflowAddLiabilitiesComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-add/cashflow-add-liabilities/cashflow-add-liabilities.component';
import { CashflowTableEditDirective } from './cashflows-plan/cashflow-table-edit.directive';
import { EditTaxComputationComponent } from './texes-plan/edit-tax-computation/edit-tax-computation.component';
import { AddIncomeComponent } from './profile-plan/income/add-income/add-income.component';
import { AddIncomeFamilyMemberComponent } from './profile-plan/income/add-income-family-member/add-income-family-member.component';
import { AddIncomeSourceComponent } from './profile-plan/income/add-income-source/add-income-source.component';
import { IndividualIncomeInfoComponent } from './profile-plan/income/individual-income-info/individual-income-info.component';
import { SetupLumpsumDeploymentComponent } from './deployments-plan/add-investment-plan/setup-lumpsum-deployment/setup-lumpsum-deployment.component';
import { EditApplicableTaxComponent } from './texes-plan/edit-applicable-tax/edit-applicable-tax.component';
import { AddInsurancePlanningComponent } from './insurance-plan/add-insurance-planning/add-insurance-planning.component';
import { DeploymentDetailsComponent } from './deployments-plan/deployment-details/deployment-details.component';
import { SelectAssetClassComponent } from './deployments-plan/select-asset-class/select-asset-class.component';
import { CashflowUpperIncomeComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-income/cashflow-upper-income.component';
import { CashflowUpperExpenseComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-expense/cashflow-upper-expense.component';
import { CashflowUpperLiabilitiesComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-liabilities/cashflow-upper-liabilities.component';

export const componentList = [
  PreferencesComponent,
  AddGoalComponent,
  AddProfilePlanComponent,
  CashflowUpperSliderComponent,
  CashflowAddComponent,
  CashflowUpperAssetComponent,
  CashflowUpperInsuranceComponent,
  CashflowUpperSurplusComponent,
  CashflowAddIncomeComponent,
  CashflowAddExpensesComponent,
  CashflowAddLiabilitiesComponent,
  CashflowAddSurplusComponent,
  EditTaxComputationComponent,
  AddIncomeComponent,
  AddIncomeFamilyMemberComponent,
  AddIncomeSourceComponent,
  IndividualIncomeInfoComponent,
  SetupLumpsumDeploymentComponent,
  EditApplicableTaxComponent,
  AddInsurancePlanningComponent,
  DeploymentDetailsComponent,
  SelectAssetClassComponent,
  CashflowUpperIncomeComponent,
  CashflowUpperExpenseComponent,
  CashflowUpperLiabilitiesComponent,
];
// import { AddPlaninsuranceComponent } from './insurance-plan/add-planinsurance/add-planinsurance.component';

// export const componentList = [
//   AddPlaninsuranceComponent

// ];

@NgModule({
  declarations: [...componentList, CashflowTableEditDirective],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule],
  entryComponents: [componentList],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})

export class PlanEntryModule {
  static getComponentList() {
    return componentList;
  }
}
