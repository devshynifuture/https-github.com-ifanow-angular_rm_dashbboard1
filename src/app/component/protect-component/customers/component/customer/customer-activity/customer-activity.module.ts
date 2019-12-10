import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerActivityRoutingModule } from './customer-activity-routing.module';
import { CustomerActivityComponent } from './customer-activity.component';


@NgModule({
  declarations: [CustomerActivityComponent],
  imports: [
    CommonModule,
    CustomerActivityRoutingModule
  ]
})
export class CustomerActivityModule { }
