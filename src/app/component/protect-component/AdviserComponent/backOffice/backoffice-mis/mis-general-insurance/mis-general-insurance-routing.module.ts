import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MisGeneralInsuranceComponent } from './mis-general-insurance.component';


const routes: Routes = [
  {
    path: '',
    component: MisGeneralInsuranceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisGeneralInsuranceRoutingModule { }
