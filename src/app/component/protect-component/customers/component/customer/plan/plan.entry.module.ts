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
import { AddNewInsuranceComponent } from './insurance-plan/add-new-insurance/add-new-insurance.component';
import { HelthInsurancePolicyComponent } from './insurance-plan/add-insurance-planning/helth-insurance-policy/helth-insurance-policy.component';
import { PlanGoalsComponent } from './scenarios-plan/plan-goals/plan-goals.component';
import { IncomeDetailedViewComponent } from './profile-plan/income/income-detailed-view/income-detailed-view.component';
import { AddInsuranceUpperComponent } from './insurance-plan/add-insurance-upper/add-insurance-upper.component';
import { SetupTaxPlanningComponent } from './texes-plan/setup-tax-planning/setup-tax-planning.component';
import { AddHealthInsuranceComponent } from './insurance-plan/add-health-insurance/add-health-insurance.component';
import { ShowHealthPlanningComponent } from './insurance-plan/show-health-planning/show-health-planning.component';
import { SuggestHealthInsuranceComponent } from './insurance-plan/suggest-health-insurance/suggest-health-insurance.component';
import { AddScenariosComponent } from './scenarios-plan/add-scenarios/add-scenarios.component';
import { HealthInsuranceComponent } from './insurance-plan/mainInsuranceScreen/health-insurance/health-insurance.component';
import { LifeInsuranceComponent } from './insurance-plan/mainInsuranceScreen/life-insurance/life-insurance.component';
import { CancerInsuranceComponent } from './insurance-plan/mainInsuranceScreen/cancer-insurance/cancer-insurance.component';
import { CriticalInsuranceComponent } from './insurance-plan/mainInsuranceScreen/critical-insurance/critical-insurance.component';
import { FireInsuranceComponent } from './insurance-plan/mainInsuranceScreen/fire-insurance/fire-insurance.component';
import { HouseholdersInsuranceComponent } from './insurance-plan/mainInsuranceScreen/householders-insurance/householders-insurance.component';
import { PersonalInsuranceComponent } from './insurance-plan/mainInsuranceScreen/personal-insurance/personal-insurance.component';
import { InsurancePlanModule } from './insurance-plan/insurance-plan.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchSchemeComponent } from './deployments-plan/search-scheme/search-scheme.component';
import { AddAmountComponent } from './deployments-plan/add-amount/add-amount.component';
import { Ng5SliderModule } from 'ng5-slider';
import { SingleGoalYearComponent } from './goals-plan/single-goal-year/single-goal-year.component';
import { MultiYearGoalComponent } from './goals-plan/multi-year-goal/multi-year-goal.component';

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
  AddNewInsuranceComponent,
  PlanGoalsComponent,
  HelthInsurancePolicyComponent,
  IncomeDetailedViewComponent,
  AddInsuranceUpperComponent,
  SetupTaxPlanningComponent,
  AddHealthInsuranceComponent,
  ShowHealthPlanningComponent,
  AddScenariosComponent,
  SuggestHealthInsuranceComponent,
  HealthInsuranceComponent,
  SearchSchemeComponent,
  AddAmountComponent
];
// import { AddPlaninsuranceComponent } from './insurance-plan/add-planinsurance/add-planinsurance.component';

// export const componentList = [
//   AddPlaninsuranceComponent

// ];

@NgModule({
  declarations: [...componentList,  CancerInsuranceComponent,CashflowTableEditDirective, CriticalInsuranceComponent, FireInsuranceComponent, HouseholdersInsuranceComponent, PersonalInsuranceComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    InsurancePlanModule,
    DragDropModule,
    Ng5SliderModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    Ng5SliderModule],
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
