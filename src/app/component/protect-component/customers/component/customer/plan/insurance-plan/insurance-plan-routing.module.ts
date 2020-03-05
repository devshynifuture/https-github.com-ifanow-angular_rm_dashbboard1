import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllInsurancelistComponent } from './mainInsuranceScreen/all-insurancelist/all-insurancelist.component';


const routes: Routes = [
  {
    path: '',
    component: AllInsurancelistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurancePlanRoutingModule { }
