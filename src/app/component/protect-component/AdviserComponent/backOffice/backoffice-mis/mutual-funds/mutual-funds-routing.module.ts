import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MutualFundsComponent } from './mutual-funds.component';


const routes: Routes = [
  {
    path: '',
    component: MutualFundsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MutualFundsRoutingModule { }
