import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsInsuranceRoutingModule } from './accounts-insurance-routing.module';
import { AccountsInsuranceComponent } from './accounts-insurance.component';
import { InsuranceComponent } from '../insurance/insurance.component';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [AccountsInsuranceComponent, InsuranceComponent],
  imports: [
    CommonModule,
    AccountsInsuranceRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AccountsInsuranceModule { }
