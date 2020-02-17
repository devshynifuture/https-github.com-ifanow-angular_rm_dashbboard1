import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingPlanRoutingModule } from './setting-plan-routing.module';
import { PlanAssetallocationComponent } from './plan-assetallocation/plan-assetallocation.component';
import { PlanReturnsinflationComponent } from './plan-returnsinflation/plan-returnsinflation.component';
import { PlanKeyParametersComponent } from './plan-key-parameters/plan-key-parameters.component';
import { PlanTemplatesComponent } from './plan-templates/plan-templates.component';
import { PlanGalleryComponent } from './plan-gallery/plan-gallery.component';
import { SettingPlanComponent } from '../setting-plan.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [PlanAssetallocationComponent, PlanReturnsinflationComponent, PlanKeyParametersComponent, PlanTemplatesComponent, PlanGalleryComponent, SettingPlanComponent],
  imports: [
    CommonModule,
    SettingPlanRoutingModule,
    MaterialModule
  ]
})
export class SettingPlanModule { }
