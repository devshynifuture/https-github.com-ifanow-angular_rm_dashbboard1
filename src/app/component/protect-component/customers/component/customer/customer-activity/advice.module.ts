import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerActivityRoutingModule } from './customer-activity-routing.module';
// import { CustomerActivityComponent } from './customer-activity.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { CommonComponentModule } from 'src/app/component/protect-component/common-component/common-component.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomCommonModule,
    CustomerActivityRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    CommonModule,
    MaterialModule,
    CommonComponentModule,
    ReactiveFormsModule,
    FormsModule,
    CustomDirectiveModule,
  ]
})
export class AdviceModule { }
