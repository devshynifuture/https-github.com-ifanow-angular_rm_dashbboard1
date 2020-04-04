import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeMisRoutingModule } from './backoffice-mis-routing.module';
import { BackofficeMisComponent } from './backoffice-mis.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';


@NgModule({
  declarations: [BackofficeMisComponent],
  imports: [
    CommonModule,
    BackofficeMisRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    CustomDirectiveModule
  ]
})
export class BackofficeMisModule { }
