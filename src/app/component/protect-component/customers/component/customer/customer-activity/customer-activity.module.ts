import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerActivityRoutingModule } from './customer-activity-routing.module';
import { CustomerActivityComponent } from './customer-activity.component';
import { MaterialModule } from 'src/app/material/material';
import { DeploymentsPlanComponent } from '../plan/deployments-plan/deployments-plan.component';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { ManageExclusionsComponent } from '../plan/deployments-plan/manage-exclusions/manage-exclusions.component';
import { ManageDeploymentComponent } from '../plan/deployments-plan/manage-deployment/manage-deployment.component';

@NgModule({
  declarations: [
    CustomerActivityComponent,
    DeploymentsPlanComponent,
    ManageExclusionsComponent,
    ManageDeploymentComponent
  ],
  imports: [
    CommonModule,
    CustomerActivityRoutingModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ],
  entryComponents: [ManageDeploymentComponent, ManageExclusionsComponent]
})
export class CustomerActivityModule { }
