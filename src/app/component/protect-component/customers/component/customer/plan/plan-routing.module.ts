import { CashflowsPlanComponent } from './cashflows-plan/cashflows-plan.component';
import { ScenariosPlanComponent } from './scenarios-plan/scenarios-plan.component';
import { DeploymentsPlanComponent } from './deployments-plan/deployments-plan.component';
import { TexesPlanComponent } from './texes-plan/texes-plan.component';
import { GoalsPlanComponent } from './goals-plan/goals-plan.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { ProfilePlanComponent } from './profile-plan/profile-plan.component';
import { SummaryPlanComponent } from './summary-plan/summary-plan.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanComponent } from './plan.component';
// import {CustomerComponent} from './component/customer/customer.component';


const routes: Routes = [{
  path: '',
  component: PlanComponent,
  children: [
    {
      path: 'summary',
      loadChildren: () => import('./summary-plan/plan-summary.module').then(m => m.PlanSummaryModule)
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile-plan/profile-plan.module').then(m => m.ProfilePlanModule)
    },
    {
      path: 'insurance',
      loadChildren: () => import('./insurance-plan/insurance-plan.module').then(m => m.InsurancePlanModule)
    },
    {
      path: 'goals',
      loadChildren: () => import('./goals-plan/plan-goals.module').then(m => m.PlanGoalsModule)
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
      component: DeploymentsPlanComponent
    },
    {
      path: 'scenarios',
      component: ScenariosPlanComponent
    },
    {
      path: '',
      redirectTo: 'summary',
      pathMatch: 'full'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule {
}
