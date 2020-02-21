import { NgModule } from '@angular/core';
import { ScenariosPlanComponent } from './scenarios-plan/scenarios-plan.component';
import { CashflowsPlanComponent } from './cashflows-plan/cashflows-plan.component';
import { ProfilePlanComponent } from './profile-plan/profile-plan.component';
import { DeploymentsPlanComponent } from './deployments-plan/deployments-plan.component';
import { GoalsPlanComponent } from './goals-plan/goals-plan.component';
import { SummaryPlanComponent } from './summary-plan/summary-plan.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { PlanComponent } from './plan.component';
import { TexesPlanComponent } from './texes-plan/texes-plan.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../../material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddScenariosComponent } from './scenarios-plan/add-scenarios/add-scenarios.component';
import { AddInvestmentPlanComponent } from './deployments-plan/add-investment-plan/add-investment-plan.component';
import { AddProfilePlanComponent } from './profile-plan/add-profile-plan/add-profile-plan.component';
import { HistoryRiskProfileComponent } from './profile-plan/history-risk-profile/history-risk-profile.component';
// import {BrowserModule} from '@angular/platform-browser';
import { PlanRoutingModule } from "./plan-routing.module";
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { ManageDeploymentComponent } from './deployments-plan/manage-deployment/manage-deployment.component';
import { ManageExclusionsComponent } from './deployments-plan/manage-exclusions/manage-exclusions.component';
import { SelectAssetClassComponent } from './deployments-plan/select-asset-class/select-asset-class.component';
import { DeploymentDetailsComponent } from './deployments-plan/deployment-details/deployment-details.component';
import { CashflowPlanIncomeComponent } from './cashflows-plan/cashflow-plan-income/cashflow-plan-income.component';
import { CashflowPlanExpenseComponent } from './cashflows-plan/cashflow-plan-expense/cashflow-plan-expense.component';
import { CashflowPlanLiabilitiesComponent } from './cashflows-plan/cashflow-plan-liabilities/cashflow-plan-liabilities.component';
import { CashflowPlanAssetsComponent } from './cashflows-plan/cashflow-plan-assets/cashflow-plan-assets.component';
import { CashflowPlanInsuranceComponent } from './cashflows-plan/cashflow-plan-insurance/cashflow-plan-insurance.component';
import { CashflowPlanSurplusComponent } from './cashflows-plan/cashflow-plan-surplus/cashflow-plan-surplus.component';
import { CashflowUpperIncomeComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-income/cashflow-upper-income.component';
import { CashflowUpperExpenseComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-expense/cashflow-upper-expense.component';
import { CashflowUpperLiabilitiesComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-liabilities/cashflow-upper-liabilities.component';
import { AddNewInsuranceComponent } from './insurance-plan/add-new-insurance/add-new-insurance.component';
// import { AddInsurancePlanningComponent } from './insurance-plan/add-insurance-planning/add-insurance-planning.component';
// import { EditApplicableTaxComponent } from './texes-plan/edit-applicable-tax/edit-applicable-tax.component';
// import { SetupLumpsumDeploymentComponent } from './investments-plan/add-investment-plan/setup-lumpsum-deployment/setup-lumpsum-deployment.component';
//import { EditTaxComputationComponent } from './texes-plan/edit-tax-computation/edit-tax-computation.component';
// import { CashflowUpperAssetComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-asset/cashflow-upper-asset.component';
// import { CashflowUpperIncomeComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-income/cashflow-upper-income.component';

// import { IncomeComponent } from './profile-plan/income/income.component';
// import { ExpensesComponent } from '../accounts/expenses/expenses.component';
// import { RiskProfileComponent } from './profile-plan/riskProfile/risk-profile/risk-profile.component';
// import { CashflowUpperSliderComponent } from './cashflows-plan/cashflow-upper-slider/cashflow-upper-slider.component';

// import { AddGoalsComponent } from './add-goals/add-goals.component';


// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [
    PlanComponent,
    // SummaryPlanComponent,
    // ProfilePlanComponent,
    // InsurancePlanComponent,
    // GoalsPlanComponent,
    CashflowsPlanComponent,
    DeploymentsPlanComponent,
    ScenariosPlanComponent,
    TexesPlanComponent,
    AddScenariosComponent,
    AddInvestmentPlanComponent,
    ManageDeploymentComponent,
    ManageExclusionsComponent,
    CashflowPlanIncomeComponent,
    CashflowPlanExpenseComponent,
    CashflowPlanLiabilitiesComponent,
    CashflowPlanAssetsComponent,
    CashflowPlanInsuranceComponent,
    CashflowPlanSurplusComponent,


    // DeploymentDetailsComponent,
    // AddInsurancePlanningComponent,
    // EditApplicableTaxComponent,
    // SetupLumpsumDeploymentComponent,
    //EditTaxComputationComponent,
    // AddProfilePlanComponent,
    // IncomeComponent,
    // ExpensesComponent,
    // RiskProfileComponent,
  ],
  imports: [
    PlanRoutingModule,
    // PlanEntryModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ],
  // exports: [PlanComponent, AddScenariosComponent, AddInvestmentPlanComponent,
  //   AddProfilePlanComponent, HistoryRiskProfileComponent, RiskProfileComponent],
  entryComponents: [AddScenariosComponent, ManageDeploymentComponent, ManageExclusionsComponent]
})
export class PlanModule {
}
