import { CashflowsPlanComponent } from './cashflows-plan/cashflows-plan.component';
import { ScenariosPlanComponent } from './scenarios-plan/scenarios-plan.component';
import { InvestmentsPlanComponent } from './investments-plan/investments-plan.component';
import { TexesPlanComponent } from './texes-plan/texes-plan.component';
import { GoalsPlanComponent } from './goals-plan/goals-plan.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { ProfilePlanComponent } from './profile-plan/profile-plan.component';
import { SummaryPlanComponent } from './summary-plan/summary-plan.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanComponent } from "./plan.component";
// import {CustomerComponent} from './component/customer/customer.component';


const routes: Routes = [{
  path: '',
  component: PlanComponent,
  children: [
    {
      path: 'summary',
      component: SummaryPlanComponent
    },
    {
      path: 'profile',
      component: ProfilePlanComponent
    },
    {
      path: 'insurance',
      component: InsurancePlanComponent
    },
    {
      path: 'goals',
      component: GoalsPlanComponent
    },
    {
      path: 'taxes',
      component: TexesPlanComponent
    },
    {
      path: 'cash-flow',
      component: CashflowsPlanComponent
    },
    {
      path: 'investments',
      component: InvestmentsPlanComponent
    },
    {
      path: 'scenarios',
      component: ScenariosPlanComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule {
}
