import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionUpperSliderComponent } from './subscription/common-subscription-component/upper-slider/subscription-upper-slider.component';


const routes: Routes = [
  {
    path: '',
    component: SubscriptionUpperSliderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionUpperRoutingModule { }
