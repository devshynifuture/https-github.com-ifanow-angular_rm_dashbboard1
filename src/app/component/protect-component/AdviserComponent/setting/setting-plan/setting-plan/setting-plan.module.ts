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
import { OpenGalleryPlanComponent } from './plan-gallery/open-gallery-plan/open-gallery-plan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PlanAssetallocationComponent, PlanReturnsinflationComponent, PlanTemplatesComponent, PlanGalleryComponent, SettingPlanComponent,
    PlanKeyParametersComponent],
  imports: [
    CommonModule,
    SettingPlanRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SettingPlanModule { }
