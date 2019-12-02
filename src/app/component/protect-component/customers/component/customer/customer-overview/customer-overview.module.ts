import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerOverviewRoutingModule } from './customer-overview-routing.module';
import { CustomerOverviewComponent } from './customer-overview.component';


@NgModule({
  declarations: [CustomerOverviewComponent],
  imports: [
    CommonModule,
    CustomerOverviewRoutingModule
  ]
})
export class CustomerOverviewModule { }
