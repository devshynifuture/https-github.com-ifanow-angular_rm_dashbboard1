import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerActivityRoutingModule } from './customer-activity-routing.module';
// import { CustomerActivityComponent } from './customer-activity.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerActivityRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ]
})
export class AdviceModule { }
