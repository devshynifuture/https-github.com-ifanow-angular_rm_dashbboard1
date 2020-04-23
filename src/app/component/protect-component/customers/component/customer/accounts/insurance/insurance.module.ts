import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { InsuranceComponent } from './insurance.component';
import { AddPersonalAccidentInAssetComponent } from './add-personal-accident-in-asset/add-personal-accident-in-asset.component';
import { AddCriticalIllnessInAssetComponent } from './add-critical-illness-in-asset/add-critical-illness-in-asset.component';
import { AddMotorInsuranceInAssetComponent } from './add-motor-insurance-in-asset/add-motor-insurance-in-asset.component';
import { AddTravelInsuranceInAssetComponent } from './add-travel-insurance-in-asset/add-travel-insurance-in-asset.component';
import { AddHomeInsuranceInAssetComponent } from './add-home-insurance-in-asset/add-home-insurance-in-asset.component';
import { AddFireAndPerilsInsuranceInAssetComponent } from './add-fire-and-perils-insurance-in-asset/add-fire-and-perils-insurance-in-asset.component';


@NgModule({
  declarations: [InsuranceComponent, AddPersonalAccidentInAssetComponent, AddCriticalIllnessInAssetComponent, AddMotorInsuranceInAssetComponent, AddTravelInsuranceInAssetComponent, AddHomeInsuranceInAssetComponent, AddFireAndPerilsInsuranceInAssetComponent],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ]
  ,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class InsuranceModule { }
