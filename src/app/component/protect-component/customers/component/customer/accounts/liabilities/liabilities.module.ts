import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiabilitiesRoutingModule } from './liabilities-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { LiabilitiesComponent } from './liabilities.component';
import { OtherPayablesComponent } from './other-payables/other-payables.component';


@NgModule({
  declarations: [LiabilitiesComponent, OtherPayablesComponent],
  imports: [
    CommonModule,
    LiabilitiesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ]
})
export class LiabilitiesModule { }
