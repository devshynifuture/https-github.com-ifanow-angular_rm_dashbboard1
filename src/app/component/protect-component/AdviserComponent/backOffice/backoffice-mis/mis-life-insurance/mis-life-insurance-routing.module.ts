import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MisLifeInsuranceComponent } from './mis-life-insurance.component';


const routes: Routes = [
  {
    path: '',
    component: MisLifeInsuranceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisLifeInsuranceRoutingModule { }
