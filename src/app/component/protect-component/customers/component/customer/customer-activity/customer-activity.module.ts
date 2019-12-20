import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerActivityRoutingModule } from './customer-activity-routing.module';
import { CustomerActivityComponent } from './customer-activity.component';
import { MaterialModule } from 'src/app/material/material';
import { AdviceActivityComponent } from './advice-activity/advice-activity.component';
import { DeploymentsActivityComponent } from './deployments-activity/deployments-activity.component';



@NgModule({
  declarations: [CustomerActivityComponent, AdviceActivityComponent, DeploymentsActivityComponent],
  imports: [
    CommonModule,
    CustomerActivityRoutingModule,
    MaterialModule
  ]
})
export class CustomerActivityModule { }
