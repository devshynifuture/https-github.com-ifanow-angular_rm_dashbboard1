import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerOverviewRoutingModule } from './customer-overview-routing.module';
import { CustomerOverviewComponent } from './customer-overview.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [CustomerOverviewComponent],
  imports: [
    CommonModule,
    CustomerOverviewRoutingModule,
    MaterialModule
  ]
})
export class CustomerOverviewModule { }
