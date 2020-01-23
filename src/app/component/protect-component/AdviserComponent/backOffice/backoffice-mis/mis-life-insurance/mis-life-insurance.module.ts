import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisLifeInsuranceRoutingModule } from './mis-life-insurance-routing.module';
import { MisLifeInsuranceComponent } from './mis-life-insurance.component';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MisLifeInsuranceComponent],
  imports: [
    CommonModule,
    MisLifeInsuranceRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MisLifeInsuranceModule { }
