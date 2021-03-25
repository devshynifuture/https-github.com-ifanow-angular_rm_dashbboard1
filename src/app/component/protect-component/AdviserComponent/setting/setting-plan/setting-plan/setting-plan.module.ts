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
import { ReturnsInflationHeaderComponent } from './returns-inflation-header/returns-inflation-header.component';
import { PlanReturnInflationComponent } from './returns-inflation-header/plan-return-inflation/plan-return-inflation.component';
import { InsuranceReturnInflationComponent } from './returns-inflation-header/insurance-return-inflation/insurance-return-inflation.component';
import { ExpenesReturnInflationComponent } from './returns-inflation-header/expenes-return-inflation/expenes-return-inflation.component';



@NgModule({
  declarations: [PlanAssetallocationComponent, PlanReturnsinflationComponent, PlanTemplatesComponent, PlanGalleryComponent, SettingPlanComponent,
    PlanKeyParametersComponent,
    ReturnsInflationHeaderComponent,
    PlanReturnInflationComponent,
    InsuranceReturnInflationComponent,
    ExpenesReturnInflationComponent,
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
