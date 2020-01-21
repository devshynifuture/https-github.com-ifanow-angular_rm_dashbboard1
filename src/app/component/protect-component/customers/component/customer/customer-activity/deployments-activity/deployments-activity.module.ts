import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeploymentsActivityRoutingModule } from './deployments-activity-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeploymentsActivityComponent } from './deployments-activity.component';


@NgModule({
  declarations: [DeploymentsActivityComponent],
  imports: [
    CommonModule,
    DeploymentsActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DeploymentsActivityModule { }
