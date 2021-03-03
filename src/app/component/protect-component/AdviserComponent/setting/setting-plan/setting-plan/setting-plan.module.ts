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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CommonComponentModule } from 'src/app/component/protect-component/common-component/common-component.module';



@NgModule({
  declarations: [PlanAssetallocationComponent, PlanReturnsinflationComponent, PlanTemplatesComponent, PlanGalleryComponent, SettingPlanComponent,
    PlanKeyParametersComponent,
  ],
  imports: [
    CommonModule,
    SettingPlanRoutingModule,
    MaterialModule,
    FormsModule,
    CustomDirectiveModule,
    ReactiveFormsModule,
    CommonComponentModule,
  ]
})
export class SettingPlanModule { }
