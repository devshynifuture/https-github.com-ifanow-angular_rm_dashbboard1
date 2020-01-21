import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdviceActivityComponent } from './advice-activity.component';


const routes: Routes = [
  {
    path: '',
    component: AdviceActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdviceActivityRoutingModule { }
