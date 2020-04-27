import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerOverviewRoutingModule } from './customer-overview-routing.module';
import { CustomerOverviewComponent } from './customer-overview.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomerOverviewEntryModule } from './customer-overview-entry-module';
import { MatButtonToggleModule, MatExpansionModule } from '@angular/material';
import { NgCircleProgressModule } from 'ng-circle-progress';



@NgModule({
  declarations: [CustomerOverviewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    CustomerOverviewRoutingModule,
    CustomerOverviewEntryModule,
    MatButtonToggleModule,
    MatExpansionModule,
    NgCircleProgressModule
  ]
})
export class CustomerOverviewModule { }
