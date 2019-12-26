import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsurancePlanComponent } from './insurance-plan.component';


const routes: Routes = [
  {
    path: '',
    component: InsurancePlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurancePlanRoutingModule { }
