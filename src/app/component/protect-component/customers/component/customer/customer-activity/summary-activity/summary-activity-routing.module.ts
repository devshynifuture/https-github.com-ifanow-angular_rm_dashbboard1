import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryActivityComponent } from './summary-activity.component';


const routes: Routes = [
  {
    path: '',
    component: SummaryActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryActivityRoutingModule { }
