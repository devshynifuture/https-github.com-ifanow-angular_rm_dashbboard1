import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisGeneralInsuranceRoutingModule } from './mis-general-insurance-routing.module';
import { MisGeneralInsuranceComponent } from './mis-general-insurance.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MisGeneralInsuranceComponent],
  imports: [
    CommonModule,
    MisGeneralInsuranceRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MisGeneralInsuranceModule { }
