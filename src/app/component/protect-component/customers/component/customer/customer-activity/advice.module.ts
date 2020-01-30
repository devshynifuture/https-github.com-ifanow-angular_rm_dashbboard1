import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerActivityRoutingModule } from './customer-activity-routing.module';
import { CustomerActivityComponent } from './customer-activity.component';
import { MaterialModule } from 'src/app/material/material';

@NgModule({
  declarations: [CustomerActivityComponent],
  imports: [
    CommonModule,
    CustomerActivityRoutingModule,
    MaterialModule
  ]
})
export class AdviceModule { }
