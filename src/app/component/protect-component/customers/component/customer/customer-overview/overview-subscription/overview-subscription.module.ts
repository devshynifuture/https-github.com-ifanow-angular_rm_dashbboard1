import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewSubscriptionRoutingModule } from './overview-subscription-routing.module';
import { OverviewSubscriptionComponent } from './overview-subscription.component';


@NgModule({
  declarations: [OverviewSubscriptionComponent],
  imports: [
    CommonModule,
    OverviewSubscriptionRoutingModule
  ]
})
export class OverviewSubscriptionModule { }
